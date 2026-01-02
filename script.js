/* --- CONFIGURAZIONE COSTI NAVI (STANDARD OGAME) --- */
const SHIPS = {
    202: { m: 2000, c: 2000, d: 0, name: "Cargo Leggero" },
    203: { m: 6000, c: 6000, d: 0, name: "Cargo Pesante" },
    204: { m: 3000, c: 1000, d: 0, name: "Caccia Leggero" },
    205: { m: 6000, c: 4000, d: 0, name: "Caccia Pesante" },
    206: { m: 20000, c: 7000, d: 2000, name: "Incrociatore" },
    207: { m: 45000, c: 15000, d: 0, name: "Nave da Battaglia" },
    208: { m: 10000, c: 20000, d: 10000, name: "Colonizzatrice" },
    209: { m: 10000, c: 6000, d: 2000, name: "Riciclatrice" },
    210: { m: 0, c: 1000, d: 0, name: "Sonda Spia" },
    211: { m: 50000, c: 25000, d: 15000, name: "Bombardiere" },
    212: { m: 0, c: 2000, d: 500, name: "Satellite Solare" },
    213: { m: 60000, c: 50000, d: 15000, name: "Corazzata" },
    214: { m: 5000000, c: 4000000, d: 1000000, name: "Morte Nera" },
    215: { m: 30000, c: 40000, d: 15000, name: "Incrociatore da Battaglia" },
    218: { m: 85000, c: 55000, d: 15000, name: "Reaper" },
    219: { m: 8000, c: 15000, d: 8000, name: "Pathfinder" }
};

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

    playersList = []; 
    let playerIdToIndexMap = {}; 
    
    try {
        if (!rawCR || rawCR.length < 50) throw new Error("Incolla un Combat Report valido.");

        // 1. CR: PARSING GIOCATORI
        const roleStartTag = role === 'attacker' ? '[attackers] => Array' : '[defenders] => Array';
        const parts = rawCR.split(roleStartTag);
        
        if (parts.length < 2) throw new Error(`Sezione ${role} non trovata nel CR.`);
        
        const sectionContent = parts[1].split(/\[(rounds|defenders|attackers)\] => Array/)[0];
        const rawPlayerBlocks = sectionContent.split(/\[(\d+)\] => stdClass Object/);

        let maxIndex = -1;

        for (let i = 1; i < rawPlayerBlocks.length; i += 2) {
            const indexStr = rawPlayerBlocks[i]; 
            const content = rawPlayerBlocks[i+1];
            
            const nameMatch = content.match(/\[fleet_owner\] => (.*)/);
            const idMatch = content.match(/\[fleet_owner_id\] => (\d+)/);
            
            if (!nameMatch || !idMatch) continue;

            const pName = nameMatch[1].trim();
            const pId = idMatch[1].trim();
            const pIndex = parseInt(indexStr);
            if(pIndex > maxIndex) maxIndex = pIndex;

            playersList[pIndex] = {
                index: pIndex,
                id: pId,
                name: pName,
                initialValue: 0,
                lossM: 0, lossC: 0, lossD: 0,
                harvestedM: 0, harvestedC: 0, harvestedD: 0,
                harvestedValue: 0,
                dueM: 0, dueC: 0, dueD: 0
            };
            
            playerIdToIndexMap[pId] = pIndex;

            const compositionSplit = content.split('[fleet_composition] => Array');
            if (compositionSplit.length > 1) {
                const compositionPart = compositionSplit[1].split('[lifeformBonuses]')[0];
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

        // 2. CR: CALCOLO PERDITE
        const lossKeyword = role === 'attacker' ? '[attacker_ship_losses]' : '[defender_ship_losses]';
        const roundBlocks = rawCR.split('[round_number] =>');

        for(let r=1; r < roundBlocks.length; r++) {
            let roundText = roundBlocks[r];
            const lossSplit = roundText.split(`${lossKeyword} => Array`);
            if(lossSplit.length < 2) continue; 

            let lossContent = lossSplit[1];
            if (role === 'attacker') {
                lossContent = lossContent.split('[defender_ships]')[0];
            } else {
               lossContent = lossContent.split(/\[(attacker_ships|defender_ships|statistics)\]/)[0];
            }

            const lossRegex = /\[owner\]\s*=>\s*(\d+)[\s\S]*?\[ship_type\]\s*=>\s*(\d+)[\s\S]*?\[count\]\s*=>\s*(\d+)/g;
            let lMatch;

            while ((lMatch = lossRegex.exec(lossContent)) !== null) {
                const ownerIdx = parseInt(lMatch[1]);
                const sId = parseInt(lMatch[2]);
                const count = parseInt(lMatch[3]);

                if (playersList[ownerIdx] && SHIPS[sId]) {
                    playersList[ownerIdx].lossM += (SHIPS[sId].m * count);
                    playersList[ownerIdx].lossC += (SHIPS[sId].c * count);
                    playersList[ownerIdx].lossD += (SHIPS[sId].d * count);
                }
            }
        }

        // 3. RR: ESTRAZIONE RISORSE
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

                const pIndex = playerIdToIndexMap[recId];

                if (pIndex !== undefined && playersList[pIndex]) {
                    playersList[pIndex].harvestedM += m;
                    playersList[pIndex].harvestedC += c;
                    playersList[pIndex].harvestedD += d;
                    playersList[pIndex].harvestedValue += (m + c + d);
                } else {
                    const nameMatch = report.match(/\[owner_name\] => (.*)/);
                    const recName = nameMatch ? nameMatch[1].trim() : `Recycler ${recId}`;
                    const newIdx = playersList.length;
                    playersList.push({
                        index: newIdx,
                        id: recId,
                        name: recName + " (Esterno)",
                        initialValue: 0,
                        lossM: 0, lossC: 0, lossD: 0,
                        harvestedM: m, harvestedC: c, harvestedD: d,
                        harvestedValue: (m + c + d),
                        dueM: 0, dueC: 0, dueD: 0
                    });
                    playerIdToIndexMap[recId] = newIdx;
                }
            }
        } else {
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

        const validPlayers = playersList.filter(p => p !== undefined);

        if(validPlayers.length > 0) {
            statusDiv.innerHTML = `<span class="text-ok">✅ Analisi v1.6 OK.</span>`;
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

    const activeList = playersList.filter(p => p);

    activeList.forEach(p => {
        p.totalLoss = p.lossM + p.lossC + p.lossD;
        groupLoss += p.totalLoss;
        groupInitial += p.initialValue;
    });

    // Utile Netto per Risorsa
    const profitM = Math.max(0, totMet - groupLoss); // Semplificazione totale per ora
    // Per essere precisi al 100% su M/C/D bisogna calcolare profitM = totMet - sum(lossM)
    // Ma in OGame spesso il CDR copre le perdite totali ma non quelle specifiche se sbilanciate.
    // Usiamo l'approccio standard: Rimborso esatto + Utile residuo totale diviso M/C/D
    
    // Calcolo preciso per risorsa
    let totalLossM = 0, totalLossC = 0, totalLossD = 0;
    activeList.forEach(p => { totalLossM += p.lossM; totalLossC += p.lossC; totalLossD += p.lossD; });

    let netM = Math.max(0, totMet - totalLossM);
    let netC = Math.max(0, totCrys - totalLossC);
    let netD = Math.max(0, totDeut - totalLossD);

    const realParticipants = activeList.filter(pl => pl.initialValue > 0).length;

    activeList.forEach(p => {
        // 1. Rimborso (Se CDR < Perdita, riduci proporzionalmente)
        // Per semplicità, assumiamo che se c'è utile totale, si rimborsa tutto
        // Se si vuole precisione sulla risorsa carente, servirebbe logica più complessa.
        // Qui assumiamo che il CDR sia misto e convertibile o sufficiente.
        
        let rimbM = p.lossM;
        let rimbC = p.lossC;
        let rimbD = p.lossD;

        // Se CDR Totale < Perdite Totali, scaliamo i rimborsi
        if ((totMet+totCrys+totDeut) < (totalLossM+totalLossC+totalLossD)) {
            const ratio = (totMet+totCrys+totDeut) / (totalLossM+totalLossC+totalLossD);
            rimbM *= ratio; rimbC *= ratio; rimbD *= ratio;
            netM = 0; netC = 0; netD = 0;
        }

        // 2. Utile
        let shareM = 0, shareC = 0, shareD = 0;
        
        if (method === 'equal' && realParticipants > 0 && p.initialValue > 0) {
            shareM = netM / realParticipants;
            shareC = netC / realParticipants;
            shareD = netD / realParticipants;
        } else if (method === 'weighted' && groupInitial > 0 && p.initialValue > 0) {
            const weight = p.initialValue / groupInitial;
            shareM = netM * weight;
            shareC = netC * weight;
            shareD = netD * weight;
        }

        p.dueM = Math.floor(rimbM + shareM);
        p.dueC = Math.floor(rimbC + shareC);
        p.dueD = Math.floor(rimbD + shareD);
        p.totalDue = p.dueM + p.dueC + p.dueD;
    });

    generateDashboard(activeList, totMet+totCrys+totDeut, groupLoss, (netM+netC+netD), method);
}

function generateDashboard(players, totalCDR, totalLoss, totalProfit, method) {
    const summaryDiv = document.getElementById('global-summary');
    const cardsContainer = document.getElementById('cards-container');
    const transportContainer = document.getElementById('transport-container');
    
    // 1. Riepilogo Globale
    summaryDiv.innerHTML = `
        <div class="sum-item">
            <span class="sum-label">Totale CDR</span>
            <span class="sum-val" style="color:var(--accent-color)">${fmt(totalCDR)}</span>
        </div>
        <div class="sum-item">
            <span class="sum-label">Perdite Flotta</span>
            <span class="sum-val" style="color:var(--danger-color)">${fmt(totalLoss)}</span>
        </div>
        <div class="sum-item">
            <span class="sum-label">Utile Netto</span>
            <span class="sum-val" style="color:var(--success-color)">${fmt(totalProfit)}</span>
        </div>
    `;

    // 2. Generazione Cards
    let htmlCards = "";
    let txtReport = `--- 📊 SPARTIZIONE CDR (${method.toUpperCase()}) ---\nCDR Tot: ${fmt(totalCDR)} | Utile: ${fmt(totalProfit)}\n--------------------------------\n`;

    players.forEach(p => {
        const balance = p.totalDue - p.harvestedValue;
        let balanceClass = balance > 100 ? "status-receive" : (balance < -100 ? "status-pay" : "status-even");
        let balanceLabel = balance > 100 ? "RICEVE" : (balance < -100 ? "PAGA" : "PARI");
        
        htmlCards += `
        <div class="player-card">
            <div class="card-header">
                <span class="p-name">${p.name}</span>
                <span class="status-badge ${balanceClass}">${balanceLabel}</span>
            </div>
            <div class="card-body">
                <div class="data-row">
                    <span class="d-label">Flotta Iniz.</span>
                    <span class="d-val">${fmt(p.initialValue)}</span>
                </div>
                <div class="data-row">
                    <span class="d-label">Perdite</span>
                    <span class="d-val" style="color:var(--danger-color)">-${fmt(p.totalLoss)}</span>
                </div>
                <div class="data-row">
                    <span class="d-label">Raccolto</span>
                    <span class="d-val" style="color:var(--accent-color)">${fmt(p.harvestedValue)}</span>
                </div>
                
                <div class="res-breakdown">
                    <div style="text-align:center; margin-bottom:5px; color:#fff; font-weight:bold;">Spetta (Dettaglio):</div>
                    <div class="res-row"><span class="res-label c-met">M</span> <span>${fmt(p.dueM)}</span></div>
                    <div class="res-row"><span class="res-label c-crys">C</span> <span>${fmt(p.dueC)}</span></div>
                    <div class="res-row"><span class="res-label c-deut">D</span> <span>${fmt(p.dueD)}</span></div>
                </div>
            </div>
            <div class="card-footer">
                <span class="d-label">Bilancio Totale:</span><br>
                <span class="balance-val ${balance > 0 ? 'text-ok' : 'text-err'}">${balance > 0 ? '+' : ''}${fmt(balance)}</span>
            </div>
        </div>`;

        txtReport += `> ${p.name}\n`;
        txtReport += `  Spetta: M:${fmt(p.dueM)} C:${fmt(p.dueC)} D:${fmt(p.dueD)}\n`;
        txtReport += `  Raccolto: ${fmt(p.harvestedValue)}\n`;
        txtReport += `  BILANCIO: ${balance > 0 ? 'RICEVE ' + fmt(balance) : 'PAGA ' + fmt(Math.abs(balance))}\n\n`;
    });

    cardsContainer.innerHTML = htmlCards;

    // 3. Piano Trasporti
    const transportHTML = generateTransportPlanHTML(players);
    transportContainer.innerHTML = transportHTML;
    
    // Aggiungi piano trasporti al testo
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = transportHTML.replace(/<div class="trade-route"/g, "\n>").replace(/<\/div>/g, "").replace(/<[^>]+>/g, " ");
    txtReport += `--- ✈️ PIANO DI VOLO ---\n${tempDiv.innerText}`;

    document.getElementById('copyText').innerText = txtReport;
}

function generateTransportPlanHTML(players) {
    let html = "";
    
    const solve = (resName, propHarvested, propDue, cssClass) => {
        let senders = [];
        let receivers = [];
        players.forEach(p => {
            const diff = p[propHarvested] - p[propDue];
            if (diff > 100) senders.push({ name: p.name, amount: diff });
            else if (diff < -100) receivers.push({ name: p.name, amount: -diff });
        });

        if (senders.length === 0) return "";

        let block = `<div class="transport-block"><div class="trans-title"><i class="fas fa-cube"></i> ${resName}</div>`;
        
        senders.forEach(sender => {
            while (sender.amount > 1) {
                if (receivers.length === 0) break;
                let receiver = receivers[0];
                let amt = Math.min(sender.amount, receiver.amount);
                
                block += `
                <div class="trade-route ${cssClass}">
                    <span class="route-from">${sender.name}</span>
                    <span class="route-arrow">invia</span>
                    <span class="route-amount">${fmt(amt)}</span>
                    <span class="route-arrow">a</span>
                    <span class="route-to">${receiver.name}</span>
                </div>`;
                
                sender.amount -= amt;
                receiver.amount -= amt;
                if (receiver.amount < 1) receivers.shift();
            }
        });
        return block + "</div>";
    };

    html += solve("Metallo", "harvestedM", "dueM", "route-met");
    html += solve("Cristallo", "harvestedC", "dueC", "route-crys");
    html += solve("Deuterio", "harvestedD", "dueD", "route-deut");

    if(html === "") return `<div class="transport-block" style="text-align:center; color:#238636">✅ Nessun trasporto necessario!</div>`;
    return html;
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