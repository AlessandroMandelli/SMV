# Schede Restauro 3.6.16

PWA per il Sacro Monte di Varese, utilizzabile offline su desktop e telefono. Esporta PDF, Word modificabile e JSON. Lo ZIP contiene il sito già compilato, pronto per GitHub Pages senza npm o un server applicativo.

## Novità della revisione

- Inserita l'anagrafica dei 23 beni dal file DATI_SMV(1).docx e completata la Terza Fontana secondo le indicazioni dell'utente. Tutti i 24 beni hanno un ID univoco: da 02.01_2026 a 02.24_2026.
- Le nuove schede precompilano Oggetto, ID, Cronologia, Quota e Distanza dal Santuario dove forniti. I campi partono bloccati e si sbloccano con il lucchetto della prima pagina. Per Acquedotto e Viale non sono state inventate quote o distanze.
- Nei campi e nei documenti si conservano le maiuscole del Word. Oggetto e ID sono in grassetto; i valori di cronologia, quota e distanza sono normali. Distanze e quote mantengono il separatore italiano delle migliaia e l'unità di misura.
- La scelta del bene dalla home usa le nuove denominazioni con l'attuale uso di maiuscole e minuscole. Confermate Seconda Fontana, Arco di San Carlo e Terza Fontana, Arco di Sant’Ambrogio.
- La Terza Fontana ha ID 02.24_2026, cronologia XVII secolo, quota 724 m e distanza dal Santuario 938 m.
- Aprire il lucchetto permette di correggere anche i dati forniti dal catalogo. Le correzioni, comprese le cancellazioni di un valore, rimangono dopo salvataggio, ripresa e importazione JSON; non vengono sostituite dai valori iniziali. Nei JSON precedenti si conservano i dati presenti, compresi quelli vuoti; vengono inizializzati soltanto i campi mancanti. Cambiare bene dalla mappa a lucchetto aperto aggiorna i relativi dati anagrafici.

La base è la 3.6.15 pubblicata nella repository SMV_V5, recuperata prima delle modifiche. Conservati i checkbox separati di Grotta e VI Cappella, le altre coordinate, il tracciato del Viale, i nomi dei file con data e ora, le note sotto al titolo, la colonna Risolto in data e la gestione delle versioni delle azioni preventive. Non vengono eliminati automaticamente i gruppi di azioni ripetuti.

## Pubblicazione

Estrai lo ZIP e carica tutti i file e le cartelle nella radice della repository, sostituendo quelli della versione precedente. `index.html`, `styles.css`, `app.bundle.js`, `sw.js` e `manifest.webmanifest` devono trovarsi accanto alle cartelle `assets`, `js`, `vendor` e `tools`. Non caricare lo ZIP senza estrarlo. Attendi il completamento di GitHub Pages e riapri l'app. La cache 3.6.16 sostituisce quella precedente senza cancellare la bozza; una scheda in compilazione non viene ricaricata forzatamente.

## Home e compilazione

- **Compila una nuova scheda** avvia la prima ispezione.
- **Carica e aggiorna stato conservativo** importa l'ultimo JSON e avvia un nuovo sopralluogo. La data della visita è conservata nello storico; le note delle visite già esistenti nei vecchi JSON sono mantenute. Il nome del file assume la data e l'ora del caricamento secondo la nomenclatura indicata sopra; la data originaria della scheda e gli stati precedenti restano disponibili. Il file importato resta intatto.
- **Riprendi la compilazione** riapre la bozza sullo stesso dispositivo e profilo browser, senza iniziare una visita o aggiornare le date.

Storico manutentivo e stato conservativo hanno schermate distinte. I titoli superiori duplicati e i campi ID/data/oggetto delle sezioni finali non occupano spazio nella compilazione; le corrispondenti intestazioni rimangono nei documenti. Tra nome file e Opzioni si trovano il lucchetto e l'icona cronologia. La cronologia mostra soltanto le versioni precedenti della pagina corrente.

Salva scheda registra lo stato corrente. Non sono necessari pulsanti separati Nuovo sopralluogo o Registra aggiornamento nell'editor. La bozza locale si salva durante la compilazione. L'Info conserva il collegamento SMV approvato; i percorsi tecnici sono relativi e funzionano anche sotto SMV_V5. Installa app scompare quando l'installazione viene rilevata.

## Blocchi e correzioni definitive

Nella nuova scheda Materie e tecniche è direttamente compilabile. Dopo l'importazione del JSON è bloccato insieme agli altri dati precedenti della prima pagina. Oggetto, ID, Cronologia e gli altri campi forniti dal catalogo, oltre a Complesso ed Ente proprietario, partono protetti anche nella nuova scheda. Il lucchetto della prima pagina permette di correggerli.

- Il lucchetto agisce soltanto sulla pagina visualizzata. Un secondo clic ripristina i blocchi; le altre pagine conservano il proprio stato.
- Dopo un'importazione sono protetti gli interventi pregressi, gli stati conservativi, la diagnostica precedente salvo Risolto in data, le priorità, gli interventi eseguiti, le azioni preventive e le fotografie storicizzate. Le nuove voci restano compilabili.
- Aprire il lucchetto permette correzioni e rimozioni definitive. La stessa voce viene aggiornata o eliminata anche nelle copie storiche, usando il suo identificativo. Il JSON finale non conserva il contenuto errato o gli elementi eliminati. Le immagini eliminate vengono rimosse anche dall'archivio interno quando non hanno più riferimenti.
- I normali aggiornamenti a lucchetto chiuso conservano la storia reale: risolvere oggi un degrado non risolve le visite anteriori. Correggere invece una data già registrata modifica le copie che la riportavano.
- I permessi di sblocco non sono esportati nel JSON. Tornando alla home, creando o importando una scheda e riaprendo l'app vengono ripristinate le protezioni previste.

## Collegamenti con la diagnostica

Le nuove priorità e le azioni preventive sono collegate al degrado tramite identificativo stabile. Il grado d'urgenza eredita il Livello di rischio ed è sempre bloccato, anche a lucchetto aperto: si corregge il rischio nella riga diagnostica. Una finestra d'intervento divenuta incompatibile viene cancellata per permettere una nuova scelta. Non compare Azzera scelta.

Risolto in data genera automaticamente la voce negli interventi eseguiti. Per la visita corrente le azioni condotte in loco sono compilabili; per gli interventi chiusi sono protette. Non c'è un comando per aggiungere manualmente nuovi interventi eseguiti. Gli interventi manuali dei vecchi JSON e le vecchie priorità senza collegamento rimangono disponibili, senza attribuire loro un degrado arbitrario.

Il degrado risolto che era aperto in un sopralluogo precedente mantiene la programmazione originaria: nell'editor la riga della tabella è verde chiaro e contiene la data di risoluzione. Il piano precedente si consulta dall'icona cronologia, senza un riquadro o una tendina aggiuntivi sotto la tabella. Nei documenti il piano viene riportato per intero con la data originaria e la data di risoluzione nell'ultima colonna della tabella, la cui riga è verde chiaro. Le voci inserite e risolte nella loro prima visita restano soltanto negli interventi eseguiti.

## Fotografie e salvataggio

Scatta foto e Carica foto registrano la data locale di inserimento, distinta dalla data dello scatto. Ogni foto ha una didascalia facoltativa multilinea, allineata a sinistra in Arial 9,5 sotto l'immagine. Nei documenti con più sopralluoghi è indicata anche la visita di riferimento. I JSON precedenti senza metadati usano la data e la didascalia disponibili.

L'atlante inizia sempre su una nuova pagina, contiene fino a quattro fotografie per pagina e ripete l'intestazione sulle continuazioni, sia nel PDF sia nel Word. Didascalie particolarmente lunghe possono richiedere altre pagine. Le didascalie delle visite chiuse sono conservate separatamente dall'immagine; correggerle a lucchetto aperto aggiorna anche le copie precedenti della stessa fotografia.

Salva scheda include sempre il JSON e permette di aggiungere DOCX e PDF. Il JSON non può essere deselezionato. Su iPhone il solo JSON viene scaricato direttamente; più formati sono raccolti in un unico ZIP. Su desktop vengono scaricati separatamente. Il JSON conserva i dati e lo storico necessari per il sopralluogo successivo.

Le finestre in sovraimpressione si chiudono con la × oppure con un clic o tocco esterno. Durante importazioni e salvataggi in corso resta la protezione contro la chiusura accidentale.

## Documenti

Il PDF mantiene la propria impaginazione. Le tabelle contengono soltanto righe effettivamente compilate, senza riempimenti vuoti; non vengono creati campi di modulo trasparenti. I loghi e le intestazioni principali compaiono una volta per sezione, con intestazione dell'atlante ripetuta sulle pagine fotografiche.

Il Word usa tabelle native e immagini in linea: mappa e titoli non dipendono da caselle sovrapposte. Le note hanno un riquadro a fondo pagina, i ruoli sono incolonnati e Stato rimane nella colonna accanto. Gli elenchi usano la numerazione Word; non c'è un pallino davanti a Tecnico manutentore. I testi usano tabulazioni invece di sequenze di spazi per l'allineamento.

Il Word rimane modificabile e scorre con il contenuto: numero di pagine e interruzioni possono differire dal PDF e dall'applicazione usata per aprirlo. Il controllo visivo della revisione usa LibreOffice; la resa nativa in Microsoft Word per Mac resta da confermare. I dati vengono preparati in comune, mentre i due formati hanno generatori distinti. Richiedere soltanto il DOCX non crea un PDF intermedio.

## Manutenzione del codice

I sorgenti leggibili sono in `js/`; per ricompilarli eseguire `npm ci` e `npm run build`. Il sito distribuito funziona senza questi comandi. `assets/beni.json` contiene l'anagrafica, i valori iniziali `fixed`, i campi in grassetto `boldFields` e il campo `fileLabel` per la parte del nome relativa a ciascun bene, `assets/map.jpg` la planimetria e `js/road.js` il tracciato sovrapposto del Viale. Il catalogo contiene le nuove coordinate delle cappelle, delle grotte, degli archi e delle fontane. Non viene utilizzato un vecchio template PDF.

`js/corrections.js` applica le correzioni definitive, `js/surveys.js` gestisce sopralluoghi e collegamenti, `js/pdf.js` e `js/docx.js` generano i documenti. Le note scritte manualmente restano testi autonomi: eventuali riferimenti da correggere vanno modificati nel relativo campo.

I nuovi JSON mantengono lo schema 2 e importano gli schemi 1 e 2. Lo ZIP del sito non contiene JSON o documenti di prova, vecchi template o `node_modules`. Non comprende integrazioni Nextcloud o applicazioni native.
