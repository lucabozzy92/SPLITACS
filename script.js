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

let aggregatedPlayers = []; 

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-parse').addEventListener('click', parseRawData);
    document.getElementById('btn-recalc').addEventListener('click', calculateDistribution);
    document.getElementById('btn-copy').addEventListener('click', copyToClipboard);
});

function parseRawData() {
    const rawCR = document.getElementById('raw-cr').value;
    const rawRR = document.getElementById('raw-rr').value;
    const statusDiv = document.getElementById('parse-status');
    const role = document.querySelector('input[name="role"]:checked').value; 

    aggregatedPlayers = [];
    let uniquePlayersMap = {}; 
    let slotToPlayerIdMap = {}; 
    
    try {
        if (!rawCR || rawCR.length < 50) throw new Error("Incolla un Combat Report valido.");

        // ==========================================
        // 1. IDENTIFICAZIONE GIOCATORI E FLOTTA INIZIALE
        // ==========================================
        const roleSectionRegex = role === 'attacker' ? /\[attackers\] => Array/ : /\[defenders\] => Array/;
        const parts = rawCR.split(roleSectionRegex);
        
        if (parts.length < 2) throw new Error(`Sezione ${role} non trovata.`);
        
        // Contenuto fino alla prossima sezione principale
        const sectionContent = parts[1].split(/\[(rounds|defenders|attackers)\] =>/)[0];
        const shipSlots = sectionContent.split(/\[\d+\] => stdClass Object/);

        for (let i = 1; i < shipSlots.length; i++) {
            const slotBlock = shipSlots[i];
            const slotIndex = i - 1; 

            const idMatch = slotBlock.match(/\[fleet_owner_id\] => (\d+)/);
            if (!idMatch) continue; 
            
            const playerId = idMatch[1];
            const nameMatch = slotBlock.match(/\[fleet_owner\] => (.*)/);
            const playerName = nameMatch ? nameMatch[1].trim() : `Player ${playerId}`;

            slotToPlayerIdMap[slotIndex] = playerId;

            if (!uniquePlayersMap[playerId]) {
                uniquePlayersMap[playerId] = {
                    id: playerId,
                    name: playerName,
                    initialValue: 0,
                    lostValue: 0
                };
            }

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
        // 2. CALCOLO PERDITE (FIX PER I ROUND)
        // ==========================================
        
        // Dividiamo il RAW in blocchi "Round"
        // La struttura è [rounds] => Array ( [0] => stdClass... [1] => stdClass... )
        const roundsSection = rawCR.split(/\[rounds\] => Array/)[1];
        
        if (roundsSection) {
            // Dividiamo per ogni round: [N] => stdClass Object
            const roundBlocks = roundsSection.split(/\[\d+\] => stdClass Object/);
            const lossKeyword = role === 'attacker' ? 'attacker_ship_losses' : 'defender_ship_losses';

            // Iteriamo su tutti i round trovati (saltando il primo elemento vuoto)
            for (let r = 1; r < roundBlocks.length; r++) {
                const roundText = roundBlocks[r];
                
                // Cerchiamo il blocco delle perdite dentro QUESTO round
                // Esempio: [attacker_ship_losses] => Array ( ... )
                const lossesSplit = roundText.split(`[${lossKeyword}] => Array`);
                
                if (lossesSplit.length > 1) {
                    // Prendiamo il contenuto delle perdite fino alla fine dell'array o inizio prossima sezione
                    // Nel raw, l'array losses finisce quando inizia una nuova chiave o parentesi chiusa
                    // Un modo sicuro è prendere tutto fino alla prossima keyword principale del round (es. defender_ships se siamo attaccanti) o fine round
                    let lossesContent = lossesSplit[1];
                    
                    // Tronchiamo per sicurezza per non leggere roba successiva (es. defender_ships)
                    // Le sezioni tipiche in un round sono: statistics, attacker_ships, attacker_ship_losses, defender_ships, defender_ship_losses
                    // Se stiamo leggendo attacker losses, tronchiamo a "defender_ships"
                    if (role === 'attacker') {
                        lossesContent = lossesContent.split('[defender_ships]')[0];
                    } 
                    // Se siamo defender, losses è l'ultima parte, ma occhio alla parentesi di chiusura round
                    
                    // Regex per leggere le navi perse: [owner] => 0 ... [ship_type] => 206 ... [count] => 50
                    const lossRegex = /\[owner\] => (\d+)\s*\[ship_type\] => (\d+)\s*\[count\] => (\d+)/g;
                    let lMatch;
                    
                    while ((lMatch = lossRegex.exec(lossesContent)) !== null) {
                        const ownerSlotId = parseInt(lMatch[1]);
                        const sId = parseInt(lMatch[2]);
                        const count = parseInt(lMatch[3]);
                        
                        const realId = slotToPlayerIdMap[ownerSlotId];
                        
                        if (realId && uniquePlayersMap[realId] && SHIPS[sId]) {
                            const lossRes = (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                            uniquePlayersMap[realId].lostValue += lossRes;
                        }
                    }
                }
            }
        }

        // ==========================================
        // 3. ESTRAZIONE RISORSE (MULTI-RECYCLE)
        // ==========================================
        let totMet = 0, totCrys = 0, totDeut = 0;

        if (rawRR && rawRR.length > 20) {
            totMet = sumAllMatches(rawRR, /\[(?:recycler_)?metal_retrieved\] => (\d+)/g);
            totCrys = sumAllMatches(rawRR, /\[(?:recycler_)?crystal_retrieved\] => (\d+)/g);
            totDeut = sumAllMatches(rawRR, /\[(?:recycler_)?deuterium_retrieved\] => (\d+)/g);
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
            statusDiv.innerHTML = `<span class="text-ok">✅ Analisi Completata: ${aggregatedPlayers.length} Giocatori.</span>`;
            calculateDistribution();
        } else {
            throw new Error("Nessun giocatore trovato.");
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
        let reimbursement = 0;
        if (totalCDR >= groupLoss) {
            reimbursement = p.lostValue;
        } else {
            reimbursement = (p.lostValue / groupLoss) * totalCDR;
        }

        let profitShare = 0;
        if (netProfit > 0) {
            if (method === 'equal') {
                profitShare = netProfit / aggregatedPlayers.length;
            } else {
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