/* OGame ACS Splitter V3.5 - Full & Stable */

const LANG_DATA = {
    it: {
        sec_input: "Inserimento Dati Smart", btn_parse: "AVVIA SPARTIZIONE", lbl_role: "Ruolo:", opt_attacker: "Attaccanti", opt_defender: "Difensori", lbl_method: "Metodo:", opt_equal: "Equa", opt_weighted: "Pesata", sec_dashboard: "Dashboard", lbl_report: "Report Testuale", btn_copy: "COPIA REPORT", sum_cdr: "Totale CDR", sum_loss: "Perdite Flotta", sum_profit: "Utile Netto", card_fleet: "Flotta Iniz.", card_weight: "Peso Flotta", card_loss: "Perdite Tot.", card_harvest: "Raccolto", card_due: "Spetta (Dettaglio)", card_bal: "Guadagno Reale", status_rec: "RICEVE", status_pay: "PAGA", status_even: "PARI", trans_send: "invia", trans_to: "a", trans_none: "✅ Nessun trasporto necessario!", rep_title: "SPARTIZIONE DETRITI", rep_by: "By OgameSplit", rep_flight: "PIANO DI VOLO", rep_spetta: "Spetta", rep_harvest: "Detriti Reciclati", rep_no_harvest: "Nessuna reciclata", rep_gain_det: "GUADAGNO", btn_ticket: "COPIA PER TICKET SYSTEM", ph_unified: "Incolla API Combattimento (CR) o Reciclate (RR)...", res_m: "Metallo", res_c: "Cristallo", res_d: "Deuterio"
    },
    en: {
        sec_input: "Smart Data Input", btn_parse: "START SPLIT", lbl_role: "Role:", opt_attacker: "Attackers", opt_defender: "Defenders", lbl_method: "Method:", opt_equal: "Equal", opt_weighted: "Weighted", sec_dashboard: "Dashboard", lbl_report: "Text Report", btn_copy: "COPY REPORT", sum_cdr: "Total DF", sum_loss: "Fleet Losses", sum_profit: "Net Profit", card_fleet: "Init. Fleet", card_weight: "Fleet Weight", card_loss: "Tot. Losses", card_harvest: "Harvested", card_due: "Due (Detail)", card_bal: "Net Profit", status_rec: "RECEIVES", status_pay: "PAYS", status_even: "EVEN", trans_send: "sends", trans_to: "to", trans_none: "✅ No transport needed!", rep_title: "ACS DEBRIS SPLIT", rep_by: "By OgameSplit", rep_flight: "FLIGHT PLAN", rep_spetta: "Due", rep_harvest: "Harvested Debris", rep_no_harvest: "No harvest", rep_gain_det: "PROFIT", btn_ticket: "COPY FOR TICKET SYSTEM", ph_unified: "Paste Combat (CR) or Recycle (RR) API here...", res_m: "Metal", res_c: "Crystal", res_d: "Deuterium"
    },
    de: {
        sec_input: "Smart Daten Eingabe", btn_parse: "STARTEN", lbl_role: "Rolle:", opt_attacker: "Angreifer", opt_defender: "Verteidiger", lbl_method: "Methode:", opt_equal: "Gleich", opt_weighted: "Gewichtet", sec_dashboard: "Dashboard", lbl_report: "Textbericht", btn_copy: "BERICHT KOPIEREN", sum_cdr: "Gesamt TF", sum_loss: "Flottenverluste", sum_profit: "Reingewinn", card_fleet: "Init. Flotte", card_weight: "Flottengewicht", card_loss: "Verluste", card_harvest: "Abgebaut", card_due: "Anteil", card_bal: "Reingewinn", status_rec: "BEKOMMT", status_pay: "ZAHLT", status_even: "EGAL", trans_send: "sendet", trans_to: "an", trans_none: "✅ Kein Transport nötig!", rep_title: "AKS TRÜMMER", rep_by: "By OgameSplit", rep_flight: "FLUGPLAN", rep_spetta: "Anteil", rep_harvest: "Abgebaute Trümmer", rep_no_harvest: "Kein Abbau", rep_gain_det: "GEWINN", btn_ticket: "KOPIE FÜR TICKETSYSTEM", ph_unified: "CR oder RR API hier einfügen...", res_m: "Metall", res_c: "Kristall", res_d: "Deuterium"
    },
    fr: {
        sec_input: "Saisie Données", btn_parse: "LANCER", lbl_role: "Rôle:", opt_attacker: "Attaquants", opt_defender: "Défenseurs", lbl_method: "Méthode:", opt_equal: "Équitable", opt_weighted: "Pondérée", sec_dashboard: "Tableau de Bord", lbl_report: "Rapport", btn_copy: "COPIER", sum_cdr: "Total CDR", sum_loss: "Pertes", sum_profit: "Bénéfice", card_fleet: "Flotte Init.", card_weight: "Poids Flotte", card_loss: "Pertes", card_harvest: "Récolté", card_due: "Dû", card_bal: "Gain", status_rec: "REÇOIT", status_pay: "PAIE", status_even: "ÉGAL", trans_send: "envoie", trans_to: "à", trans_none: "✅ Aucun transport!", rep_title: "RÉPARTITION CDR", rep_by: "By OgameSplit", rep_flight: "PLAN DE VOL", rep_spetta: "Dû", rep_harvest: "Débris Recyclés", rep_no_harvest: "Aucun recyclage", rep_gain_det: "PROFIT", btn_ticket: "COPIE POUR SYSTÈME DE TICKETS", ph_unified: "Collez API Combat (RC) ou Recyclage (RR)...", res_m: "Métal", res_c: "Cristal", res_d: "Deutérium"
    },
    es: {
        sec_input: "Entrada Datos", btn_parse: "INICIAR", lbl_role: "Rol:", opt_attacker: "Atacantes", opt_defender: "Defensores", lbl_method: "Método:", opt_equal: "Igual", opt_weighted: "Ponderado", sec_dashboard: "Panel", lbl_report: "Reporte", btn_copy: "COPIAR", sum_cdr: "Total Escombros", sum_loss: "Pérdidas", sum_profit: "Beneficio", card_fleet: "Flota Inic.", card_weight: "Peso Flota", card_loss: "Pérdidas", card_harvest: "Recolectado", card_due: "Corresponde", card_bal: "Ganancia", status_rec: "RECIBE", status_pay: "PAGA", status_even: "PAREJO", trans_send: "envía", trans_to: "a", trans_none: "✅ Sin transporte!", rep_title: "REPARTO ESCOMBROS", rep_by: "By OgameSplit", rep_flight: "PLAN DE VUELO", rep_spetta: "Corresp.", rep_harvest: "Escombros Reciclados", rep_no_harvest: "Sin recolección", rep_gain_det: "GANANCIA", btn_ticket: "COPIA PARA SISTEMA DE TICKETS", ph_unified: "Pega API Batalla (CR) o Reciclaje (RR)...", res_m: "Metal", res_c: "Cristal", res_d: "Deuterio"
    },
    pl: {
        sec_input: "Dane Smart", btn_parse: "START", lbl_role: "Rola:", opt_attacker: "Agresorzy", opt_defender: "Obrońcy", lbl_method: "Metoda:", opt_equal: "Równa", opt_weighted: "Ważona", sec_dashboard: "Pulpit", lbl_report: "Raport", btn_copy: "KOPIUJ", sum_cdr: "Całkowity Złom", sum_loss: "Straty Floty", sum_profit: "Zysk Netto", card_fleet: "Flota Pocz.", card_weight: "Waga Floty", card_loss: "Straty", card_harvest: "Zebrano", card_due: "Należy się", card_bal: "Zysk", status_rec: "OTRZYMUJE", status_pay: "PŁACI", status_even: "RÓWNO", trans_send: "wysyła", trans_to: "do", trans_none: "✅ Brak transportu!", rep_title: "PODZIAŁ ZŁOMU", rep_by: "By OgameSplit", rep_flight: "PLAN LOTU", rep_spetta: "Należy", rep_harvest: "Zebrany Złom", rep_no_harvest: "Brak zbiórki", rep_gain_det: "ZYSK", btn_ticket: "KOPIA DLA SYSTEMU ZGŁOSZEŃ", ph_unified: "Wklej API Walki (CR) lub Recyklingu (RR)...", res_m: "Metal", res_c: "Kryształ", res_d: "Deuter"
    },
    tr: {
        sec_input: "Veri Girişi", btn_parse: "BAŞLAT", lbl_role: "Rol:", opt_attacker: "Saldıranlar", opt_defender: "Savunanlar", lbl_method: "Yöntem:", opt_equal: "Eşit", opt_weighted: "Ağırlıklı", sec_dashboard: "Panel", lbl_report: "Rapor", btn_copy: "KOPYALA", sum_cdr: "Toplam Harabe", sum_loss: "Filo Kaybı", sum_profit: "Net Kâr", card_fleet: "İlk Filo", card_weight: "Filo Ağırlığı", card_loss: "Kayıplar", card_harvest: "Toplanan", card_due: "Hakediş", card_bal: "Net Kazanç", status_rec: "ALIR", status_pay: "ÖDER", status_even: "EŞİT", trans_send: "gönderir", trans_to: "->", trans_none: "✅ Nakliye gerekmez!", rep_title: "HARABE PAYLAŞIMI", rep_by: "By OgameSplit", rep_flight: "UÇUŞ PLANI", rep_spetta: "Hakediş", rep_harvest: "Toplanan Harabe", rep_no_harvest: "Toplama yok", rep_gain_det: "KAZANÇ", btn_ticket: "TICKET SİSTEMİ İÇİN KOPYALA", ph_unified: "Savaş (CR) veya Harabe (RR) API yapıştır...", res_m: "Metal", res_c: "Kristal", res_d: "Deuterium"
    },
    pt: {
        sec_input: "Entrada Dados", btn_parse: "INICIAR", lbl_role: "Papel:", opt_attacker: "Atacantes", opt_defender: "Defensores", lbl_method: "Método:", opt_equal: "Igual", opt_weighted: "Ponderado", sec_dashboard: "Painel", lbl_report: "Relatório", btn_copy: "COPIAR", sum_cdr: "Total Destroços", sum_loss: "Perdas", sum_profit: "Lucro Líquido", card_fleet: "Frota Inic.", card_weight: "Peso Frota", card_loss: "Perdas", card_harvest: "Coletado", card_due: "Devido", card_bal: "Lucro", status_rec: "RECEBE", status_pay: "PAGA", status_even: "IGUAL", trans_send: "envia", trans_to: "para", trans_none: "✅ Sem transporte!", rep_title: "DIVISÃO DESTROÇOS", rep_by: "By OgameSplit", rep_flight: "PLANO DE VOO", rep_spetta: "Devido", rep_harvest: "Destroços Coletados", rep_no_harvest: "Sem coleta", rep_gain_det: "LUCRO", btn_ticket: "CÓPIA PARA SISTEMA DE TICKET", ph_unified: "Cole API Combate (CR) ou Reciclagem (RR)...", res_m: "Metal", res_c: "Cristal", res_d: "Deutério"
    },
    nl: {
        sec_input: "Gegevensinvoer", btn_parse: "STARTEN", lbl_role: "Rol:", opt_attacker: "Aanvallers", opt_defender: "Verdedigers", lbl_method: "Methode:", opt_equal: "Gelijk", opt_weighted: "Gewogen", sec_dashboard: "Dashboard", lbl_report: "Rapport", btn_copy: "KOPIËREN", sum_cdr: "Totaal Puin", sum_loss: "Vlootverlies", sum_profit: "Netto Winst", card_fleet: "Init. Vloot", card_weight: "Vlootgewicht", card_loss: "Verliezen", card_harvest: "Geoogst", card_due: "Te ontvangen", card_bal: "Winst", status_rec: "ONTVANGT", status_pay: "BETAALT", status_even: "GELIJK", trans_send: "stuurt", trans_to: "naar", trans_none: "✅ Geen transport!", rep_title: "PUIN VERDELING", rep_by: "By OgameSplit", rep_flight: "VLUCHTPLAN", rep_spetta: "Te ontvangen", rep_harvest: "Geoogst Puin", rep_no_harvest: "Niet geoogst", rep_gain_det: "WINST", btn_ticket: "KOPIE VOOR TICKETSYSTEEM", ph_unified: "Plak Gevecht (CR) of Recycler (RR) API...", res_m: "Metaal", res_c: "Kristal", res_d: "Deuterium"
    },
    ru: {
        sec_input: "Ввод данных", btn_parse: "НАЧАТЬ", lbl_role: "Роль:", opt_attacker: "Атакующие", opt_defender: "Защитники", lbl_method: "Метод:", opt_equal: "Равный", opt_weighted: "Взвешенный", sec_dashboard: "Панель", lbl_report: "Отчет", btn_copy: "КОПИРОВАТЬ", sum_cdr: "Всего лома", sum_loss: "Потери флота", sum_profit: "Прибыль", card_fleet: "Нач. флот", card_weight: "Вес флота", card_loss: "Потери", card_harvest: "Собрано", card_due: "Доля", card_bal: "Итог", status_rec: "ПОЛУЧАЕТ", status_pay: "ПЛАТИТ", status_even: "РОВНО", trans_send: "шлет", trans_to: "к", trans_none: "✅ Нет транспорта!", rep_title: "ДЕЛЕЖ ЛОМА", rep_by: "By OgameSplit", rep_flight: "ПЛАН ПОЛЕТА", rep_spetta: "Доля", rep_harvest: "Собранный лом", rep_no_harvest: "Не собрано", rep_gain_det: "ПРИБЫЛЬ", btn_ticket: "КОПИЯ ДЛЯ СИСТЕМЫ ТИКЕТОВ", ph_unified: "Вставьте API боя (CR) или переработки (RR)...", res_m: "Металл", res_c: "Кристалл", res_d: "Дейтерий"
    },
    cz: {
        sec_input: "Vstup dat", btn_parse: "SPUSTIT", lbl_role: "Role:", opt_attacker: "Útočníci", opt_defender: "Obránci", lbl_method: "Metoda:", opt_equal: "Rovná", opt_weighted: "Vážená", sec_dashboard: "Přehled", lbl_report: "Report", btn_copy: "KOPÍROVAT", sum_cdr: "Celkem Trosky", sum_loss: "Ztráty", sum_profit: "Zisk", card_fleet: "Poč. Letka", card_weight: "Váha flotily", card_loss: "Ztráty", card_harvest: "Sesbíráno", card_due: "Nárok", card_bal: "Zisk", status_rec: "PŘIJÍMÁ", status_pay: "PLATÍ", status_even: "ROVNO", trans_send: "posílá", trans_to: "komu", trans_none: "✅ Žádný transport!", rep_title: "ROZDĚLENÍ TROSEK", rep_by: "By OgameSplit", rep_flight: "LET PLÁN", rep_spetta: "Nárok", rep_harvest: "Sesbírané trosky", rep_no_harvest: "Nesbíráno", rep_gain_det: "ZISK", btn_ticket: "KOPIE PRO TICKET SYSTÉM", ph_unified: "Vložte API boje (CR) nebo recyklace (RR)...", res_m: "Kov", res_c: "Krystal", res_d: "Deuterium"
    },
    hr: {
        sec_input: "Unos podataka", btn_parse: "POKRENI", lbl_role: "Uloga:", opt_attacker: "Napadači", opt_defender: "Branitelji", lbl_method: "Metoda:", opt_equal: "Jednako", opt_weighted: "Vagano", sec_dashboard: "Nadzorna ploča", lbl_report: "Izvještaj", btn_copy: "KOPIRAJ", sum_cdr: "Ukupno Ruševina", sum_loss: "Gubici", sum_profit: "Dobit", card_fleet: "Poč. Flota", card_weight: "Težina Flote", card_loss: "Gubici", card_harvest: "Skupljeno", card_due: "Pripada", card_bal: "Dobit", status_rec: "PRIMA", status_pay: "PLAĆA", status_even: "ISTO", trans_send: "šalje", trans_to: "za", trans_none: "✅ Nema transporta!", rep_title: "PODJELA RUŠEVINA", rep_by: "By OgameSplit", rep_flight: "PLAN LETA", rep_spetta: "Pripada", rep_harvest: "Skupljene ruševine", rep_no_harvest: "Nije skupljeno", rep_gain_det: "DOBIT", btn_ticket: "KOPIJA ZA SUSTAV ULAZNICA", ph_unified: "Zalijepi Borbeni (CR) ili Reciklažni (RR) API...", res_m: "Metal", res_c: "Kristal", res_d: "Deuterij"
    },
    hu: {
        sec_input: "Adatbevitel", btn_parse: "INDÍTÁS", lbl_role: "Szerep:", opt_attacker: "Támadók", opt_defender: "Védők", lbl_method: "Módszer:", opt_equal: "Egyenlő", opt_weighted: "Súlyozott", sec_dashboard: "Irányítópult", lbl_report: "Jelentés", btn_copy: "MÁSOLÁS", sum_cdr: "Teljes Törmelék", sum_loss: "Veszteség", sum_profit: "Profit", card_fleet: "Kezdő Flotta", card_weight: "Flotta Súly", card_loss: "Veszteség", card_harvest: "Begyűjtve", card_due: "Jár", card_bal: "Nyereség", status_rec: "KAP", status_pay: "FIZET", status_even: "EGYENLŐ", trans_send: "küld", trans_to: "neki", trans_none: "✅ Nincs szállítás!", rep_title: "TÖRMELÉK OSZTÁS", rep_by: "By OgameSplit", rep_flight: "REPÜLÉSI TERV", rep_spetta: "Jár", rep_harvest: "Begyűjtött törmelék", rep_no_harvest: "Nincs gyűjtés", rep_gain_det: "PROFIT", btn_ticket: "MÁSOLAT JEGYRENDSZERHEZ", ph_unified: "Illeszd be a Csata (CR) vagy Szemét (RR) API-t...", res_m: "Fém", res_c: "Kristály", res_d: "Deutérium"
    },
    ro: {
        sec_input: "Intrare Date", btn_parse: "START", lbl_role: "Rol:", opt_attacker: "Atacatori", opt_defender: "Apărători", lbl_method: "Metodă:", opt_equal: "Egal", opt_weighted: "Ponderat", sec_dashboard: "Panou", lbl_report: "Raport", btn_copy: "COPIAZĂ", sum_cdr: "Total Deșeuri", sum_loss: "Pierderi", sum_profit: "Profit", card_fleet: "Flotă Iniț.", card_weight: "Pondere Flotă", card_loss: "Pierderi", card_harvest: "Recoltat", card_due: "Cuvine", card_bal: "Câștig", status_rec: "PRIMEȘTE", status_pay: "PLĂTEȘTE", status_even: "EGAL", trans_send: "trimite", trans_to: "la", trans_none: "✅ Fără transport!", rep_title: "ÎMPĂRȚIRE DEȘEURI", rep_by: "By OgameSplit", rep_flight: "PLAN ZBOR", rep_spetta: "Cuvine", rep_harvest: "Deșeuri Recoltate", rep_no_harvest: "Nimic recoltat", rep_gain_det: "PROFIT", btn_ticket: "COPIE PENTRU SISTEM TICKET", ph_unified: "Lipește API Luptă (CR) sau Reciclare (RR)...", res_m: "Metal", res_c: "Cristal", res_d: "Deuteriu"
    },
    sk: {
        sec_input: "Vstup dát", btn_parse: "SPUSTIŤ", lbl_role: "Rola:", opt_attacker: "Útočníci", opt_defender: "Obrancovia", lbl_method: "Metóda:", opt_equal: "Rovná", opt_weighted: "Vážená", sec_dashboard: "Prehľad", lbl_report: "Report", btn_copy: "KOPÍROVAŤ", sum_cdr: "Celkom Trosky", sum_loss: "Straty", sum_profit: "Zisk", card_fleet: "Poč. Letka", card_weight: "Váha flotily", card_loss: "Straty", card_harvest: "Zozbierané", card_due: "Nárok", card_bal: "Zisk", status_rec: "PRIJÍMA", status_pay: "PLATÍ", status_even: "ROVNO", trans_send: "posiela", trans_to: "komu", trans_none: "✅ Žiadny transport!", rep_title: "ROZDELENIE TROSIEK", rep_by: "By OgameSplit", rep_flight: "LET PLÁN", rep_spetta: "Nárok", rep_harvest: "Zozbierané trosky", rep_no_harvest: "Nezozbierané", rep_gain_det: "ZISK", btn_ticket: "KÓPIA PRE TICKET SYSTÉM", ph_unified: "Vložte API boja (CR) alebo recyklácie (RR)...", res_m: "Kov", res_c: "Kryštál", res_d: "Deutérium"
    },
    br: {
        sec_input: "Entrada Dados", btn_parse: "INICIAR", lbl_role: "Papel:", opt_attacker: "Atacantes", opt_defender: "Defensores", lbl_method: "Método:", opt_equal: "Igual", opt_weighted: "Ponderado", sec_dashboard: "Painel", lbl_report: "Relatório", btn_copy: "COPIAR", sum_cdr: "Total Destroços", sum_loss: "Perdas", sum_profit: "Lucro", card_fleet: "Frota Inic.", card_weight: "Peso Frota", card_loss: "Perdas", card_harvest: "Coletado", card_due: "Devido", card_bal: "Lucro", status_rec: "RECEBE", status_pay: "PAGA", status_even: "IGUAL", trans_send: "envia", trans_to: "para", trans_none: "✅ Sem transporte!", rep_title: "DIVISÃO DESTROÇOS", rep_by: "By OgameSplit", rep_flight: "PLANO DE VOO", rep_spetta: "Devido", rep_harvest: "Destroços Coletados", rep_no_harvest: "Sem coleta", rep_gain_det: "LUCRO", btn_ticket: "CÓPIA PARA SISTEMA DE TICKET", ph_unified: "Cole API Combate (CR) ou Reciclagem (RR)...", res_m: "Metal", res_c: "Cristal", res_d: "Deutério"
    },
    jp: {
        sec_input: "データ入力", btn_parse: "開始", lbl_role: "役割:", opt_attacker: "攻撃側", opt_defender: "防御側", lbl_method: "方法:", opt_equal: "均等", opt_weighted: "加重", sec_dashboard: "ダッシュボード", lbl_report: "レポート", btn_copy: "コピー", sum_cdr: "総瓦礫", sum_loss: "損失", sum_profit: "利益", card_fleet: "初期艦隊", card_weight: "比重", card_loss: "損失", card_harvest: "収穫", card_due: "取り分", card_bal: "利益", status_rec: "受取", status_pay: "支払", status_even: "同等", trans_send: "送る", trans_to: "へ", trans_none: "✅ 輸送不要！", rep_title: "瓦礫分割", rep_by: "By OgameSplit", rep_flight: "フライトプラン", rep_spetta: "取り分", rep_harvest: "回収された瓦礫", rep_no_harvest: "回収なし", rep_gain_det: "利益", btn_ticket: "チケットシステムのコピー", ph_unified: "戦闘(CR)またはリサイクル(RR)のAPIを貼り付け...", res_m: "メタル", res_c: "クリスタル", res_d: "デューテリウム"
    }
};

let currentLang = 'it';
let currentVisualReport = "";

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

let MEMORY_CR = "";
let MEMORY_RR = [];
let playersList = []; 

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-parse').addEventListener('click', parseData);
    document.getElementById('btn-copy').addEventListener('click', copyToClipboard);
    document.getElementById('btn-reset-all').addEventListener('click', resetAll);
    document.getElementById('unified-input').addEventListener('input', handleUnifiedInput);
    
    document.getElementById('btn-ticket').addEventListener('click', copyTicketReport);
    document.getElementById('btn-wa').addEventListener('click', shareWhatsapp);
    document.getElementById('btn-tg').addEventListener('click', shareTelegram);

    document.querySelectorAll('input[name="method"], input[name="role"]').forEach(input => {
        input.addEventListener('change', () => {
            if(playersList.length > 0) calculateDistribution();
        });
    });

    const savedLang = localStorage.getItem('ogame-lang') || 'it';
    const langToUse = LANG_DATA[savedLang] ? savedLang : 'it';
    const langSelect = document.getElementById('lang-select');
    if(langSelect) langSelect.value = langToUse;

    setLanguage(langToUse); 
});

function handleUnifiedInput() {
    const txt = this.value.trim(); // TRIM per rimuovere spazi accidentali
    
    if(txt.includes("attackers") && txt.includes("rounds")) {
        MEMORY_CR = this.value; // Salva valore originale non trimmato per parsing sicuro
        this.value = ""; 
        showFeedback("Combat Report OK!", "success");
        updateMemoryUI();
        return;
    }
    if(txt.includes("recycler_count") && txt.includes("owner_id")) {
        MEMORY_RR.push(this.value);
        this.value = ""; 
        showFeedback("Reciclata OK!", "success");
        updateMemoryUI();
        return;
    }
}

function showFeedback(msg, type) {
    const el = document.getElementById('input-feedback');
    el.innerText = msg;
    el.className = `input-feedback feedback-${type}`;
    setTimeout(() => { el.style.opacity = 0; }, 2000);
    el.style.opacity = 1;
}

function updateMemoryUI() {
    const crBadge = document.getElementById('status-cr');
    const rrBadge = document.getElementById('status-rr');
    if (MEMORY_CR) { crBadge.classList.add('active'); crBadge.innerHTML = '<i class="fas fa-check"></i> CR'; } 
    else { crBadge.classList.remove('active'); crBadge.innerHTML = '<i class="fas fa-times"></i> NO CR'; }
    if (MEMORY_RR.length > 0) { rrBadge.classList.add('active'); rrBadge.innerHTML = `<i class="fas fa-check"></i> ${MEMORY_RR.length} RR`; } 
    else { rrBadge.classList.remove('active'); rrBadge.innerHTML = '<i class="fas fa-hashtag"></i> 0 RR'; }
}

function resetAll() {
    MEMORY_CR = ""; MEMORY_RR = []; playersList = []; currentVisualReport = "";
    document.getElementById('dashboard-area').style.display = 'none';
    updateMemoryUI();
    showFeedback("Reset OK", "error");
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ogame-lang', lang);
    let t = LANG_DATA[lang] || LANG_DATA['en'];
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[key]) {
            if(el.tagName === 'BUTTON') el.innerHTML = el.innerHTML.replace(el.innerText, t[key]); 
            else el.innerText = t[key];
        }
    });
    const input = document.getElementById('unified-input');
    if(input && t.ph_unified) input.placeholder = t.ph_unified;
    if (playersList.length > 0) calculateDistribution();
}

function parseData() {
    if(!MEMORY_CR) { alert("Manca il Combat Report!"); return; }
    const role = document.querySelector('input[name="role"]:checked').value; 
    playersList = []; let playerIdToIndexMap = {}; 
    
    try {
        const roleStartTag = role === 'attacker' ? '[attackers] => Array' : '[defenders] => Array';
        const parts = MEMORY_CR.split(roleStartTag);
        if (parts.length < 2) throw new Error(`Sezione ${role} non trovata.`);
        
        const sectionContent = parts[1].split(/\[(rounds|defenders|attackers)\] => Array/)[0];
        const idRegex = /\[fleet_owner_id\] => (\d+)/g;
        let idMatches = []; let match;
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

            playersList[i] = { index: i, id: pId, name: pName, initialValue: 0, initialM: 0, initialC: 0, initialD: 0, lossM: 0, lossC: 0, lossD: 0, harvestedM: 0, harvestedC: 0, harvestedD: 0, harvestedValue: 0, dueM: 0, dueC: 0, dueD: 0, weightPercentage: 0 };
            playerIdToIndexMap[pId] = i;

            const globalShipRegex = /\[ship_type\]\s*=>\s*(\d+)[\s\S]*?\[count\]\s*=>\s*(\d+)/g;
            let sMatch;
            while ((sMatch = globalShipRegex.exec(playerChunk)) !== null) {
                const sId = parseInt(sMatch[1]);
                const count = parseInt(sMatch[2]);
                if (SHIPS_COST[sId]) {
                    const cost = SHIPS_COST[sId];
                    playersList[i].initialM += cost.m * count;
                    playersList[i].initialC += cost.c * count;
                    playersList[i].initialD += cost.d * count;
                    playersList[i].initialValue += (cost.m + cost.c + cost.d) * count;
                }
            }
        }

        const lossKeyword = role === 'attacker' ? '[attacker_ship_losses]' : '[defender_ship_losses]';
        const roundBlocks = MEMORY_CR.split('[round_number] =>');
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

        let totMet = 0, totCrys = 0, totDeut = 0;
        MEMORY_RR.forEach(rrText => {
            const rrReports = rrText.split(/\[generic\] => stdClass Object/);
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
                    playersList.push({ index: newIdx, id: recId, name: recName + " (Ext)", initialValue: 0, initialM: 0, initialC: 0, initialD: 0, lossM: 0, lossC: 0, lossD: 0, harvestedM: m, harvestedC: c, harvestedD: d, harvestedValue: (m + c + d), dueM: 0, dueC: 0, dueD: 0, weightPercentage: 0 });
                    playerIdToIndexMap[recId] = newIdx;
                }
            }
        });

        if(MEMORY_RR.length === 0) {
            totMet = extractRes(MEMORY_CR, /\[debris_metal_total\] => (\d+)/);
            totCrys = extractRes(MEMORY_CR, /\[debris_crystal_total\] => (\d+)/);
            totDeut = extractRes(MEMORY_CR, /\[debris_deuterium_total\] => (\d+)/);
        }

        document.getElementById('totalMetal').dataset.val = totMet;
        document.getElementById('totalCrystal').dataset.val = totCrys;
        document.getElementById('totalDeuterium').dataset.val = totDeut;

        if(playersList.filter(p => p !== undefined).length > 0) calculateDistribution();
        document.getElementById('dashboard-area').style.display = 'block';
    } catch (e) { console.error(e); alert("Errore: " + e.message); }
}

function extractRes(text, regex) { const m = text.match(regex); return m ? parseInt(m[1]) : 0; }

function calculateDistribution() {
    const tData = LANG_DATA[currentLang];
    const totMet = parseFloat(document.getElementById('totalMetal').dataset.val)||0;
    const totCrys = parseFloat(document.getElementById('totalCrystal').dataset.val)||0;
    const totDeut = parseFloat(document.getElementById('totalDeuterium').dataset.val)||0;
    const method = document.querySelector('input[name="method"]:checked').value;
    
    let groupLoss = 0, groupInitial = 0;
    let totalLossM = 0, totalLossC = 0, totalLossD = 0;
    const activeList = playersList.filter(p => p);

    activeList.forEach(p => {
        p.totalLoss = p.lossM + p.lossC + p.lossD;
        groupLoss += p.totalLoss; groupInitial += p.initialValue;
        totalLossM += p.lossM; totalLossC += p.lossC; totalLossD += p.lossD;
    });
    activeList.forEach(p => { p.weightPercentage = groupInitial > 0 ? (p.initialValue / groupInitial) * 100 : 0; });

    let netM = Math.max(0, totMet - totalLossM), netC = Math.max(0, totCrys - totalLossC), netD = Math.max(0, totDeut - totalLossD);
    const realParticipants = activeList.filter(pl => pl.initialValue > 0).length;

    activeList.forEach(p => {
        let rimbM = p.lossM, rimbC = p.lossC, rimbD = p.lossD;
        if ((totMet+totCrys+totDeut) < (totalLossM+totalLossC+totalLossD)) {
            const ratio = (totMet+totCrys+totDeut) / (totalLossM+totalLossC+totalLossD);
            rimbM *= ratio; rimbC *= ratio; rimbD *= ratio; netM = 0; netC = 0; netD = 0;
        }
        let shareM = 0, shareC = 0, shareD = 0;
        if (method === 'equal' && realParticipants > 0 && p.initialValue > 0) {
            shareM = netM / realParticipants; shareC = netC / realParticipants; shareD = netD / realParticipants;
        } else if (method === 'weighted' && groupInitial > 0 && p.initialValue > 0) {
            const weight = p.initialValue / groupInitial;
            shareM = netM * weight; shareC = netC * weight; shareD = netD * weight;
        }
        p.dueM = Math.floor(rimbM + shareM); p.dueC = Math.floor(rimbC + shareC); p.dueD = Math.floor(rimbD + shareD);
        p.totalDue = p.dueM + p.dueC + p.dueD;
    });

    generateDashboard(activeList, totMet+totCrys+totDeut, groupLoss, (netM+netC+netD), method, tData);
}

function getTooltipHTML(m, c, d) {
    return `<div class="custom-tooltip"><div class="tt-row"><span class="c-met">M:</span> <span class="tt-val">${fmt(m)}</span></div><div class="tt-row"><span class="c-crys">C:</span> <span class="tt-val">${fmt(c)}</span></div><div class="tt-row"><span class="c-deut">D:</span> <span class="tt-val">${fmt(d)}</span></div></div>`;
}

function generateDashboard(players, totalCDR, totalLoss, totalProfit, method, t) {
    const summaryDiv = document.getElementById('global-summary');
    const cardsContainer = document.getElementById('cards-container');
    const transportContainer = document.getElementById('transport-container');
    
    summaryDiv.innerHTML = `
        <div class="sum-item"><span class="sum-label">${t.sum_cdr}</span><span class="sum-val" style="color:var(--primary)">${fmt(totalCDR)}</span></div>
        <div class="sum-item"><span class="sum-label">${t.sum_loss}</span><span class="sum-val" style="color:var(--danger)">${fmt(totalLoss)}</span></div>
        <div class="sum-item"><span class="sum-label">${t.sum_profit}</span><span class="sum-val" style="color:var(--success)">${fmt(totalProfit)}</span></div>
    `;

    let htmlCards = "";
    let methodKey = 'opt_' + method;
    let methodName = t[methodKey] ? t[methodKey].toUpperCase() : method.toUpperCase();
    
    // --- REPORTS ---
    currentVisualReport = `✨ --- ${t.rep_title} ( ${methodName} ) --- ✨ ${t.rep_by}\n\n`;
    let cleanReport = `--- ${t.rep_title} (${method.toUpperCase()}) --- ${t.rep_by}\n\n`;

    players.forEach(p => {
        const netProfit = p.totalDue - p.totalLoss;
        const transportBalance = p.totalDue - p.harvestedValue;
        
        let balanceClass = transportBalance > 100 ? "status-rec" : (transportBalance < -100 ? "status-pay" : "status-even");
        let balanceLabel = transportBalance > 100 ? t.status_rec : (transportBalance < -100 ? t.status_pay : t.status_even);
        const weightStr = p.weightPercentage.toFixed(2) + "%";

        const gainM = p.dueM - p.lossM;
        const gainC = p.dueC - p.lossC;
        const gainD = p.dueD - p.lossD;

        const strGainM = (gainM > 0 ? '+' : '') + fmt(gainM);
        const strGainC = (gainC > 0 ? '+' : '') + fmt(gainC);
        const strGainD = (gainD > 0 ? '+' : '') + fmt(gainD);

        // --- CARDS HTML (RIPRISTINATO) ---
        htmlCards += `
        <div class="player-card">
            <div class="card-header">
                <span class="p-name">${p.name}</span>
                <span class="status-badge ${balanceClass}">${balanceLabel}</span>
            </div>
            <div class="card-body">
                <div class="data-row">
                    <span class="d-label">${t.card_fleet}</span>
                    <span class="d-val tooltip-container">
                        <i class="fas fa-info-circle info-icon"></i>${fmt(p.initialValue)}
                        ${getTooltipHTML(p.initialM, p.initialC, p.initialD)}
                    </span>
                </div>
                <div class="data-row">
                    <span class="d-label">${t.card_weight}</span>
                    <span class="d-val" style="color:var(--warning)">${weightStr}</span>
                </div>
                <div class="data-row">
                    <span class="d-label">${t.card_loss}</span>
                    <span class="d-val tooltip-container" style="color:var(--danger)">
                        <i class="fas fa-info-circle info-icon"></i>-${fmt(p.totalLoss)}
                        ${getTooltipHTML(p.lossM, p.lossC, p.lossD)}
                    </span>
                </div>
                <div class="res-breakdown">
                    <div class="res-breakdown-title">${t.card_harvest}</div>
                    <div class="res-row"><span class="c-met">M</span> <span class="c-met">${fmt(p.harvestedM)}</span></div>
                    <div class="res-row"><span class="c-crys">C</span> <span class="c-crys">${fmt(p.harvestedC)}</span></div>
                    <div class="res-row"><span class="c-deut">D</span> <span class="c-deut">${fmt(p.harvestedD)}</span></div>
                </div>
                <div class="res-breakdown">
                    <div class="res-breakdown-title">${t.card_due}</div>
                    <div class="res-row"><span class="c-met">M</span> <span class="c-met">${fmt(p.dueM)}</span></div>
                    <div class="res-row"><span class="c-crys">C</span> <span class="c-crys">${fmt(p.dueC)}</span></div>
                    <div class="res-row"><span class="c-deut">D</span> <span class="c-deut">${fmt(p.dueD)}</span></div>
                </div>
            </div>
            <div class="card-footer">
                <span class="bal-label">${t.card_bal}:</span><br>
                <span class="bal-val ${netProfit > 0 ? 'text-ok' : 'text-err'}">${netProfit > 0 ? '+' : ''}${fmt(netProfit)}</span>
            </div>
        </div>`;

        // VISUAL REPORT
        currentVisualReport += `👤 ${p.name} (${t.card_weight}: ${p.weightPercentage.toFixed(2)}%)\n`;
        if(p.harvestedValue > 0) currentVisualReport += `♻️ ${t.rep_harvest}: 🪨 ${fmt(p.harvestedM)} 💎 ${fmt(p.harvestedC)} ⛽ ${fmt(p.harvestedD)}\n`;
        else currentVisualReport += `♻️ ${t.rep_harvest}: ${t.rep_no_harvest}\n`;
        currentVisualReport += `📥 ${t.rep_spetta}: 🪨 ${fmt(p.dueM)} 💎 ${fmt(p.dueC)} ⛽ ${fmt(p.dueD)}\n`;
        currentVisualReport += `💰 ${t.rep_gain_det}: 🪨 ${strGainM} 💎 ${strGainC} ⛽ ${strGainD}\n`;
        currentVisualReport += `💵 TOTAL ${t.card_bal}: ${(p.totalDue-p.totalLoss)>0?'+':''}${fmt(p.totalDue-p.totalLoss)}\n\n`;

        // CLEAN REPORT
        cleanReport += `${p.name} (${t.card_weight}: ${p.weightPercentage.toFixed(2)}%)\n`;
        if(p.harvestedValue > 0) cleanReport += `${t.rep_harvest}: [${t.res_m}] ${fmt(p.harvestedM)} [${t.res_c}] ${fmt(p.harvestedC)} [${t.res_d}] ${fmt(p.harvestedD)}\n`;
        else cleanReport += `${t.rep_harvest}: ${t.rep_no_harvest}\n`;
        cleanReport += `${t.rep_spetta}: [${t.res_m}] ${fmt(p.dueM)} [${t.res_c}] ${fmt(p.dueC)} [${t.res_d}] ${fmt(p.dueD)}\n`;
        cleanReport += `${t.rep_gain_det}: [${t.res_m}] ${strGainM} [${t.res_c}] ${strGainC} [${t.res_d}] ${strGainD}\n`;
        cleanReport += `TOTAL ${t.card_bal}: ${(p.totalDue-p.totalLoss)>0?'+':''}${fmt(p.totalDue-p.totalLoss)}\n\n`;
    });

    cardsContainer.innerHTML = htmlCards;

    const transportData = generateTransportPlan(players, t);
    transportContainer.innerHTML = transportData.html;
    
    currentVisualReport += `\n--- ${t.rep_flight} ---\n${transportData.text}`;
    cleanReport += `\n--- ${t.rep_flight} ---\n${transportData.text}`;

    document.getElementById('copyText').innerText = currentVisualReport;
    document.getElementById('ticket-text').value = cleanReport;
}

function generateTransportPlan(players, t) {
    let html = "";
    let text = "";

    const solve = (resName, resKey, propHarvested, propDue, cssClass, iconClass) => {
        let senders = [], receivers = [];
        players.forEach(p => {
            const diff = p[propHarvested] - p[propDue];
            if (diff > 100) senders.push({ name: p.name, amount: diff });
            else if (diff < -100) receivers.push({ name: p.name, amount: -diff });
        });
        
        if (senders.length === 0) return { html: "", text: "" };

        const blockClass = (resKey === 'res_m') ? 'block-met' : (resKey === 'res_c') ? 'block-crys' : 'block-deut';

        let blockHTML = `<div class="transport-block ${blockClass}"><div class="trans-title"><i class="fas ${iconClass}"></i> ${resName}</div>`;
        let blockText = `\n[ ${resName.toUpperCase()} ]\n`;

        senders.forEach(sender => {
            while (sender.amount > 1) {
                if (receivers.length === 0) break;
                let receiver = receivers[0];
                let amt = Math.min(sender.amount, receiver.amount);
                
                blockHTML += `<div class="trade-route ${cssClass}"><span class="r-name">${sender.name}</span> <span class="r-arr">${t.trans_send}</span> <span class="r-amt">${fmt(amt)}</span> <span class="r-arr">${t.trans_to}</span> <span class="r-name">${receiver.name}</span></div>`;
                blockText += `> ${sender.name} ${t.trans_send} ${fmt(amt)} ${t.trans_to} ${receiver.name}\n`;

                sender.amount -= amt; receiver.amount -= amt;
                if (receiver.amount < 1) receivers.shift();
            }
        });
        
        blockHTML += "</div>";
        return { html: blockHTML, text: blockText };
    };

    const resM = solve(t.res_m, "res_m", "harvestedM", "dueM", "route-met", "fa-cube");
    const resC = solve(t.res_c, "res_c", "harvestedC", "dueC", "route-crys", "fa-gem");
    const resD = solve(t.res_d, "res_d", "harvestedD", "dueD", "route-deut", "fa-flask");

    html = resM.html + resC.html + resD.html;
    text = resM.text + resC.text + resD.text;

    if(html === "") {
        html = `<div class="transport-block" style="text-align:center; color:var(--success); border-color:var(--success); font-size: 1rem; padding: 15px;">${t.trans_none}</div>`;
        text = `\n${t.trans_none}\n`;
    }

    return { html, text };
}

function fmt(n) { return new Intl.NumberFormat('it-IT').format(Math.floor(n)); }

function copyToClipboard() {
    const text = document.getElementById('copyText').innerText;
    navigator.clipboard.writeText(text).then(() => alert("Report Copied!"));
}

function copyTicketReport() {
    const text = document.getElementById('ticket-text').value;
    navigator.clipboard.writeText(text).then(() => alert("Ticket Report Copied!"));
}

function shareWhatsapp() {
    const text = currentVisualReport; 
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

function shareTelegram() {
    const text = currentVisualReport;
    const toolUrl = window.location.href; 
    window.open(`https://t.me/share/url?url=${encodeURIComponent(toolUrl)}&text=${encodeURIComponent(text)}`, '_blank');
}
