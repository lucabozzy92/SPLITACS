/* --- CONFIGURAZIONE COSTI NAVI (Standard OGame + Lifeforms) --- */
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
        
        // Taglia il testo per trovare solo la sezione Attaccanti o Difensori
        const roleSectionRegex = role === 'attacker' ? /\[attackers\] => Array/ : /\[defenders\] => Array/;
        const splitByRole = rawCR.split(roleSectionRegex);
        
        if (splitByRole.length < 2) throw new Error(`Sezione ${role} non trovata nel RAW.`);
        
        // Prendi il contenuto fino alla prossima sezione array (rounds, defenders, etc)
        const roleContent = splitByRole[1].split(/\[(rounds|defenders|attackers)\] => Array/)[0];

        // Dividiamo per blocchi ID: [0] => stdClass, [1] => stdClass...
        const playerBlocks = roleContent.split(/\[\d+\] => stdClass Object/);

        // Cicla attraverso i blocchi trovati (Slot flotta)
        for (let i = 1; i < playerBlocks.length; i++) {
            const block = playerBlocks[i];
            const slotId = i - 1; // L'indice dello slot (0, 1, 2...)
            
            // Trova l'ID DEL GIOCATORE (Quello univoco)
            const idMatch = block.match(/\[fleet_owner_id\] => (\d+)/);
            if (!idMatch) continue; 
            const playerId = idMatch[1].trim();

            // Trova il nome (solo per visualizzazione)
            const nameMatch = block.match(/\[fleet_owner\] => (.*)/);
            const playerName = nameMatch ? nameMatch[1].trim() : "Unknown";

            // Salviamo il collegamento: Slot X appartiene all'ID Y
            slotToPlayerIdMap[slotId] = playerId;

            // Se il giocatore (ID) non esiste ancora nella mappa, crealo
            if (!uniquePlayersMap[playerId]) {
                uniquePlayersMap[playerId] = {
                    id: playerId,
                    name: playerName, // Memorizza il nome del primo slot trovato
                    initialValue: 0,
                    lostValue: 0
                };
            }

            // Calcola il valore della flotta in QUESTO slot e aggiungilo al totale del giocatore
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
            uniquePlayersMap[playerId].initialValue += fleetVal;
        }

        // --- 2. CALCOLO PERDITE (AGGREGATE PER ID) ---
        
        const lossTag = role === 'attacker' ? '[attacker_ship_losses]' : '[defender_ship_losses]';
        const roundsSection = rawCR.split(/\[rounds\] => Array/)[1];
        
        if (roundsSection) {
            // Divide per trovare i blocchi perdite
            const lossBlocks = roundsSection.split(lossTag);
            
            // Dal secondo blocco in poi ci sono i dati
            for(let k=1; k < lossBlocks.length; k++) {
                // Prendi solo la parte relativa alle perdite di questo round
                const lb = lossBlocks[k].split(/\[(attacker_ships|defender_ships|defender_ship_losses|attacker_ship_losses)\]/)[0];
                
                const lossRegex = /\[owner\] => (\d+)\s*\[ship_type\] => (\d+)\s*\[count\] => (\d+)/g;
                let lMatch;
                while ((lMatch = lossRegex.exec(lb)) !== null) {
                    const ownerSlotId = parseInt(lMatch[1]); // Qui troviamo l'ID dello slot (es. 0, 1)
                    const sId = parseInt(lMatch[2]);
                    const count = parseInt(lMatch[3]);

                    // Recuperiamo l'ID GIOCATORE tramite la mappa slot->id
                    const realPlayerId = slotToPlayerIdMap[ownerSlotId];

                    // Aggiungiamo la perdita al giocatore corretto (aggregato)
                    if (realPlayerId && uniquePlayersMap[realPlayerId] && SHIPS[sId]) {
                        uniquePlayersMap[realPlayerId].lostValue += (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                    }
                }
            }
        }

        // --- 3. ESTRAZIONE RISORSE (RR o CR) ---
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

        // Aggiorna input UI
        document.getElementById('totalMetal').value = totMet;
        document.getElementById('totalCrystal').value = totCrys;
        document.getElementById('totalDeuterium').value = totDeut;

        // Trasforma la mappa in array per i calcoli finali
        aggregatedPlayers = Object.values(uniquePlayersMap);

        if(aggregatedPlayers.length > 0) {
            statusDiv.innerHTML = `<span class="text-ok">✅ Analisi OK: Trovati ${aggregatedPlayers.length} giocatori unici (Aggregati per ID).</span>`;
            calculateDistribution();
        } else {
            throw new Error("Nessun giocatore trovato. Controlla il RAW.");
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

    let txt = `--- 🚀 SPARTIZIONE CDR (${method.toUpperCase()}) ---\n`;
    txt += `CDR Tot: ${fmt(totalCDR)} | Perdite: ${fmt(groupLoss)}\n`;
    txt += `Utile Netto: ${fmt(netProfit)}\n--------------------------\n`;

    aggregatedPlayers.forEach(p => {
        // 1. Rimborso
        let reimbursement = 0;
        if (totalCDR >= groupLoss) {
            reimbursement = p.lostValue;
        } else {
            reimbursement = (p.lostValue / groupLoss) * totalCDR;
        }

        // 2. Utile
        let profitShare = 0;
        if (netProfit > 0) {
            if (method === 'equal') {
                profitShare = netProfit / aggregatedPlayers.length;
            } else {
                // Weighted: basato sulla flotta iniziale TOTALE del giocatore
                const share = p.initialValue / groupInitial;
                profitShare = netProfit * share;
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
    
    if(aggregatedPlayers.length === 0) html = `<div style="text-align:center; padding:20px; color:#666;">Esegui l'analisi per vedere la tabella.</div>`;

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