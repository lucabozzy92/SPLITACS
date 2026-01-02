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
    let uniquePlayersMap = {}; 
    let slotToPlayerIdMap = {}; 
    
    try {
        if (!rawCR || rawCR.length < 50) throw new Error("Incolla un Combat Report valido.");

        // ==================================================
        // 1. CR: IDENTIFICAZIONE GIOCATORI E FLOTTA INIZIALE
        // ==================================================
        // Cerchiamo la sezione che ci interessa
        const roleStartTag = role === 'attacker' ? '[attackers] => Array' : '[defenders] => Array';
        const parts = rawCR.split(roleStartTag);
        
        if (parts.length < 2) throw new Error(`Sezione ${role} non trovata nel CR.`);
        
        // Prendiamo il contenuto fino alla prossima sezione array principale
        const sectionContent = parts[1].split(/\[(rounds|defenders|attackers)\] => Array/)[0];

        // LOGICA MIGLIORATA: Usiamo Regex per catturare ogni blocco giocatore
        // Formato: [0] => stdClass Object ( ... )
        // Usiamo un loop per estrarre uno per uno gli slot
        const playerBlockRegex = /\[(\d+)\] => stdClass Object\s*\(([\s\S]*?)\n\s{20}\)/g;
        
        let blockMatch;
        // Se la regex complessa fallisce, usiamo lo split che è più rozzo ma efficace se calibrato
        const playerBlocks = sectionContent.split(/\[\d+\] => stdClass Object/);

        // Ciclo su ogni blocco trovato (Slot)
        for (let i = 1; i < playerBlocks.length; i++) {
            const block = playerBlocks[i];
            const slotIndex = i - 1; // Lo slot è l'indice sequenziale

            // Estrazione ID
            const idMatch = block.match(/\[fleet_owner_id\] => (\d+)/);
            if (!idMatch) continue; // Salta blocchi vuoti
            
            const playerId = idMatch[1].trim();

            // Estrazione Nome
            const nameMatch = block.match(/\[fleet_owner\] => (.*)/);
            const playerName = nameMatch ? nameMatch[1].trim() : `Player ${playerId}`;

            // Mappatura Slot -> ID
            slotToPlayerIdMap[slotIndex] = playerId;

            // Inizializza giocatore
            if (!uniquePlayersMap[playerId]) {
                uniquePlayersMap[playerId] = {
                    id: playerId,
                    name: playerName,
                    initialValue: 0,
                    lossM: 0, lossC: 0, lossD: 0,
                    harvestedValue: 0 
                };
            }

            // Calcolo Flotta Iniziale (Regex "ingorda" per saltare armature/scudi)
            const shipRegex = /\[ship_type\]\s*=>\s*(\d+)[\s\S]*?\[count\]\s*=>\s*(\d+)/g;
            let shipMatch;
            while ((shipMatch = shipRegex.exec(block)) !== null) {
                const sId = parseInt(shipMatch[1]);
                const count = parseInt(shipMatch[2]);
                if (SHIPS[sId]) {
                    const value = (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                    uniquePlayersMap[playerId].initialValue += value;
                }
            }
        }

        // ==================================================
        // 2. CR: CALCOLO PERDITE (SCANNERIZZAZIONE GLOBALE)
        // ==================================================
        // Identifichiamo la stringa target per le perdite
        const lossKeyword = role === 'attacker' ? '[attacker_ship_losses]' : '[defender_ship_losses]';
        
        // Spezziamo TUTTO il raw usando questa keyword
        // Questo trova tutti i blocchi di perdite in tutti i round
        const globalLossBlocks = rawCR.split(lossKeyword);

        // Iteriamo su tutti i blocchi trovati (dal secondo in poi)
        for (let k = 1; k < globalLossBlocks.length; k++) {
            let blockContent = globalLossBlocks[k];
            
            // Dobbiamo fermare la lettura prima che inizi un'altra sezione importante
            // La sezione successiva è tipicamente defender_ships o statistics o fine array
            // Tagliamo alla prima occorrenza di '[' seguita da testo e ']'
            const safeContent = blockContent.split(/\[(attacker_ships|defender_ships|statistics|rounds)\]/)[0];

            // Ora analizziamo le navi perse in questo frammento pulito
            // Usiamo lo split per stdClass Object per isolare ogni riga di perdita
            const lossObjects = safeContent.split('stdClass Object');
            
            for(let j=1; j < lossObjects.length; j++) {
                const lObj = lossObjects[j];
                
                const ownerMatch = lObj.match(/\[owner\]\s*=>\s*(\d+)/);
                const typeMatch = lObj.match(/\[ship_type\]\s*=>\s*(\d+)/);
                const countMatch = lObj.match(/\[count\]\s*=>\s*(\d+)/);

                if (ownerMatch && typeMatch && countMatch) {
                    const ownerSlotId = parseInt(ownerMatch[1]);
                    const sId = parseInt(typeMatch[1]);
                    const count = parseInt(countMatch[1]);
                    
                    // Risolviamo l'ID reale dallo slot
                    const realId = slotToPlayerIdMap[ownerSlotId];
                    
                    if (realId && uniquePlayersMap[realId] && SHIPS[sId]) {
                        uniquePlayersMap[realId].lossM += (SHIPS[sId].m * count);
                        uniquePlayersMap[realId].lossC += (SHIPS[sId].c * count);
                        uniquePlayersMap[realId].lossD += (SHIPS[sId].d * count);
                    }
                }
            }
        }

        // ==================================================
        // 3. RR: ESTRAZIONE RISORSE E FIX NOMI
        // ==================================================
        let totMet = 0, totCrys = 0, totDeut = 0;

        if (rawRR && rawRR.length > 20) {
            const rrReports = rawRR.split(/\[generic\] => stdClass Object/);
            for (let k = 1; k < rrReports.length; k++) {
                const report = rrReports[k];
                const ownerIdMatch = report.match(/\[owner_id\] => (\d+)/);
                if (!ownerIdMatch) continue; 
                
                const recId = ownerIdMatch[1].trim();
                
                // Aggiornamento Nome se necessario
                const nameMatch = report.match(/\[owner_name\] => (.*)/);
                if (nameMatch && uniquePlayersMap[recId] && uniquePlayersMap[recId].name.startsWith("Player")) {
                    uniquePlayersMap[recId].name = nameMatch[1].trim();
                }

                const m = extractRes(report, /\[(?:recycler_)?metal_retrieved\] => (\d+)/);
                const c = extractRes(report, /\[(?:recycler_)?crystal_retrieved\] => (\d+)/);
                const d = extractRes(report, /\[(?:recycler_)?deuterium_retrieved\] => (\d+)/);

                totMet += m; totCrys += c; totDeut += d;

                if (uniquePlayersMap[recId]) {
                    uniquePlayersMap[recId].harvestedValue += (m + c + d);
                } else {
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
            // Fallback CR
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
            statusDiv.innerHTML = `<span class="text-ok">✅ Analisi v0.8 OK: ${aggregatedPlayers.length} Giocatori.</span>`;
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

    let groupLoss = 0;
    let groupInitial = 0;

    aggregatedPlayers.forEach(p => {
        p.totalLoss = p.lossM + p.lossC + p.lossD;
        groupLoss += p.totalLoss;
        groupInitial += p.initialValue;
    });

    const netProfit = totalCDR - groupLoss;

    let html = `<table><thead><tr>
        <th>Giocatore</th>
        <th>Flotta Iniz.</th>
        <th>Perdite (Tot)</th>
        <th>Raccolto</th>
        <th>Spetta (Rimb+Utile)</th>
        <th>BILANCIO</th>
    </tr></thead><tbody>`;

    let txt = `--- 🚀 BILANCIO CDR v0.8 (${method === 'equal' ? 'EQUA' : 'PESATA'}) ---\n`;
    txt += `CDR Tot: ${fmt(totalCDR)} | Perdite Tot: ${fmt(groupLoss)}\n`;
    txt += `UTILE NETTO: ${fmt(netProfit)}\n--------------------------\n`;

    aggregatedPlayers.forEach(p => {
        let reimbursement = 0;
        if (totalCDR >= groupLoss) {
            reimbursement = p.totalLoss;
        } else {
            reimbursement = (groupLoss > 0) ? (p.totalLoss / groupLoss) * totalCDR : 0;
        }

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
        const balance = totalShare - p.harvestedValue;

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