/* --- CONFIGURAZIONE COSTI NAVI (Standard OGame + Lifeforms) --- */
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

        // ==========================================
        // 1. IDENTIFICAZIONE GIOCATORI E FLOTTA INIZIALE
        // ==========================================
        
        // Trova la sezione principale (attackers o defenders)
        // Usiamo una regex che cattura il blocco fino all'inizio della sezione successiva importante (rounds o l'altro ruolo)
        const roleStartRegex = role === 'attacker' ? /\[attackers\] => Array/ : /\[defenders\] => Array/;
        const parts = rawCR.split(roleStartRegex);
        
        if (parts.length < 2) throw new Error(`Sezione ${role} non trovata.`);
        
        // Prendiamo il contenuto fino alla parola [rounds] o [defenders]/[attackers]
        // Questo isola la definizione dei giocatori e delle loro flotte iniziali
        const sectionContent = parts[1].split(/\[(rounds|defenders|attackers)\] =>/)[0];

        // Dividiamo per "stdClass Object" per trovare ogni slot di flotta
        // La struttura è [0] => stdClass Object ... [1] => stdClass Object
        const shipSlots = sectionContent.split(/\[\d+\] => stdClass Object/);

        // Il primo elemento [0] dello split è vuoto/spazzatura, partiamo da 1
        for (let i = 1; i < shipSlots.length; i++) {
            const slotBlock = shipSlots[i];
            const slotIndex = i - 1; // 0, 1, 2...

            // Estraiamo ID e Nome
            const idMatch = slotBlock.match(/\[fleet_owner_id\] => (\d+)/);
            if (!idMatch) continue; // Non è un blocco giocatore valido
            
            const playerId = idMatch[1];
            const nameMatch = slotBlock.match(/\[fleet_owner\] => (.*)/);
            const playerName = nameMatch ? nameMatch[1].trim() : `Player ${playerId}`;

            // Mappiamo Slot -> ID Reale
            slotToPlayerIdMap[slotIndex] = playerId;

            // Creiamo o recuperiamo il giocatore
            if (!uniquePlayersMap[playerId]) {
                uniquePlayersMap[playerId] = {
                    id: playerId,
                    name: playerName,
                    initialValue: 0,
                    lostValue: 0
                };
            }

            // Calcoliamo il valore della flotta INIZIALE in questo slot
            // Cerca tutte le navi: [ship_type] => 204 ... [count] => 1000
            // Usiamo una regex globale per trovare tutte le occorrenze in questo blocco
            const shipRegex = /\[ship_type\] => (\d+)\s*[^\[]*\[count\] => (\d+)/g;
            let shipMatch;
            
            while ((shipMatch = shipRegex.exec(slotBlock)) !== null) {
                const sId = parseInt(shipMatch[1]);
                const count = parseInt(shipMatch[2]);
                
                if (SHIPS[sId]) {
                    const value = (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                    uniquePlayersMap[playerId].initialValue += value;
                }
            }
        }

        // ==========================================
        // 2. CALCOLO PERDITE (TUTTI I ROUND)
        // ==========================================
        
        // Cerchiamo la sezione rounds
        const roundsSplit = rawCR.split(/\[rounds\] => Array/);
        
        if (roundsSplit.length > 1) {
            const roundsContent = roundsSplit[1];
            // Tag da cercare per le perdite (es: [attacker_ship_losses])
            const lossTag = role === 'attacker' ? 'attacker_ship_losses' : 'defender_ship_losses';
            
            // Regex globale che cerca: 
            // 1. Il blocco losses corretto
            // 2. Dentro di esso: [owner] => X ... [ship_type] => Y ... [count] => Z
            
            // Poiché i round sono sequenziali, possiamo scansionare tutto il testo dei round
            // cercando i blocchi di perdita specifici.
            
            // Strategia robusta: Dividiamo il testo dei round per "stdClass Object" (ogni round è un oggetto)
            // Poi dentro ogni round cerchiamo l'array delle perdite specifiche.
            
            // Approccio Regex Globale sulle righe di perdita:
            // Funziona SOLO se siamo sicuri di essere dentro il blocco [attacker_ship_losses] e non [attacker_ships]
            // Per farlo, splittiamo il testo usando il tag lossTag.
            
            const lossBlocks = roundsContent.split(`[${lossTag}] => Array`);
            
            // lossBlocks[0] è roba prima della prima perdita.
            // lossBlocks[1] inizia con le perdite del Round 1...
            // lossBlocks[2] inizia con le perdite del Round 2...
            
            for (let k = 1; k < lossBlocks.length; k++) {
                // Prendiamo il testo fino alla prossima keyword che chiude l'array (es. paren chiusa o altro array)
                // Nel RAW Ogame, dopo losses c'è solitamente la fine dell'oggetto round o un altro array.
                // Tagliamo il testo in modo sicuro: prendiamo fino alla prima occorrenza di "Array" o "stdClass" che non sia un elemento della lista
                // Un metodo semplice: prendiamo i primi 2000 caratteri o fino a `[` che non sia un indice.
                
                // Meglio: usiamo una regex che matcha finché trova la struttura delle navi
                let block = lossBlocks[k];
                
                // Cerchiamo le navi perse in questo blocco
                const lossRegex = /\[owner\] => (\d+)\s*\[ship_type\] => (\d+)\s*\[count\] => (\d+)/g;
                let lMatch;
                
                // ATTENZIONE: Dobbiamo fermarci se il blocco entra in un'altra sezione (es: defender_ships)
                // Tronchiamo il blocco alla prima occorrenza di una nuova chiave principale
                // Le chiavi principali nel raw sono tipo `[defender_ships] =>` o `[statistics] =>`
                const safeBlock = block.split(/\[[a-zA-Z_]+\] =>/)[0]; 
                
                while ((lMatch = lossRegex.exec(safeBlock)) !== null) {
                    const ownerSlotId = parseInt(lMatch[1]);
                    const sId = parseInt(lMatch[2]);
                    const count = parseInt(lMatch[3]);
                    
                    const realId = slotToPlayerIdMap[ownerSlotId];
                    
                    if (realId && uniquePlayersMap[realId] && SHIPS[sId]) {
                        const lostRes = (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                        uniquePlayersMap[realId].lostValue += lostRes;
                    }
                }
            }
        }

        // ==========================================
        // 3. ESTRAZIONE RISORSE (MULTI-RECYCLE)
        // ==========================================
        
        let totMet = 0, totCrys = 0, totDeut = 0;

        if (rawRR && rawRR.length > 20) {
            // Regex con flag 'g' per trovare tutte le occorrenze se ci sono più report incollati
            totMet = sumAllMatches(rawRR, /\[(?:recycler_)?metal_retrieved\] => (\d+)/g);
            totCrys = sumAllMatches(rawRR, /\[(?:recycler_)?crystal_retrieved\] => (\d+)/g);
            totDeut = sumAllMatches(rawRR, /\[(?:recycler_)?deuterium_retrieved\] => (\d+)/g);
        } else {
            // Fallback sul CR (ma il CR ha solo il totale teorico, non quello raccolto)
            // Se non c'è RR, usiamo i campi debris_..._total del CR
            totMet = extractRes(rawCR, /\[debris_metal_total\] => (\d+)/);
            totCrys = extractRes(rawCR, /\[debris_crystal_total\] => (\d+)/);
            totDeut = extractRes(rawCR, /\[debris_deuterium_total\] => (\d+)/);
        }

        document.getElementById('totalMetal').value = totMet;
        document.getElementById('totalCrystal').value = totCrys;
        document.getElementById('totalDeuterium').value = totDeut;

        aggregatedPlayers = Object.values(uniquePlayersMap);

        if(aggregatedPlayers.length > 0) {
            statusDiv.innerHTML = `<span class="text-ok">✅ Analisi OK: ${aggregatedPlayers.length} Giocatori. Perdite sommate su ${roundsSplit.length - 1} Round.</span>`;
            calculateDistribution();
        } else {
            throw new Error("Nessun giocatore trovato.");
        }

    } catch (e) {
        console.error(e);
        statusDiv.innerHTML = `<span class="text-err">⚠️ Errore: ${e.message}</span>`;
    }
}

// Helper per estrarre singolo valore
function extractRes(text, regex) {
    const m = text.match(regex);
    return m ? parseInt(m[1]) : 0;
}

// Helper per sommare tutte le occorrenze (per multi-RR)
function sumAllMatches(text, globalRegex) {
    let total = 0;
    let match;
    while ((match = globalRegex.exec(text)) !== null) {
        total += parseInt(match[1]);
    }
    return total;
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
                // Pesata: (Flotta Giocatore / Flotta Totale) * Utile
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