/* --- CONFIGURAZIONE COSTI NAVI (Standard OGame + Lifeforms) --- */
// Formato: Metallo, Cristallo, Deuterio
const SHIPS = {
    202: { m: 3000, c: 1000, d: 0, name: "Light Fighter" },
    203: { m: 6000, c: 4000, d: 0, name: "Heavy Fighter" },
    204: { m: 20000, c: 7000, d: 2000, name: "Cruiser" },
    205: { m: 45000, c: 15000, d: 0, name: "Battleship" },
    206: { m: 10000, c: 20000, d: 10000, name: "Colony Ship" },
    207: { m: 10000, c: 6000, d: 2000, name: "Recycler" },
    208: { m: 0, c: 1000, d: 0, name: "Espionage Probe" },
    209: { m: 50000, c: 25000, d: 15000, name: "Bomber" },
    210: { m: 0, c: 2000, d: 500, name: "Solar Satellite" },
    211: { m: 60000, c: 50000, d: 15000, name: "Destroyer" },
    212: { m: 5000000, c: 4000000, d: 1000000, name: "Deathstar" },
    213: { m: 85000, c: 55000, d: 15000, name: "Reaper" },
    214: { m: 8000, c: 15000, d: 8000, name: "Pathfinder" }, 
    215: { m: 30000, c: 40000, d: 15000, name: "Battlecruiser" },
    218: { m: 2000, c: 2000, d: 1000, name: "Crawler" },
    219: { m: 8000, c: 15000, d: 8000, name: "Pathfinder" }
};

let parsedPlayers = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-parse').addEventListener('click', parseRawData);
    document.getElementById('btn-recalc').addEventListener('click', calculateDistribution);
    document.getElementById('btn-copy').addEventListener('click', copyToClipboard);
});

/* --- PARSING LOGIC --- */
function parseRawData() {
    const rawCR = document.getElementById('raw-cr').value;
    const rawRR = document.getElementById('raw-rr').value;
    const statusDiv = document.getElementById('parse-status');
    // Quale ruolo stiamo cercando? (attacker o defender)
    const role = document.querySelector('input[name="role"]:checked').value; 

    parsedPlayers = [];
    
    try {
        if (!rawCR || rawCR.length < 50) throw new Error("Incolla un Combat Report valido.");

        // 1. TROVARE I GIOCATORI E LA FLOTTA INIZIALE
        // La sezione inizia con [attackers] => Array o [defenders] => Array
        const roleSectionRegex = role === 'attacker' ? /\[attackers\] => Array/ : /\[defenders\] => Array/;
        const splitByRole = rawCR.split(roleSectionRegex);
        
        if (splitByRole.length < 2) throw new Error(`Sezione ${role} non trovata nel RAW.`);
        
        // Prendiamo il blocco di testo relativo a quel ruolo
        const roleContent = splitByRole[1].split(/\[(rounds|defenders|attackers)\] => Array/)[0];

        // Dividiamo per indici [0] => stdClass, [1] => stdClass...
        // Regex per catturare l'inizio di un giocatore: [n] => stdClass Object
        const playerBlocks = roleContent.split(/\[\d+\] => stdClass Object/);

        // Il primo elemento è vuoto o sporcizia prima del primo match, lo ignoriamo
        for (let i = 1; i < playerBlocks.length; i++) {
            const block = playerBlocks[i];
            
            // Estrai Nome
            const nameMatch = block.match(/\[fleet_owner\] => (.*)/);
            if (!nameMatch) continue; // Skip se non trovi il nome
            const playerName = nameMatch[1].trim();

            // Calcola Valore Flotta Iniziale (per metodo Pesato)
            let initialValue = 0;
            // Cerchiamo le navi: [ship_type] => 204 ... [count] => 100
            // Usiamo una regex globale sul blocco del giocatore
            const shipRegex = /\[ship_type\] => (\d+)\s*[^\[]*\[count\] => (\d+)/g;
            let match;
            while ((match = shipRegex.exec(block)) !== null) {
                const sId = parseInt(match[1]);
                const count = parseInt(match[2]);
                if (SHIPS[sId]) {
                    initialValue += (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                }
            }

            parsedPlayers.push({
                id: i - 1, // Indice interno (0, 1, 2...)
                name: playerName,
                initialValue: initialValue,
                lostValue: 0 // Lo calcoliamo dopo
            });
        }

        // 2. CALCOLO PERDITE (LOSSES)
        // Bisogna cercare nei Round. Nel RAW ci sono vari [rounds].
        // Cerchiamo [attacker_ship_losses] o [defender_ship_losses] dentro i round.
        const lossTag = role === 'attacker' ? '[attacker_ship_losses]' : '[defender_ship_losses]';
        
        // Split per round o scansione globale delle perdite
        const roundsSection = rawCR.split(/\[rounds\] => Array/)[1];
        if (roundsSection) {
            // Cerchiamo i blocchi di perdita. Esempio:
            // [owner] => 0 ... [ship_type] => 204 ... [count] => 5
            
            // Nota: I raw OGame a volte ripetono le perdite o mostrano il cumulativo.
            // Assumiamo che il RAW contenga la somma corretta se parsiamo tutti i blocchi di "losses" trovati.
            // Tuttavia, se ci sono 5 round, dobbiamo stare attenti a non sommare duplicati se il report è cumulativo.
            // Solitamente nei dump API, ogni round ha le perdite "avvenute in quel round". Quindi sommiamo tutto.
            
            // Per sicurezza, filtriamo solo i blocchi dentro al tag lossTag
            const lossBlocks = roundsSection.split(lossTag);
            
            // Dal secondo blocco in poi ci sono i dati delle perdite
            for(let k=1; k < lossBlocks.length; k++) {
                const lb = lossBlocks[k].split(/\[(attacker_ships|defender_ships|defender_ship_losses|attacker_ship_losses)\]/)[0];
                
                const lossRegex = /\[owner\] => (\d+)\s*\[ship_type\] => (\d+)\s*\[count\] => (\d+)/g;
                let lMatch;
                while ((lMatch = lossRegex.exec(lb)) !== null) {
                    const ownerIdx = parseInt(lMatch[1]);
                    const sId = parseInt(lMatch[2]);
                    const count = parseInt(lMatch[3]);

                    if (parsedPlayers[ownerIdx] && SHIPS[sId]) {
                        parsedPlayers[ownerIdx].lostValue += (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                    }
                }
            }
        }

        // 3. ESTRAZIONE RISORSE (RR o CR)
        let totMet = 0, totCrys = 0, totDeut = 0;

        if (rawRR && rawRR.length > 20) {
            // Priorità al Recycle Report se presente
            totMet = extractRes(rawRR, /\[metal_retrieved\] => (\d+)/) || extractRes(rawRR, /\[recycler_metal_retrieved\] => (\d+)/);
            totCrys = extractRes(rawRR, /\[crystal_retrieved\] => (\d+)/) || extractRes(rawRR, /\[recycler_crystal_retrieved\] => (\d+)/);
            totDeut = extractRes(rawRR, /\[deuterium_retrieved\] => (\d+)/) || extractRes(rawRR, /\[recycler_deuterium_retrieved\] => (\d+)/);
        } else {
            // Fallback sul Combat Report (Campi debris_metal_total...)
            totMet = extractRes(rawCR, /\[debris_metal_total\] => (\d+)/);
            totCrys = extractRes(rawCR, /\[debris_crystal_total\] => (\d+)/);
            totDeut = extractRes(rawCR, /\[debris_deuterium_total\] => (\d+)/);
        }

        // Aggiorna input
        document.getElementById('totalMetal').value = totMet;
        document.getElementById('totalCrystal').value = totCrys;
        document.getElementById('totalDeuterium').value = totDeut;

        if(parsedPlayers.length > 0) {
            statusDiv.innerHTML = `<span class="text-ok">✅ Trovati ${parsedPlayers.length} giocatori. Perdite calcolate.</span>`;
            calculateDistribution();
        } else {
            throw new Error("Nessun giocatore trovato. Il RAW è corretto?");
        }

    } catch (e) {
        console.error(e);
        statusDiv.innerHTML = `<span class="text-err">⚠️ ${e.message}</span>`;
    }
}

function extractRes(text, regex) {
    const m = text.match(regex);
    return m ? parseInt(m[1]) : 0;
}

function calculateDistribution() {
    const totMet = parseFloat(document.getElementById('totalMetal').value) || 0;
    const totCrys = parseFloat(document.getElementById('totalCrystal').value) || 0;
    const totDeut = parseFloat(document.getElementById('totalDeuterium').value) || 0;
    const method = document.querySelector('input[name="method"]:checked').value;
    
    const totalCDR = totMet + totCrys + totDeut;

    let groupLoss = 0;
    let groupInitial = 0;

    parsedPlayers.forEach(p => {
        groupLoss += p.lostValue;
        groupInitial += p.initialValue;
    });

    const netProfit = totalCDR - groupLoss;

    let html = `<table><thead><tr>
        <th>Giocatore</th>
        <th>Flotta Iniziale</th>
        <th>Perdite (Rimborso)</th>
        <th>Utile (${method === 'equal' ? 'Equo' : 'Pesato'})</th>
        <th>TOTALE</th>
    </tr></thead><tbody>`;

    let txt = `--- 🚀 SPARTIZIONE CDR (${method.toUpperCase()}) ---\n`;
    txt += `CDR Tot: ${fmt(totalCDR)} | Perdite: ${fmt(groupLoss)}\n`;
    txt += `Utile Netto: ${fmt(netProfit)}\n--------------------------\n`;

    parsedPlayers.forEach(p => {
        // 1. Rimborso
        let reimbursement = 0;
        if (totalCDR >= groupLoss) {
            reimbursement = p.lostValue;
        } else {
            // Se il CDR non copre nemmeno le perdite, rimborsa in %
            reimbursement = (p.lostValue / groupLoss) * totalCDR;
        }

        // 2. Utile
        let profitShare = 0;
        if (netProfit > 0) {
            if (method === 'equal') {
                profitShare = netProfit / parsedPlayers.length;
            } else {
                // Weighted
                const share = p.initialValue / groupInitial;
                profitShare = netProfit * share;
            }
        }

        const totalShare = reimbursement + profitShare;
        const personalGain = totalShare - p.lostValue;

        html += `<tr>
            <td>${p.name}</td>
            <td class="num" style="color:#8b949e">${fmt(p.initialValue)}</td>
            <td class="num neg">-${fmt(p.lostValue)}</td>
            <td class="num pos">+${fmt(profitShare)}</td>
            <td class="num"><strong>${fmt(totalShare)}</strong></td>
        </tr>`;

        txt += `> ${p.name}\n`;
        txt += `  Rimborso: ${fmt(reimbursement)}\n`;
        txt += `  Utile: ${fmt(profitShare)}\n`;
        txt += `  TOTALE: ${fmt(totalShare)}\n\n`;
    });

    html += `</tbody></table>`;
    
    if(parsedPlayers.length === 0) html = `<div style="text-align:center; padding:20px; color:#666;">Esegui l'analisi per vedere la tabella.</div>`;

    document.getElementById('table-container').innerHTML = html;
    document.getElementById('copyText').innerText = txt;
}

function fmt(n) {
    return new Intl.NumberFormat('it-IT').format(Math.floor(n));
}

function copyToClipboard() {
    const text = document.getElementById('copyText').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-copy');
        const orig = btn.innerText;
        btn.innerText = "Copiato!";
        setTimeout(() => btn.innerText = orig, 2000);
    });
}