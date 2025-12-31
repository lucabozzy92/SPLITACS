/* --- CONFIGURAZIONE COSTI NAVI --- */
const SHIPS = {
    202: { m: 3000, c: 1000, d: 0, name: "Caccia Leggero" },
    203: { m: 6000, c: 4000, d: 0, name: "Caccia Pesante" },
    204: { m: 20000, c: 7000, d: 2000, name: "Incrociatore" },
    205: { m: 45000, c: 15000, d: 0, name: "Nave da Battaglia" },
    206: { m: 10000, c: 20000, d: 10000, name: "Colony Ship" },
    207: { m: 10000, c: 6000, d: 2000, name: "Riciclatrice" },
    208: { m: 0, c: 1000, d: 0, name: "Sonda Spia" },
    209: { m: 50000, c: 25000, d: 15000, name: "Bombardiere" },
    210: { m: 0, c: 2000, d: 500, name: "Satellite Solare" },
    211: { m: 60000, c: 50000, d: 15000, name: "Corazzata" },
    212: { m: 5000000, c: 4000000, d: 1000000, name: "Morte Nera" },
    213: { m: 85000, c: 55000, d: 15000, name: "Reaper" },
    214: { m: 8000, c: 15000, d: 8000, name: "Pathfinder" }, 
    215: { m: 30000, c: 40000, d: 15000, name: "Incrociatore da Battaglia" },
    218: { m: 2000, c: 2000, d: 1000, name: "Crawler" },
    219: { m: 8000, c: 15000, d: 8000, name: "Pathfinder" }
};

let aggregatedPlayers = []; // Lista finale dei giocatori unici

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
    const role = document.querySelector('input[name="role"]:checked').value; 

    aggregatedPlayers = [];
    let uniquePlayersMap = {}; // Mappa ID_PLAYER -> Oggetto Giocatore
    let slotToPlayerIdMap = {}; // Mappa ID Slot (0,1,2) -> ID_PLAYER
    
    try {
        if (!rawCR || rawCR.length < 50) throw new Error("Incolla un Combat Report valido.");

        // --- 1. IDENTIFICAZIONE GIOCATORI E FLOTTA INIZIALE ---
        
        const roleSectionRegex = role === 'attacker' ? /\[attackers\] => Array/ : /\[defenders\] => Array/;
        const splitByRole = rawCR.split(roleSectionRegex);
        
        if (splitByRole.length < 2) throw new Error(`Sezione ${role} non trovata nel RAW.`);
        
        // Contenuto della sezione attaccanti/difensori
        const roleContent = splitByRole[1].split(/\[(rounds|defenders|attackers)\] => Array/)[0];

        // Dividiamo per blocchi flotta
        const playerBlocks = roleContent.split(/\[\d+\] => stdClass Object/);

        // Cicla attraverso gli slot flotta
        for (let i = 1; i < playerBlocks.length; i++) {
            const block = playerBlocks[i];
            const slotId = i - 1; // Indice slot (0, 1, 2...)
            
            // Trova ID e Nome
            const idMatch = block.match(/\[fleet_owner_id\] => (\d+)/);
            if (!idMatch) continue; 
            const playerId = idMatch[1].trim();

            const nameMatch = block.match(/\[fleet_owner\] => (.*)/);
            const playerName = nameMatch ? nameMatch[1].trim() : "Sconosciuto";

            // Mappiamo lo slot all'ID reale
            slotToPlayerIdMap[slotId] = playerId;

            // Inizializza giocatore se nuovo
            if (!uniquePlayersMap[playerId]) {
                uniquePlayersMap[playerId] = {
                    id: playerId,
                    name: playerName,
                    initialValue: 0,
                    lostValue: 0
                };
            }

            // Calcola valore flotta in questo slot (Met + Cris + Deut)
            let fleetVal = 0;
            const shipRegex = /\[ship_type\] => (\d+)\s*[^\[]*\[count\] => (\d+)/g;
            let match;
            while ((match = shipRegex.exec(block)) !== null) {
                const sId = parseInt(match[1]);
                const count = parseInt(match[2]);
                if (SHIPS[sId]) {
                    fleetVal += (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                }
            }
            // Somma al totale del giocatore unificato
            uniquePlayersMap[playerId].initialValue += fleetVal;
        }

        // --- 2. CALCOLO PERDITE (Metodo Migliorato) ---
        
        // Identifica la sezione rounds
        const roundsSplit = rawCR.split(/\[rounds\] => Array/);
        if (roundsSplit.length > 1) {
            const roundsContent = roundsSplit[1];
            
            // Definiamo cosa cercare (Attaccanti o Difensori)
            const lossSectionTag = role === 'attacker' ? 'attacker_ship_losses' : 'defender_ship_losses';
            
            // Regex potente: Cerca dentro i blocchi losses
            // Pattern: [owner] => X ... [ship_type] => Y ... [count] => Z
            // Dobbiamo assicurarci di leggere SOLO le perdite del ruolo corretto.
            
            // Strategia: Iteriamo su tutti i blocchi [role_ship_losses] => Array
            const lossesBlocks = roundsContent.split(`[${lossSectionTag}] => Array`);
            
            // Partiamo da 1 perché il primo elemento è roba prima del match
            for (let k = 1; k < lossesBlocks.length; k++) {
                // Prendiamo il contenuto fino alla fine dell'array corrente o inizio del prossimo tag
                // Un modo semplice è prendere il testo e fermarsi se incontra parentesi di chiusura array troppo esterne o nuove keyword
                // Ma per semplicità, usiamo una regex che cattura le righe di navi subito dopo.
                
                const currentBlock = lossesBlocks[k];
                
                // Regex per estrarre le navi perse in questo blocco
                // Cerca ripetutamente: [owner] => ID ... [ship_type] => ID ... [count] => NUM
                const lineRegex = /\[owner\] => (\d+)\s*\[ship_type\] => (\d+)\s*\[count\] => (\d+)/g;
                
                let lineMatch;
                while ((lineMatch = lineRegex.exec(currentBlock)) !== null) {
                    // ATTENZIONE: Se il blocco contiene anche "defender_ships" o altro, la regex potrebbe matchare roba sbagliata
                    // Per sicurezza, verifichiamo che la posizione del match non sia "troppo lontana" o in un'altra sottosezione
                    // Nel formato RAW standard, le losses sono un array di oggetti.
                    
                    // Un controllo di sicurezza grezzo: se incontriamo una keyword che chiude la sezione losses
                    const textUntilMatch = currentBlock.substring(0, lineMatch.index);
                    if (textUntilMatch.includes('[attacker_ships]') || textUntilMatch.includes('[defender_ships]')) {
                        // Siamo finiti in un'altra sezione del round, ignoriamo questo match e i successivi di questo blocco
                        break;
                    }

                    const ownerSlotId = parseInt(lineMatch[1]);
                    const sId = parseInt(lineMatch[2]);
                    const count = parseInt(lineMatch[3]);

                    // Risolvi ID Reale
                    const realPlayerId = slotToPlayerIdMap[ownerSlotId];

                    if (realPlayerId && uniquePlayersMap[realPlayerId] && SHIPS[sId]) {
                        uniquePlayersMap[realPlayerId].lostValue += (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                    }
                }
            }
        }

        // --- 3. ESTRAZIONE RISORSE ---
        let totMet = 0, totCrys = 0, totDeut = 0;

        if (rawRR && rawRR.length > 20) {
            totMet = extractRes(rawRR, /\[metal_retrieved\] => (\d+)/) || extractRes(rawRR, /\[recycler_metal_retrieved\] => (\d+)/);
            totCrys = extractRes(rawRR, /\[crystal_retrieved\] => (\d+)/) || extractRes(rawRR, /\[recycler_crystal_retrieved\] => (\d+)/);
            totDeut = extractRes(rawRR, /\[deuterium_retrieved\] => (\d+)/) || extractRes(rawRR, /\[recycler_deuterium_retrieved\] => (\d+)/);
        } else {
            totMet = extractRes(rawCR, /\[debris_metal_total\] => (\d+)/);
            totCrys = extractRes(rawCR, /\[debris_crystal_total\] => (\d+)/);
            totDeut = extractRes(rawCR, /\[debris_deuterium_total\] => (\d+)/);
        }

        document.getElementById('totalMetal').value = totMet;
        document.getElementById('totalCrystal').value = totCrys;
        document.getElementById('totalDeuterium').value = totDeut;

        aggregatedPlayers = Object.values(uniquePlayersMap);

        if(aggregatedPlayers.length > 0) {
            statusDiv.innerHTML = `<span class="text-ok">✅ Analisi OK: ${aggregatedPlayers.length} Giocatori Unificati.</span>`;
            calculateDistribution();
        } else {
            throw new Error("Nessun giocatore trovato. RAW non valido?");
        }

    } catch (e) {
        console.error(e);
        statusDiv.innerHTML = `<span class="text-err">⚠️ Errore: ${e.message}</span>`;
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

    aggregatedPlayers.forEach(p => {
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

    let txt = `--- 🚀 SPARTIZIONE CDR (${method === 'equal' ? 'EQUA' : 'PESATA'}) ---\n`;
    txt += `CDR Tot: ${fmt(totalCDR)} | Perdite: ${fmt(groupLoss)}\n`;
    txt += `Utile Netto: ${fmt(netProfit)}\n--------------------------\n`;

    aggregatedPlayers.forEach(p => {
        // 1. Rimborso Perdite
        let reimbursement = 0;
        if (totalCDR >= groupLoss) {
            reimbursement = p.lostValue;
        } else {
            reimbursement = (p.lostValue / groupLoss) * totalCDR;
        }

        // 2. Calcolo Utile
        let profitShare = 0;
        if (netProfit > 0) {
            if (method === 'equal') {
                // Divisione Equa
                profitShare = netProfit / aggregatedPlayers.length;
            } else {
                // Divisione Pesata
                // La quota è proporzionale a quanta flotta (initialValue) il giocatore ha portato rispetto al totale (groupInitial)
                if (groupInitial > 0) {
                    const weight = p.initialValue / groupInitial;
                    profitShare = netProfit * weight;
                }
            }
        }

        const totalShare = reimbursement + profitShare;

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
    
    if(aggregatedPlayers.length === 0) html = `<div style="text-align:center; padding:20px; color:#666;">Incolla il RAW e clicca su Elabora Dati.</div>`;

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