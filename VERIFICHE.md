# Verifiche della revisione 3.6.23

Base: archivio dell'ultima consegna 3.6.22, 2.706.391 byte, SHA-256 `6bdebbe19db608eb566936c734da1f6a692c5b6c48a00c81be1f918643575169`. Verificati CRC e corrispondenza dei 50 file con la copia di lavoro prima delle modifiche.

## Modifiche

- Cerca aggiornamenti nelle opzioni della home e della compilazione, sotto il separatore e prima di Installa app. Il comando e il separatore restano visibili anche con l'app già installata.
- Controllo manuale della pubblicazione con aggiornamento del service worker, attesa del download completo, dell'attivazione e del passaggio di controllo della pagina.
- Risposta del service worker con la propria versione: riconosciuto anche il caso di cache già aggiornata con pagina ancora aperta sulla vecchia versione.
- Conferma del salvataggio della bozza prima della ricerca e prima della ricarica. Durante l'operazione i campi restano protetti; in caso di errore si ripristinano i blocchi originali.
- Ritorno alla home o alla stessa sezione della scheda tramite un'indicazione temporanea della sessione, senza aggiungere dati al JSON o iniziare un nuovo sopralluogo.

## Verifiche automatiche

Superate 45 prove:

- **15 sul controllo aggiornamenti:** versione attuale, pagina vecchia e cache nuova, attesa delle diverse fasi, installazione già in corso, download fallito, errore di rete con nuovo tentativo, assenza di connessione, file locale e browser non supportato, timeout e rimozione dei listener, risposte non valide, ripristino della vista e isolamento fra percorsi della PWA.
- **8 sull'interfaccia e sulla bozza:** posizione e testo dei menu, home già aggiornata, home offline, ritorno alla home dopo un aggiornamento, ripresa della compilazione nella stessa sezione, conservazione di fotografie/date/storico/nome personalizzato, blocco del doppio clic e ripristino dei campi dopo un errore, salvataggio locale fallito senza ricarica. Un secondo caricamento del bundle simula la nuova versione e usa lo stesso IndexedDB e la stessa sessione: la scheda ripresa coincide con quella salvata.
- **10 sull'installazione:** browser normale, tutto schermo, finestra installata, overlay, modalità iOS simulata, applicazioni correlate, evento di installazione, storage di sessione non disponibile e listener precedenti. Cerca aggiornamenti e i separatori rimangono visibili mentre Installa app scompare nei casi previsti.
- **2 sulla cache:** venti risorse complete e navigazione offline, risposta con la versione, pulizia della sola cache precedente; un download interrotto conserva la cache funzionante e permette un tentativo successivo completo.
- **10 sull'esportazione:** cinque combinazioni su desktop simulato e cinque su iPhone simulato, con risorse offline. JSON obbligatorio, JSON singolo diretto e ZIP per più formati; verificati contenuti e nomi dei file. Nessun PDF intermedio per generare il DOCX.

I controlli della pagina usano Happy DOM e IndexedDB simulato; eventi e messaggi del service worker sono simulati. Non è stata eseguita una prova nativa in browser grafico o su iPhone fisico. La verifica precedente del footer Word resta valida: generatori Word/PDF e asset sono identici per byte alla 3.6.22, come gli stili dell'interfaccia. Non sono state apportate modifiche all'impaginazione dei documenti.

## Distribuzione

Versione coerente fra package, configurazione, bundle, riferimenti HTML e cache. Un solo nuovo modulo sorgente, già incluso nel bundle: 51 file nello ZIP e 20 risorse nella cache. Conservati catalogo, mappa, tracciato, fotografie, dati dei beni e logica dei sopralluoghi.

Controllati sintassi JavaScript, identificativi HTML, riferimenti dei pulsanti e delle risorse, CRC dello ZIP, `unzip -t`, estrazione e corrispondenza dei file con i sorgenti finali. Esclusi documenti e JSON di prova, node_modules, vecchi template e filigrane. Nessuna modifica o pubblicazione della repository GitHub.
