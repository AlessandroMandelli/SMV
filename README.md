# Schede Restauro 3.4.1

PWA per la schedatura del Sacro Monte di Varese. Versione del 29 ottobre 2026.

## Pubblicazione su GitHub Pages

1. Estrai lo ZIP e copia tutto il contenuto nella radice della repository, sostituendo i file della versione precedente.
   Se aggiorni la repository già pubblicata, elimina anche i due file rimossi dal pacchetto: `assets/pdf-template.pdf` e `vendor/README-fontkit.md`. La semplice sovrascrittura dei file nuovi non elimina quelli vecchi.
2. Pubblica il branch utilizzato con GitHub Pages, cartella `/ (root)`.
3. Attendi il completamento della pubblicazione e riapri la PWA. La cache viene aggiornata alla versione 3.4.1.

Il pacchetto funziona già compilato. Per pubblicarlo non servono Node, npm, server applicativi o chiavi API. Mantieni integralmente le cartelle `assets`, `js` e `vendor` e il file `app.bundle.js`. Non cancellare i dati del browser per aggiornare: contengono la bozza.

## PDF

Il PDF viene disegnato direttamente con testo, tabelle, riquadri e checkbox nativi. Non vengono incorporate o mascherate intere pagine del vecchio modello e non vengono utilizzati sfondi a tutta pagina. Etichette e valori rimangono testo selezionabile e modificabile.

- Formato orizzontale 792 × 612 punti, come il Word; margini laterali comuni di 28,8 punti, pari a 10,16 mm.
- Arial incorporato, con un font compatibile di riserva per i caratteri assenti nel font originale. Testi compilati a 9,5 punti, titoli e grassetti secondo la gerarchia del modello. Loghi estratti dalle immagini originali del Word.
- Loghi, intestazione completa, ID scheda, data, operatori e recapiti compaiono solo nella prima pagina della scheda e nelle prime pagine di manutenzione immediata e azioni preventive. Le continuazioni non ripetono questi blocchi né i titoli delle sezioni. La numerazione `1/n` resta su ogni pagina. La prima pagina conserva planimetria e struttura specifica.
- Prima pagina sempre presente, con tutte le etichette dell'anagrafica. Soggetto e Materie e Tecniche multilinea; i contenuti successivi scorrono senza sovrapposizioni.
- Titoli delle sezioni 3, 4 e 5 sempre presenti, anche quando vuote. I gruppi e le righe non compilati vengono omessi.
- Storico: titolo dell'intervento, data libera e azione vengono mantenuti insieme quando entrano in una pagina. I testi più lunghi proseguono immediatamente nella pagina seguente, prima delle altre sezioni.
- Tabelle ad altezza variabile, senza riempimenti di righe vuote. Le righe che entrano in una pagina restano intere; una riga più alta dell'intera pagina continua sempre nelle celle della tabella, con intestazione ripetuta.
- L'indice di priorità segue la diagnostica sulla stessa pagina, se c'è spazio, oppure nella successiva. Le priorità vuote non vengono stampate.
- Con urgenza ALTO, le tempistiche sono Monitoraggio, Immediato, 3 mesi e 6 mesi. Negli altri casi rimangono le opzioni già concordate.
- Atlante vuoto: solo il titolo, dopo i contenuti precedenti quando c'è spazio. Con immagini: massimo quattro per pagina, proporzioni conservate e nessuna didascalia aggiunta. Il titolo appare soltanto all'inizio dell'atlante.
- Intestazioni, dati fissi e titoli Interventi eseguiti / Azioni preventive restano presenti. Campi, checkbox e note opzionali compaiono solo con dati.
- Gli interventi eseguiti scorrono uno dopo l'altro, anche quando hanno date diverse; un salto pagina avviene solo per spazio insufficiente. Ogni voce resta insieme quando entra in una pagina. Le date dei singoli interventi risolti sono riportate accanto alla rispettiva voce, senza riportare Eseguiti in data accanto al logo.
- Le righe risolte passano alla manutenzione immediata con Macro-Area e data collegate; Azioni condotte in loco resta libera. Le righe risolte sono escluse dalla prevenzione.
- Data e Ora sono etichette in grassetto nelle intestazioni. Anche Data e Azione nello storico sono in grassetto; i titoli e i campi dello storico condividono lo stesso margine sinistro. Gli indirizzi email e PEC mantengono il colore degli altri testi.
- Il campo comune Eseguiti in data non compare nella compilazione del registro né nell'intestazione del PDF. Restano le date dei singoli interventi provenienti dalla diagnostica. Le date dello storico sono testo libero.

Il pacchetto di distribuzione non contiene il JSON di prova. I file JSON necessari al funzionamento dell'app restano inclusi.

## Compilazione, bozza e file

La PWA comprende: 14 cappelle, tre archi e Strada; Soggetto multilinea, date storiche libere, tabelle e gruppi ripetibili, fotografie da fotocamera o caricamento, importazione/esportazione JSON e bozza locale.

Selezionando Strada, il tracciato rosso viene sovrapposto alla planimetria sotto i 17 checkbox, anche nel PDF. I nomi dei file distinguono Strada, cappelle e archi.

I JSON precedenti e la bozza conservano lo stesso schema dati. Le date vengono inizializzate alla creazione della scheda e non aggiornate riprendendo la bozza. I numeri usano virgola decimale e punto delle migliaia; le misure aggiungono m.

Gli operatori e i dati societari rimangono nel PDF e nei dati comuni, senza essere mostrati nei blocchi fissi della compilazione. L'anagrafica dei singoli beni rimane modificabile salvo i campi dichiarati in `fixed` nel catalogo.

## Salvataggio DOCX PDF e JSON

Il pulsante finale **Salva scheda** apre un box con DOCX, PDF e JSON già selezionati, in colonna. Scegli i formati e premi **Salva**. Senza formati selezionati il pulsante è disattivato; la chiusura del box non esporta file.

Vengono generati soltanto i formati selezionati. Su desktop vengono scaricati singolarmente. Su iPhone/iPad un formato viene scaricato direttamente; due o tre formati vengono raccolti in un unico ZIP. I collegamenti dei file preparati restano disponibili per ripetere un download se il browser lo richiede. Una modifica alla scheda invalida i file già preparati.

Il DOCX contiene testi e tabelle Word modificabili, loghi, planimetria con la selezione del bene, tracciato Strada e fotografie fino a quattro per pagina. Il documento usa Arial e mantiene la gerarchia del modello, le etichette fisse e i collegamenti fra diagnostica, manutenzione e prevenzione. Le righe vuote sono omesse. La planimetria è un'immagine composta; i campi e le tabelle restano nativi Word.

Word e LibreOffice impaginano autonomamente il DOCX: la disposizione e il numero di pagine possono differire dal PDF. Il PDF conserva l'impaginazione già concordata e rimane il riferimento per la stampa. Le modifiche manuali nel Word non aggiornano il JSON.

## Menu Opzioni

Il menu contiene **Reset scheda**, **Info**, un separatore grigio rientrato e **Installa app**. Il reset conferma la cancellazione della bozza e riporta alla home.

**Info** mostra `https://alessandromandelli.github.io/SMV/` su una sola riga e, sotto, la versione nel formato **V.3.4.1**. La versione è ricavata da `package.json` durante la build.

La voce di installazione e il suo separatore sono nascosti quando l'app è aperta come PWA, dopo l'evento di installazione e quando il browser riconosce l'installazione tramite la propria API. Su Safari/iOS una pagina aperta nel browser non può sempre rilevare una PWA già presente sulla Home; nell'app aperta dalla Home la voce è nascosta.

## Installazione e uso offline

La PWA deve essere pubblicata via HTTPS, come su GitHub Pages. Installa app utilizza il prompt nativo quando il browser lo mette a disposizione; negli altri casi mostra le istruzioni appropriate. Su iPhone/iPad l'installazione avviene dal menu Condividi con Aggiungi alla schermata Home.

Tutte le risorse sono locali. Al primo accesso con connessione il service worker prepara la cache delle sole risorse necessarie all'app. I sorgenti di sviluppo e la documentazione non vengono duplicati nella cache. L'attivazione della nuova versione elimina le cache precedenti della sola PWA, compreso il vecchio template, senza cancellare le bozze. La bozza resta sul dispositivo e nel profilo browser utilizzato: esporta il JSON per conservarla o trasferirla.

## Modifica del codice

- `js/docx.js`: generazione DOCX nativa, tabelle, fotografie e planimetria.
- `js/export.js`: download selettivi e pacchetti iPhone.
- `js/zip.js`: caricamento locale della libreria ZIP condivisa.
- `js/config.js`: versione e indirizzo pubblico, generati dalla build.
- `js/pdf-layout.js`: formato, margini, font, marchi, intestazioni, primitive e impaginazione di paragrafi e tabelle.
- `js/pdf.js`: contenuti e sequenza delle sezioni della scheda.
- `assets/branding`: immagini originali dei marchi estratte dal Word.
- `js/road.js`: tracciato condiviso fra la mappa web e il PDF.
- `assets/beni.json`: catalogo dei beni e futura anagrafica fissa.

Il modello Word concordato è il riferimento grafico. PDF e DOCX vengono generati direttamente dai rispettivi moduli JavaScript, senza template PDF esterni. Le modifiche all'impaginazione si effettuano nei generatori.

Dopo una modifica ai sorgenti, esegui `npm install` e `npm run build`. Se aggiungi una risorsa necessaria offline, inseriscila nell'elenco esplicito di `tools/build.mjs`. Pubblica anche il bundle e il service worker rigenerati. L'utente che compila le schede non deve installare questi strumenti.
