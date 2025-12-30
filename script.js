/* --- STATO E INIZIALIZZAZIONE --- */
let players = [
    { id: 1, name: 'Attaccante 1', percent: 100 }
];

document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('btn-fetch').addEventListener('click', processApiKeys);
    document.getElementById('totalMetal').addEventListener('input', calculate);
    document.getElementById('totalCrystal').addEventListener('input', calculate);
    document.getElementById('recCapacity').addEventListener('input', calculate);
    document.getElementById('btn-add-player').addEventListener('click', addPlayer);
    document.getElementById('btn-distribute').addEventListener('click', distributeEqually);
    document.getElementById('btn-copy').addEventListener('click', copyToClipboard);
}

function init() {
    renderPlayers();
    calculate();
}

/* --- LOGICA API CALL (MOCK) --- */

async function processApiKeys() {
    const crKey = document.getElementById('api-cr').value.trim();
    const rrKeys = document.getElementById('api-rr').value.trim().split('\n').filter(k => k.length > 5);
    const statusDiv = document.getElementById('api-status');
    const btn = document.getElementById('btn-fetch');

    if (!crKey && rrKeys.length === 0) {
        alert("Inserisci almeno una chiave API per testare la demo.");
        return;
    }

    // UI Loading State
    btn.classList.add('loading');
    btn.innerText = "Caricamento...";
    statusDiv.innerText = "";

    let totalMet = 0;
    let totalCrys = 0;
    let attackersFound = [];

    try {
        // 1. Processo CR (Combat Report)
        if (crKey) {
            const crData = await fetchOgameData(crKey);
            if (crData && crData.attackers) {
                attackersFound = crData.attackers; 
            }
        }

        // 2. Processo RR (Recycle Reports)
        for (const key of rrKeys) {
            const rrData = await fetchOgameData(key);
            if (rrData) {
                totalMet += rrData.metal || 0;
                totalCrys += rrData.crystal || 0;
            }
        }

        // 3. Aggiornamento UI
        if (attackersFound.length > 0) {
            players = [];
            attackersFound.forEach((name, idx) => {
                players.push({ id: idx + 1, name: name, percent: 0 });
            });
        }

        if (totalMet > 0 || totalCrys > 0) {
            document.getElementById('totalMetal').value = totalMet;
            document.getElementById('totalCrystal').value = totalCrys;
        }

        distributeEqually();
        statusDiv.innerHTML = `<span class="status-ok">✔ Dati importati (Demo)</span>`;

    } catch (error) {
        console.error(error);
        statusDiv.innerHTML = `<span class="status-err">⚠ Errore: ${error.message}</span>`;
    } finally {
        btn.classList.remove('loading');
        btn.innerText = "📡 Decripta API & Compila";
    }
}

// Simulazione chiamata al servizio esterno
async function fetchOgameData(apiKey) {
    const parts = apiKey.split('-');
    const type = parts[0]; // cr o rr
    
    console.log(`[DEMO] Mocking fetch for: ${apiKey}`);

    // SIMULAZIONE RISPOSTA DAL SERVER ESTERNO
    // Qui andrebbe la fetch reale a ogapi.faw-kes.de
    return new Promise((resolve) => {
        setTimeout(() => {
            if (type === 'cr' || apiKey.includes('cr-')) {
                resolve({
                    success: true,
                    attackers: ["Commander Shepard", "Garrus Vakarian", "Liara T'Soni"],
                    defender: ["Saren"]
                });
            } else if (type === 'rr' || apiKey.includes('rr-')) {
                // Numeri casuali per rendere la demo dinamica
                resolve({
                    success: true,
                    metal: 10000000 + Math.floor(Math.random() * 5000000),
                    crystal: 5000000 + Math.floor(Math.random() * 2000000)
                });
            } else {
                resolve(null);
            }
        }, 600); 
    });
}

/* --- LOGICA CALCOLO & UI --- */

function addPlayer() {
    const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
    players.push({ id: newId, name: `Giocatore ${players.length + 1}`, percent: 0 });
    renderPlayers();
    calculate();
}

function removePlayer(id) {
    if (players.length <= 1) return;
    players = players.filter(p => p.id !== id);
    renderPlayers();
    calculate();
}

// Funzione esposta globalmente per essere chiamata dall'HTML onclick
window.removePlayer = removePlayer; 

function updatePlayer(id, field, value) {
    const player = players.find(p => p.id === id);
    if (player) {
        player[field] = field === 'percent' ? parseFloat(value) || 0 : value;
        calculate();
    }
}
window.updatePlayer = updatePlayer;

function distributeEqually() {
    const count = players.length;
    if (count === 0) return;
    const equalShare = (100 / count).toFixed(2);
    
    let currentTotal = 0;
    players.forEach((p, index) => {
        if (index === count - 1) {
            p.percent = parseFloat((100 - currentTotal).toFixed(2));
        } else {
            p.percent = parseFloat(equalShare);
            currentTotal += p.percent;
        }
    });
    renderPlayers();
    calculate();
}

function renderPlayers() {
    const container = document.getElementById('players-container');
    container.innerHTML = '';

    players.forEach(p => {
        const row = document.createElement('div');
        row.className = 'player-row';
        row.innerHTML = `
            <input type="text" value="${p.name}" placeholder="Nome" oninput="window.updatePlayer(${p.id}, 'name', this.value)">
            <input type="number" value="${p.percent}" placeholder="%" step="0.1" oninput="window.updatePlayer(${p.id}, 'percent', this.value)">
            <span style="font-weight:bold">%</span>
            <button class="btn-danger remove-btn" onclick="window.removePlayer(${p.id})">&times;</button>
        `;
        container.appendChild(row);
    });
}

function formatNumber(num) {
    return new Intl.NumberFormat('it-IT').format(Math.floor(num));
}

function calculate() {
    const totalMetal = parseFloat(document.getElementById('totalMetal').value) || 0;
    const totalCrystal = parseFloat(document.getElementById('totalCrystal').value) || 0;
    const recCapacity = parseFloat(document.getElementById('recCapacity').value) || 20000;

    const totalRes = totalMetal + totalCrystal;
    const recsNeeded = Math.ceil(totalRes / recCapacity);
    
    document.getElementById('recsNeeded').innerText = `Navi necessarie: ${formatNumber(recsNeeded)}`;

    let tableHTML = `<table><thead><tr><th>Giocatore</th><th>%</th><th>Metallo</th><th>Cristallo</th><th>Totale</th></tr></thead><tbody>`;
    let textOutput = `--- 🚀 SPARTIZIONE CDR ---\n`;
    textOutput += `Totale Met: ${formatNumber(totalMetal)} | Totale Cris: ${formatNumber(totalCrystal)}\n`;
    textOutput += `Riciclatrici: ${formatNumber(recsNeeded)}\n--------------------------\n`;

    let currentSumPercent = 0;

    players.forEach(p => {
        currentSumPercent += p.percent;
        const shareMetal = (totalMetal * p.percent) / 100;
        const shareCrystal = (totalCrystal * p.percent) / 100;
        const shareTotal = shareMetal + shareCrystal;

        tableHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${p.percent}%</td>
                <td style="color:#aaa">${formatNumber(shareMetal)}</td>
                <td style="color:#58a6ff">${formatNumber(shareCrystal)}</td>
                <td><strong>${formatNumber(shareTotal)}</strong></td>
            </tr>
        `;

        textOutput += `> ${p.name} (${p.percent}%)\n`;
        textOutput += `  Met: ${formatNumber(shareMetal)} | Cris: ${formatNumber(shareCrystal)}\n\n`;
    });

    tableHTML += `</tbody></table>`;
    
    if (Math.abs(currentSumPercent - 100) > 0.1) {
            tableHTML += `<div style="color:var(--danger-color); margin-top:5px; font-weight:bold;">⚠️ ATTENZIONE: Totale percentuali = ${currentSumPercent.toFixed(2)}%</div>`;
    }

    document.getElementById('table-container').innerHTML = tableHTML;
    document.getElementById('copyText').innerText = textOutput;
}

function copyToClipboard() {
    const text = document.getElementById('copyText').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-copy');
        const originalText = btn.innerText;
        btn.innerText = "Copiato!";
        setTimeout(() => btn.innerText = originalText, 2000);
    });
}