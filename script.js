/* --- CONFIGURAZIONE COSTI NAVI (M, C, D) --- */
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
    let uniquePlayersMap = {}; // KEY: ID_PLAYER
    let slotToPlayerIdMap = {}; 
    
    try {
        if (!rawCR || rawCR.length < 50) throw new Error("Incolla un Combat Report valido.");

        // 1. IDENTIFICAZIONE GIOCATORI E FLOTTA INIZIALE
        const roleSectionRegex = role === 'attacker' ? /\[attackers\] => Array/ : /\[defenders\] => Array/;
        const parts = rawCR.split(roleSectionRegex);
        
        if (parts.length < 2) throw new Error(`Sezione ${role} non trovata nel CR.`);
        
        const sectionContent = parts[1].split(/\[(rounds|defenders|attackers)\] =>/)[0];
        const shipSlots = sectionContent.split(/\[\d+\] => stdClass Object/);

        for (let i = 1; i < shipSlots.length; i++) {
            const slotBlock = shipSlots[i];
            const slotIndex = i - 1; 

            const idMatch = slotBlock.match(/\[fleet_owner_id\] => (\d+)/);
            if (!idMatch) continue; 
            
            const playerId = idMatch[1].trim();
            const nameMatch = slotBlock.match(/\[fleet_owner\] => (.*)/);
            const playerName = nameMatch ? nameMatch[1].trim() : `Player ${playerId}`;

            slotToPlayerIdMap[slotIndex] = playerId;

            if (!uniquePlayersMap[playerId]) {
                uniquePlayersMap[playerId] = {
                    id: playerId,
                    name: playerName,
                    initialValue: 0,
                    lossM: 0, // Metallo perso
                    lossC: 0, // Cristallo perso
                    lossD: 0, // Deuterio perso
                    harvestedValue: 0 
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

        // 2. CALCOLO PERDITE (NAVIGANDO I ROUND E SOMMANDO M/C/D)
        const roundsSection = rawCR.split(/\[rounds\] => Array/)[1];
        if (roundsSection) {
            const roundBlocks = roundsSection.split(/\[\d+\] => stdClass Object/);
            const lossKeyword = role === 'attacker' ? 'attacker_ship_losses' : 'defender_ship_losses';

            for (let r = 1; r < roundBlocks.length; r++) {
                const roundText = roundBlocks[r];
                const lossesSplit = roundText.split(`[${lossKeyword}] => Array`);
                
                if (lossesSplit.length > 1) {
                    let lossesContent = lossesSplit[1];
                    lossesContent = lossesContent.split(/\[[a-z_]+\] =>/)[0]; 
                    
                    const lossRegex = /\[owner\] => (\d+)\s*\[ship_type\] => (\d+)\s*\[count\] => (\d+)/g;
                    let lMatch;
                    
                    while ((lMatch = lossRegex.exec(lossesContent)) !== null) {
                        const ownerSlotId = parseInt(lMatch[1]);
                        const sId = parseInt(lMatch[2]);
                        const count = parseInt(lMatch[3]);
                        
                        const realId = slotToPlayerIdMap[ownerSlotId];
                        
                        if (realId && uniquePlayersMap[realId] && SHIPS[sId]) {
                            // Somma granulare delle perdite
                            uniquePlayersMap[realId].lossM += (SHIPS[sId].m * count);
                            uniquePlayersMap[realId].lossC += (SHIPS[sId].c * count);
                            uniquePlayersMap[realId].lossD += (SHIPS[sId].d * count);
                        }
                    }
                }
            }
        }

        // 3. ESTRAZIONE RISORSE (MULTI-RECYCLE)
        let totMet = 0, totCrys = 0, totDeut = 0;

        if (rawRR && rawRR.length > 20) {
            const rrReports = rawRR.split(/\[generic\] => stdClass Object/);
            for (let k = 1; k < rrReports.length; k++) {
                const report = rrReports[k];
                const ownerIdMatch = report.match(/\[owner_id\] => (\d+)/);
                if (!ownerIdMatch) continue; 
                
                const recId = ownerIdMatch[1].trim();
                const m = extractRes(report, /\[(?:recycler_)?metal_retrieved\] => (\d+)/);
                const c = extractRes(report, /\[(?:recycler_)?crystal_retrieved\] => (\d+)/);
                const d = extractRes(report, /\[(?:recycler_)?deuterium_retrieved\] => (\d+)/);

                totMet += m; totCrys += c; totDeut += d;

                if (uniquePlayersMap[recId]) {
                    uniquePlayersMap[recId].harvestedValue += (m + c + d);
                } else {
                    const nameMatch = report.match(/\[owner_name\] => (.*)/);
                    const recName = nameMatch ? nameMatch[1].trim() : `Recycler ${recId}`;
                    uniquePlayersMap[recId] = {
                        id: recId,
                        name: recName + " (Solo Reciclata)",
                        initialValue: 0,
                        lossM: 0, lossC: 0, lossD: 0,
                        harvestedValue: (m + c + d)
                    };
                }
            }
        } else {
            // Fallback CR: Cerchiamo anche il deuterio
            totMet = extractRes(rawCR, /\[debris_metal_total\] => (\d+)/);
            totCrys = extractRes(rawCR, /\[debris_crystal_total\] => (\d+)/);
            totDeut = extractRes(rawCR, /\[debris_deuterium_total\] => (\d+)/);
        }

        document.getElementById('totalMetal').value = fmt(totMet);
        document.getElementById('totalCrystal').value = fmt(totCrys);
        document.getElementById('totalDeuterium').value = fmt(totDeut);
        
        document.getElementById('totalMetal').dataset.val = totMet;
        document.getElementById('totalCrystal').dataset.val = totCrys;
        document.getElementById('totalDeuterium').dataset.val = totDeut;

        aggregatedPlayers = Object.values(uniquePlayersMap);

        if(aggregatedPlayers.length > 0) {
            statusDiv.innerHTML = `<span class="text-ok">✅ Analisi v0.3 OK: ${aggregatedPlayers.length} Giocatori. Perdite calcolate.</span>`;
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

function calculateDistribution() {
    const totMet = parseFloat(document.getElementById('totalMetal').dataset.val) || 0;
    const totCrys = parseFloat(document.getElementById('totalCrystal').dataset.val) || 0;
    const totDeut = parseFloat(document.getElementById('totalDeuterium').dataset.val) || 0;
    const method = document.querySelector('input[name="method"]:checked').value;
    
    const totalCDR = totMet + totCrys + totDeut;

    // Calcolo Totale Perdite Gruppo
    let groupLoss = 0;
    let groupInitial = 0;

    aggregatedPlayers.forEach(p => {
        p.totalLoss = p.lossM + p.lossC + p.lossD;
        groupLoss += p.totalLoss;
        groupInitial += p.initialValue;
    });

    // Utile Netto = Ciò che abbiamo raccolto - Ciò che abbiamo perso in totale
    const netProfit = totalCDR - groupLoss;

    let html = `<table><thead><tr>
        <th>Giocatore</th>
        <th>Flotta Iniz.</th>
        <th>Perdite (Tot)</th>
        <th>Raccolto</th>
        <th>Spetta (Rimb+Utile)</th>
        <th>BILANCIO</th>
    </tr></thead><tbody>`;

    let txt = `--- 🚀 BILANCIO CDR v0.3 (${method === 'equal' ? 'EQUA' : 'PESATA'}) ---\n`;
    txt += `CDR Tot: ${fmt(totalCDR)} | Perdite Tot: ${fmt(groupLoss)}\n`;
    txt += `UTILE NETTO: ${fmt(netProfit)}\n--------------------------\n`;

    aggregatedPlayers.forEach(p => {
        // 1. Calcolo Rimborso (Copre le perdite se c'è abbastanza CDR)
        let reimbursement = 0;
        if (totalCDR >= groupLoss) {
            reimbursement = p.totalLoss;
        } else {
            // Se siamo in perdita totale (CDR < Perdite), rimborsiamo in percentuale
            reimbursement = (groupLoss > 0) ? (p.totalLoss / groupLoss) * totalCDR : 0;
        }

        // 2. Calcolo Utile (Solo se c'è profitto)
        let profitShare = 0;
        if (netProfit > 0) {
            if (method === 'equal') {
                const realParticipants = aggregatedPlayers.filter(pl => pl.initialValue > 0).length;
                if (p.initialValue > 0) {
                    profitShare = netProfit / realParticipants;
                }
            } else {
                if (groupInitial > 0) {
                    const weight = p.initialValue / groupInitial;
                    profitShare = netProfit * weight;
                }
            }
        }

        const totalShare = reimbursement + profitShare;
        const balance = totalShare - p.harvestedValue; // Positivo = Riceve, Negativo = Paga

        let balanceClass = balance > 0 ? "pos" : (balance < 0 ? "neg" : "neut");
        let balanceText = balance > 0 ? `RICEVE: ${fmt(balance)}` : (balance < 0 ? `PAGA: ${fmt(Math.abs(balance))}` : "PARI");

        html += `<tr>
            <td>${p.name}</td>
            <td class="num" style="color:#8b949e">${fmt(p.initialValue)}</td>
            <td class="num" style="color:#da3633">-${fmt(p.totalLoss)}</td>
            <td class="num" style="color:#e6edf3">${fmt(p.harvestedValue)}</td>
            <td class="num" style="font-weight:bold">${fmt(totalShare)}</td>
            <td class="num ${balanceClass}" style="font-weight:bold">${balanceText}</td>
        </tr>`;

        txt += `> ${p.name}\n`;
        txt += `  Perso: ${fmt(p.totalLoss)} | Raccolto: ${fmt(p.harvestedValue)}\n`;
        txt += `  Spetta: ${fmt(totalShare)} (Rimb: ${fmt(reimbursement)} + Utile: ${fmt(profitShare)})\n`;
        txt += `  -> ${balanceText}\n\n`;
    });

    html += `</tbody></table>`;
    
    if(aggregatedPlayers.length === 0) html = `<div style="text-align:center; padding:20px; color:#666;">Incolla i dati e premi Elabora.</div>`;

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