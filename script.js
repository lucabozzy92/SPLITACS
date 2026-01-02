/* --- TRANSLATIONS --- */
const LANG_DATA = {
    it: {
        sec_input: "Inserimento Dati RAW",
        btn_parse: "ELABORA DATI",
        lbl_role: "Ruolo:",
        opt_attacker: "Attaccanti",
        opt_defender: "Difensori",
        lbl_method: "Metodo:",
        opt_equal: "Equa",
        opt_weighted: "Pesata",
        sec_dashboard: "Dashboard",
        lbl_report: "Report Testuale",
        btn_copy: "COPIA REPORT",
        sum_cdr: "Totale CDR",
        sum_loss: "Perdite Flotta",
        sum_profit: "Utile Netto",
        card_fleet: "Flotta Iniz.",
        card_weight: "% Peso Flotta",
        card_loss: "Perdite Tot.",
        card_harvest: "Raccolto",
        card_due: "Spetta (Dettaglio)",
        card_bal: "Bilancio Totale",
        status_rec: "RICEVE",
        status_pay: "PAGA",
        status_even: "PARI",
        trans_send: "invia",
        trans_to: "a",
        trans_none: "✅ Nessun trasporto necessario!",
        rep_title: "SPARTIZIONE CDR",
        rep_flight: "PIANO DI VOLO",
        rep_spetta: "Spetta"
    },
    en: {
        sec_input: "RAW Data Input",
        btn_parse: "PROCESS DATA",
        lbl_role: "Role:",
        opt_attacker: "Attackers",
        opt_defender: "Defenders",
        lbl_method: "Method:",
        opt_equal: "Equal",
        opt_weighted: "Weighted",
        sec_dashboard: "Dashboard",
        lbl_report: "Text Report",
        btn_copy: "COPY REPORT",
        sum_cdr: "Total DF",
        sum_loss: "Fleet Losses",
        sum_profit: "Net Profit",
        card_fleet: "Init. Fleet",
        card_weight: "Fleet Weight %",
        card_loss: "Tot. Losses",
        card_harvest: "Harvested",
        card_due: "Due (Detail)",
        card_bal: "Total Balance",
        status_rec: "RECEIVES",
        status_pay: "PAYS",
        status_even: "EVEN",
        trans_send: "sends",
        trans_to: "to",
        trans_none: "✅ No transport needed!",
        rep_title: "ACS SPLIT",
        rep_flight: "FLIGHT PLAN",
        rep_spetta: "Due"
    },
    de: {
        sec_input: "RAW Daten Eingabe",
        btn_parse: "DATEN VERARBEITEN",
        lbl_role: "Rolle:",
        opt_attacker: "Angreifer",
        opt_defender: "Verteidiger",
        lbl_method: "Methode:",
        opt_equal: "Gleich",
        opt_weighted: "Gewichtet",
        sec_dashboard: "Dashboard",
        lbl_report: "Textbericht",
        btn_copy: "BERICHT KOPIEREN",
        sum_cdr: "Gesamt TF",
        sum_loss: "Flottenverluste",
        sum_profit: "Reingewinn",
        card_fleet: "Init. Flotte",
        card_weight: "Flottengewicht %",
        card_loss: "Verluste",
        card_harvest: "Abgebaut",
        card_due: "Anteil (Detail)",
        card_bal: "Gesamtbilanz",
        status_rec: "BEKOMMT",
        status_pay: "ZAHLT",
        status_even: "AUSGEGLICHEN",
        trans_send: "sendet",
        trans_to: "an",
        trans_none: "✅ Kein Transport nötig!",
        rep_title: "AKS AUFTEILUNG",
        rep_flight: "FLUGPLAN",
        rep_spetta: "Anteil"
    },
    es: {
        sec_input: "Entrada Datos RAW",
        btn_parse: "PROCESAR DATOS",
        lbl_role: "Rol:",
        opt_attacker: "Atacantes",
        opt_defender: "Defensores",
        lbl_method: "Método:",
        opt_equal: "Igualitaria",
        opt_weighted: "Ponderada",
        sec_dashboard: "Panel",
        lbl_report: "Reporte Texto",
        btn_copy: "COPIAR REPORTE",
        sum_cdr: "Total Escombros",
        sum_loss: "Pérdidas Flota",
        sum_profit: "Beneficio Neto",
        card_fleet: "Flota Inic.",
        card_weight: "Peso Flota %",
        card_loss: "Pérdidas Tot.",
        card_harvest: "Recolectado",
        card_due: "Corresponde",
        card_bal: "Balance Total",
        status_rec: "RECIBE",
        status_pay: "PAGA",
        status_even: "PAREJO",
        trans_send: "envía",
        trans_to: "a",
        trans_none: "✅ ¡No se necesita transporte!",
        rep_title: "REPARTO SAC",
        rep_flight: "PLAN DE VUELO",
        rep_spetta: "Corresp."
    },
    fr: {
        sec_input: "Saisie Données RAW",
        btn_parse: "TRAITER DONNÉES",
        lbl_role: "Rôle:",
        opt_attacker: "Attaquants",
        opt_defender: "Défenseurs",
        lbl_method: "Méthode:",
        opt_equal: "Équitable",
        opt_weighted: "Pondérée",
        sec_dashboard: "Tableau de Bord",
        lbl_report: "Rapport Texte",
        btn_copy: "COPIER RAPPORT",
        sum_cdr: "Total CDR",
        sum_loss: "Pertes Flotte",
        sum_profit: "Bénéfice Net",
        card_fleet: "Flotte Init.",
        card_weight: "Poids Flotte %",
        card_loss: "Pertes Tot.",
        card_harvest: "Récolté",
        card_due: "Dû (Détail)",
        card_bal: "Bilan Total",
        status_rec: "REÇOIT",
        status_pay: "PAIE",
        status_even: "ÉGAL",
        trans_send: "envoie",
        trans_to: "à",
        trans_none: "✅ Aucun transport nécessaire !",
        rep_title: "RÉPARTITION AG",
        rep_flight: "PLAN DE VOL",
        rep_spetta: "Dû"
    }
};

let currentLang = 'it';

/* SHIP COSTS */
const SHIPS_COST = {
    202: { m: 2000, c: 2000, d: 0 }, 203: { m: 6000, c: 6000, d: 0 },
    204: { m: 3000, c: 1000, d: 0 }, 205: { m: 6000, c: 4000, d: 0 },
    206: { m: 20000, c: 7000, d: 2000 }, 207: { m: 45000, c: 15000, d: 0 },
    208: { m: 10000, c: 20000, d: 10000 }, 209: { m: 10000, c: 6000, d: 2000 },
    210: { m: 0, c: 1000, d: 0 }, 211: { m: 50000, c: 25000, d: 15000 },
    212: { m: 0, c: 2000, d: 500 }, 213: { m: 60000, c: 50000, d: 15000 },
    214: { m: 5000000, c: 4000000, d: 1000000 }, 215: { m: 30000, c: 40000, d: 15000 },
    218: { m: 85000, c: 55000, d: 15000 }, 219: { m: 8000, c: 15000, d: 8000 }
};

let playersList = []; 

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-parse').addEventListener('click', parseRawData);
    document.getElementById('btn-recalc').addEventListener('click', calculateDistribution);
    document.getElementById('btn-copy').addEventListener('click', copyToClipboard);
    setLanguage('it'); 
});

function setLanguage(lang) {
    currentLang = lang;
    const t = LANG_DATA[lang];
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[key]) el.innerText = t[key];
    });
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.lang-btn[onclick="setLanguage('${lang}')"]`).classList.add('active');
    if (playersList.length > 0) calculateDistribution();
}

function parseRawData() {
    const rawCR = document.getElementById('raw-cr').value;
    const rawRR = document.getElementById('raw-rr').value;
    const statusDiv = document.getElementById('parse-status');
    const role = document.querySelector('input[name="role"]:checked').value; 

    playersList = []; 
    let playerIdToIndexMap = {}; 
    
    try {
        if (!rawCR || rawCR.length < 50) throw new Error("Incolla un Combat Report valido.");

        // 1. CR: PARSING PLAYERS
        const roleStartTag = role === 'attacker' ? '[attackers] => Array' : '[defenders] => Array';
        const parts = rawCR.split(roleStartTag);
        if (parts.length < 2) throw new Error(`Sezione ${role} non trovata nel CR.`);
        
        const sectionContent = parts[1].split(/\[(rounds|defenders|attackers)\] => Array/)[0];
        const idRegex = /\[fleet_owner_id\] => (\d+)/g;
        let idMatches = [];
        let match;
        while ((match = idRegex.exec(sectionContent)) !== null) idMatches.push({ id: match[1], index: match.index });

        for (let i = 0; i < idMatches.length; i++) {
            const currentMatch = idMatches[i];
            const nextMatch = idMatches[i+1];
            const pId = currentMatch.id;
            const startIdx = currentMatch.index;
            const endIdx = nextMatch ? nextMatch.index : sectionContent.length;
            const playerChunk = sectionContent.substring(startIdx, endIdx);
            const headerChunk = sectionContent.substring(Math.max(0, startIdx - 500), startIdx);
            const nameMatch = headerChunk.match(/\[fleet_owner\] => (.*)/);
            const pName = nameMatch ? nameMatch[1].trim() : `Player ${pId}`;

            playersList[i] = {
                index: i, id: pId, name: pName,
                initialValue: 0, lossM: 0, lossC: 0, lossD: 0,
                harvestedM: 0, harvestedC: 0, harvestedD: 0, harvestedValue: 0,
                dueM: 0, dueC: 0, dueD: 0, weightPercentage: 0
            };
            playerIdToIndexMap[pId] = i;

            const globalShipRegex = /\[ship_type\]\s*=>\s*(\d+)[\s\S]*?\[count\]\s*=>\s*(\d+)/g;
            let sMatch;
            while ((sMatch = globalShipRegex.exec(playerChunk)) !== null) {
                const sId = parseInt(sMatch[1]);
                const count = parseInt(sMatch[2]);
                if (SHIPS_COST[sId]) {
                    const val = (SHIPS_COST[sId].m + SHIPS_COST[sId].c + SHIPS_COST[sId].d) * count;
                    playersList[i].initialValue += val;
                }
            }
        }

        // 2. CR: LOSSES
        const lossKeyword = role === 'attacker' ? '[attacker_ship_losses]' : '[defender_ship_losses]';
        const roundBlocks = rawCR.split('[round_number] =>');

        for(let r=1; r < roundBlocks.length; r++) {
            let roundText = roundBlocks[r];
            const lossSplit = roundText.split(`${lossKeyword} => Array`);
            if(lossSplit.length < 2) continue; 

            let lossContent = lossSplit[1];
            if (role === 'attacker') lossContent = lossContent.split('[defender_ships]')[0];
            else lossContent = lossContent.split(/\[(attacker_ships|defender_ships|statistics)\]/)[0];

            const lossRegex = /\[owner\]\s*=>\s*(\d+)[\s\S]*?\[ship_type\]\s*=>\s*(\d+)[\s\S]*?\[count\]\s*=>\s*(\d+)/g;
            let lMatch;
            while ((lMatch = lossRegex.exec(lossContent)) !== null) {
                const ownerIdx = parseInt(lMatch[1]);
                const sId = parseInt(lMatch[2]);
                const count = parseInt(lMatch[3]);
                if (playersList[ownerIdx] && SHIPS_COST[sId]) {
                    playersList[ownerIdx].lossM += (SHIPS_COST[sId].m * count);
                    playersList[ownerIdx].lossC += (SHIPS_COST[sId].c * count);
                    playersList[ownerIdx].lossD += (SHIPS_COST[sId].d * count);
                }
            }
        }

        // 3. RR: HARVEST
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
                        index: newIdx, id: recId, name: recName + " (Ext)",
                        initialValue: 0, lossM: 0, lossC: 0, lossD: 0,
                        harvestedM: m, harvestedC: c, harvestedD: d, harvestedValue: (m + c + d),
                        dueM: 0, dueC: 0, dueD: 0, weightPercentage: 0
                    });
                    playerIdToIndexMap[recId] = newIdx;
                }
            }
        } else {
            totMet = extractRes(rawCR, /\[debris_metal_total\] => (\d+)/);
            totCrys = extractRes(rawCR, /\[debris_crystal_total\] => (\d+)/);
            totDeut = extractRes(rawCR, /\[debris_deuterium_total\] => (\d+)/);
        }

        document.getElementById('totalMetal').dataset.val = totMet;
        document.getElementById('totalCrystal').dataset.val = totCrys;
        document.getElementById('totalDeuterium').dataset.val = totDeut;

        const validPlayers = playersList.filter(p => p !== undefined);
        if(validPlayers.length > 0) {
            statusDiv.innerHTML = `<span class="text-ok">✅ OK (${validPlayers.length} Players)</span>`;
            calculateDistribution();
        } else {
            throw new Error("No players found.");
        }
    } catch (e) {
        console.error(e);
        statusDiv.innerHTML = `<span class="text-err">⚠️ Error: ${e.message}</span>`;
    }
}

function extractRes(text, regex) {
    const m = text.match(regex);
    return m ? parseInt(m[1]) : 0;
}

function calculateDistribution() {
    const tData = LANG_DATA[currentLang];
    const totMet = parseFloat(document.getElementById('totalMetal').dataset.val) || 0;
    const totCrys = parseFloat(document.getElementById('totalCrystal').dataset.val) || 0;
    const totDeut = parseFloat(document.getElementById('totalDeuterium').dataset.val) || 0;
    const method = document.querySelector('input[name="method"]:checked').value;
    
    let groupLoss = 0;
    let groupInitial = 0;
    let totalLossM = 0, totalLossC = 0, totalLossD = 0;

    const activeList = playersList.filter(p => p);

    activeList.forEach(p => {
        p.totalLoss = p.lossM + p.lossC + p.lossD;
        groupLoss += p.totalLoss;
        groupInitial += p.initialValue;
        totalLossM += p.lossM;
        totalLossC += p.lossC;
        totalLossD += p.lossD;
    });

    activeList.forEach(p => {
        p.weightPercentage = groupInitial > 0 ? (p.initialValue / groupInitial) * 100 : 0;
    });

    let netM = Math.max(0, totMet - totalLossM);
    let netC = Math.max(0, totCrys - totalLossC);
    let netD = Math.max(0, totDeut - totalLossD);

    const realParticipants = activeList.filter(pl => pl.initialValue > 0).length;

    activeList.forEach(p => {
        // Reimbursement
        let rimbM = p.lossM;
        let rimbC = p.lossC;
        let rimbD = p.lossD;

        if ((totMet+totCrys+totDeut) < (totalLossM+totalLossC+totalLossD)) {
            const ratio = (totMet+totCrys+totDeut) / (totalLossM+totalLossC+totalLossD);
            rimbM *= ratio; rimbC *= ratio; rimbD *= ratio;
            netM = 0; netC = 0; netD = 0;
        }

        // Profit Share
        let shareM = 0, shareC = 0, shareD = 0;
        if (method === 'equal' && realParticipants > 0 && p.initialValue > 0) {
            shareM = netM / realParticipants; shareC = netC / realParticipants; shareD = netD / realParticipants;
        } else if (method === 'weighted' && groupInitial > 0 && p.initialValue > 0) {
            const weight = p.initialValue / groupInitial;
            shareM = netM * weight; shareC = netC * weight; shareD = netD * weight;
        }

        p.dueM = Math.floor(rimbM + shareM);
        p.dueC = Math.floor(rimbC + shareC);
        p.dueD = Math.floor(rimbD + shareD);
        p.totalDue = p.dueM + p.dueC + p.dueD;
    });

    generateDashboard(activeList, totMet+totCrys+totDeut, groupLoss, (netM+netC+netD), method, tData);
}

function generateDashboard(players, totalCDR, totalLoss, totalProfit, method, t) {
    const summaryDiv = document.getElementById('global-summary');
    const cardsContainer = document.getElementById('cards-container');
    const transportContainer = document.getElementById('transport-container');
    
    // Summary
    summaryDiv.innerHTML = `
        <div class="sum-item"><span class="sum-label">${t.sum_cdr}</span><span class="sum-val" style="color:var(--primary)">${fmt(totalCDR)}</span></div>
        <div class="sum-item"><span class="sum-label">${t.sum_loss}</span><span class="sum-val" style="color:var(--danger)">${fmt(totalLoss)}</span></div>
        <div class="sum-item"><span class="sum-label">${t.sum_profit}</span><span class="sum-val" style="color:var(--success)">${fmt(totalProfit)}</span></div>
    `;

    // Cards
    let htmlCards = "";
    let txtReport = `--- 📊 ${t.rep_title} (${method.toUpperCase()}) ---\n`;

    players.forEach(p => {
        const balance = p.totalDue - p.harvestedValue;
        let balanceClass = balance > 100 ? "status-rec" : (balance < -100 ? "status-pay" : "status-even");
        let balanceLabel = balance > 100 ? t.status_rec : (balance < -100 ? t.status_pay : t.status_even);
        const weightStr = p.weightPercentage.toFixed(2) + "%";

        htmlCards += `
        <div class="player-card">
            <div class="card-header">
                <span class="p-name">${p.name}</span>
                <span class="status-badge ${balanceClass}">${balanceLabel}</span>
            </div>
            <div class="card-body">
                <div class="data-row"><span class="d-label">${t.card_fleet}</span><span class="d-val">${fmt(p.initialValue)}</span></div>
                <div class="data-row"><span class="d-label">${t.card_weight}</span><span class="d-val" style="color:var(--warning)">${weightStr}</span></div>
                <div class="data-row"><span class="d-label">${t.card_loss}</span><span class="d-val" style="color:var(--danger)">-${fmt(p.totalLoss)}</span></div>
                <div class="data-row"><span class="d-label">${t.card_harvest}</span><span class="d-val" style="color:var(--primary)">${fmt(p.harvestedValue)}</span></div>
                <div class="res-breakdown">
                    <div style="text-align:center; margin-bottom:5px; color:#fff; font-weight:bold;">${t.card_due}</div>
                    <div class="res-row"><span class="c-met">M</span> <span>${fmt(p.dueM)}</span></div>
                    <div class="res-row"><span class="c-crys">C</span> <span>${fmt(p.dueC)}</span></div>
                    <div class="res-row"><span class="c-deut">D</span> <span>${fmt(p.dueD)}</span></div>
                </div>
            </div>
            <div class="card-footer">
                <span class="d-label" style="font-size:0.8rem">${t.card_bal}:</span><br>
                <span class="bal-val ${balance > 0 ? 'text-ok' : (balance < 0 ? 'text-err' : '')}">${balance > 0 ? '+' : ''}${fmt(balance)}</span>
            </div>
        </div>`;

        txtReport += `> ${p.name} (${t.card_weight}: ${weightStr})\n`;
        txtReport += `  ${t.rep_spetta}: M:${fmt(p.dueM)} C:${fmt(p.dueC)} D:${fmt(p.dueD)}\n`;
        txtReport += `  ${t.card_bal}: ${balance > 0 ? t.status_rec + ' ' + fmt(balance) : t.status_pay + ' ' + fmt(Math.abs(balance))}\n\n`;
    });
    cardsContainer.innerHTML = htmlCards;

    // Transport
    const transportHTML = generateTransportPlanHTML(players, t);
    transportContainer.innerHTML = transportHTML;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = transportHTML.replace(/<div class="trade-route"/g, "\n>").replace(/<\/div>/g, "").replace(/<[^>]+>/g, " ");
    txtReport += `\n--- ✈️ ${t.rep_flight} ---\n${tempDiv.innerText}`;

    document.getElementById('copyText').innerText = txtReport;
}

function generateTransportPlanHTML(players, t) {
    let html = "";
    const solve = (resName, propHarvested, propDue, cssClass, iconClass) => {
        let senders = [], receivers = [];
        players.forEach(p => {
            const diff = p[propHarvested] - p[propDue];
            if (diff > 100) senders.push({ name: p.name, amount: diff });
            else if (diff < -100) receivers.push({ name: p.name, amount: -diff });
        });
        if (senders.length === 0) return "";

        let block = `<div class="transport-block"><div class="trans-title"><i class="fas ${iconClass}"></i> ${resName}</div>`;
        senders.forEach(sender => {
            while (sender.amount > 1) {
                if (receivers.length === 0) break;
                let receiver = receivers[0];
                let amt = Math.min(sender.amount, receiver.amount);
                block += `<div class="trade-route ${cssClass}"><span class="r-name">${sender.name}</span> <span class="r-arr">${t.trans_send}</span> <span class="r-amt">${fmt(amt)}</span> <span class="r-arr">${t.trans_to}</span> <span class="r-name">${receiver.name}</span></div>`;
                sender.amount -= amt; receiver.amount -= amt;
                if (receiver.amount < 1) receivers.shift();
            }
        });
        return block + "</div>";
    };

    html += solve("Metal", "harvestedM", "dueM", "route-met", "fa-cube");
    html += solve("Crystal", "harvestedC", "dueC", "route-crys", "fa-gem");
    html += solve("Deuterium", "harvestedD", "dueD", "route-deut", "fa-flask");

    if(html === "") return `<div class="transport-block" style="text-align:center; color:var(--success); border-color:var(--success)">${t.trans_none}</div>`;
    return html;
}

function fmt(n) { return new Intl.NumberFormat('it-IT').format(Math.floor(n)); }

function copyToClipboard() {
    const text = document.getElementById('copyText').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-copy');
        const orig = btn.innerText;
        btn.innerText = "OK!";
        setTimeout(() => btn.innerText = orig, 2000);
    });
}