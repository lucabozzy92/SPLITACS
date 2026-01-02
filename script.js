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

// Array ordinato dei giocatori (Indice 0 = Player [0] nel RAW)
let playersList = []; 

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

    playersList = []; // Reset, ora è un array posizionale
    let playerIdToIndexMap = {}; // Serve per mappare RR (che ha solo ID) all'indice array
    
    try {
        if (!rawCR || rawCR.length < 50) throw new Error("Incolla un Combat Report valido.");

        // ==================================================
        // 1. CR: PARSING GIOCATORI (Mapping Indice 0, 1, 2...)
        // ==================================================
        
        // Isola la sezione (Attaccanti o Difensori)
        const roleStartTag = role === 'attacker' ? '[attackers] => Array' : '[defenders] => Array';
        const parts = rawCR.split(roleStartTag);
        
        if (parts.length < 2) throw new Error(`Sezione ${role} non trovata nel CR.`);
        
        // Questo blocco contiene tutti i giocatori di quel ruolo
        const sectionContent = parts[1].split(/\[(rounds|defenders|attackers)\] => Array/)[0];

        // Dividiamo per indici numerici: [0] => stdClass, [1] => stdClass
        const rawPlayerBlocks = sectionContent.split(/\[(\d+)\] => stdClass Object/);

        // Iteriamo saltando di 2 in 2 (Struttura split: [vuoto, indice, contenuto, indice, contenuto...])
        // Questo garantisce che stiamo leggendo i giocatori nell'ordine esatto del RAW
        let maxIndex = -1;

        for (let i = 1; i < rawPlayerBlocks.length; i += 2) {
            const indexStr = rawPlayerBlocks[i]; // "0", "1", etc.
            const content = rawPlayerBlocks[i+1];
            
            // Estrazione Dati Base
            const nameMatch = content.match(/\[fleet_owner\] => (.*)/);
            const idMatch = content.match(/\[fleet_owner_id\] => (\d+)/);
            
            if (!nameMatch || !idMatch) continue;

            const pName = nameMatch[1].trim();
            const pId = idMatch[1].trim();
            const pIndex = parseInt(indexStr);
            if(pIndex > maxIndex) maxIndex = pIndex;

            // Inizializza Oggetto Giocatore
            playersList[pIndex] = {
                index: pIndex, // Fondamentale per i round
                id: pId,
                name: pName,
                initialValue: 0,
                lossM: 0, lossC: 0, lossD: 0,
                harvestedValue: 0 
            };
            
            // Mappiamo ID -> Indice per dopo (RR)
            playerIdToIndexMap[pId] = pIndex;

            // Calcolo Flotta Iniziale (Cerca nel blocco fleet_composition)
            const compositionSplit = content.split('[fleet_composition] => Array');
            if (compositionSplit.length > 1) {
                const compositionPart = compositionSplit[1].split('[lifeformBonuses]')[0];
                
                // Regex "Ingorda" per le navi
                const shipRegex = /\[ship_type\]\s*=>\s*(\d+)[\s\S]*?\[count\]\s*=>\s*(\d+)/g;
                let shipMatch;
                while ((shipMatch = shipRegex.exec(compositionPart)) !== null) {
                    const sId = parseInt(shipMatch[1]);
                    const count = parseInt(shipMatch[2]);
                    if (SHIPS[sId]) {
                        const val = (SHIPS[sId].m + SHIPS[sId].c + SHIPS[sId].d) * count;
                        playersList[pIndex].initialValue += val;
                    }
                }
            }
        }

        // ==================================================
        // 2. CR: CALCOLO PERDITE (SCANNERIZZAZIONE ROUND)
        // ==================================================
        const lossKeyword = role === 'attacker' ? '[attacker_ship_losses]' : '[defender_ship_losses]';
        // Dividiamo il RAW in Round
        const roundBlocks = rawCR.split('[round_number] =>');

        // Iteriamo i round (parte da 1)
        for(let r=1; r < roundBlocks.length; r++) {
            let roundText = roundBlocks[r];
            
            // Cerchiamo il blocco perdite specifico
            const lossSplit = roundText.split(`${lossKeyword} => Array`);
            if(lossSplit.length < 2) continue; // Nessuna perdita in questo round per questo ruolo

            // Prendiamo il contenuto fino alla prossima sezione array o chiusura parentesi round
            let lossContent = lossSplit[1];
            
            // Pulizia: troncare se si incontra [defender_ships] se siamo attaccanti
            if (role === 'attacker') {
                lossContent = lossContent.split('[defender_ships]')[0];
            } else {
               // Per difensore, troncare se si incontra la fine del round
               // Un metodo generico è splittare alla prima occorrenza di '[' che inizi una nuova chiave principale
               lossContent = lossContent.split(/\[(attacker_ships|defender_ships|statistics)\]/)[0];
            }

            // Regex per estrarre: [owner] => X ... [ship_type] => Y ... [count] => Z
            const lossRegex = /\[owner\]\s*=>\s*(\d+)[\s\S]*?\[ship_type\]\s*=>\s*(\d+)[\s\S]*?\[count\]\s*=>\s*(\d+)/g;
            let lMatch;

            while ((lMatch = lossRegex.exec(lossContent)) !== null) {
                const ownerIdx = parseInt(lMatch[1]); // Questo indice (0, 1... 8) corrisponde direttamente a playersList[i]
                const sId = parseInt(lMatch[2]);
                const count = parseInt(lMatch[3]);

                // Assegnazione diretta tramite indice
                if (playersList[ownerIdx] && SHIPS[sId]) {
                    playersList[ownerIdx].lossM += (SHIPS[sId].m * count);
                    playersList[ownerIdx].lossC += (SHIPS[sId].c * count);
                    playersList[ownerIdx].lossD += (SHIPS[sId].d * count);
                }
            }
        }

        // ==================================================
        // 3. RR: ESTRAZIONE RISORSE (MAPPATURA TRAMITE ID)
        // ==================================================
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

                // Troviamo l'indice del giocatore tramite ID
                const pIndex = playerIdToIndexMap[recId];

                if (pIndex !== undefined && playersList[pIndex]) {
                    playersList[pIndex].harvestedValue += (m + c + d);
                } else {
                    // Giocatore esterno (non ha combattuto ma ha riciclato)
                    const nameMatch = report.match(/\[owner_name\] => (.*)/);
                    const recName = nameMatch ? nameMatch[1].trim() : `Recycler ${recId}`;
                    
                    const newIdx = playersList.length;
                    playersList.push({
                        index: newIdx,
                        id: recId,
                        name: recName + " (Esterno)",
                        initialValue: 0,
                        lossM: 0, lossC: 0, lossD: 0,
                        harvestedValue: (m + c + d)
                    });
                    playerIdToIndexMap[recId] = newIdx;
                }
            }
        } else {
            // Fallback CR Totals
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

        // Clean array from empty slots (sparse array check)
        const validPlayers = playersList.filter(p => p !== undefined);

        if(validPlayers.length > 0) {
            statusDiv.innerHTML = `<span class="text-ok">✅ Trovati ${validPlayers.length} Giocatori (Slot 0-${maxIndex}).</span>`;
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

    // Filter out undefined slots
    const activeList = playersList.filter(p => p);

    activeList.forEach(p => {
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

    let txt = `--- 🚀 BILANCIO CDR v1.0 (${method === 'equal' ? 'EQUA' : 'PESATA'}) ---\n`;
    txt += `CDR Tot: ${fmt(totalCDR)} | Perdite Tot: ${fmt(groupLoss)}\n`;
    txt += `UTILE NETTO: ${fmt(netProfit)}\n--------------------------\n`;

    activeList.forEach(p => {
        let reimbursement = 0;
        if (totalCDR >= groupLoss) {
            reimbursement = p.totalLoss;
        } else {
            reimbursement = (groupLoss > 0) ? (p.totalLoss / groupLoss) * totalCDR : 0;
        }

        let profitShare = 0;
        if (netProfit > 0) {
            if (method === 'equal') {
                const realParticipants = activeList.filter(pl => pl.initialValue > 0).length;
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
    
    if(activeList.length === 0) html = `<div style="text-align:center; padding:20px; color:#666;">Incolla i dati e premi Elabora.</div>`;

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