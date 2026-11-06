# Verifiche della revisione 3.6.19

Base: versione 3.6.18 pubblicata nella repository SMV_V5. Recuperati tutti i 51 file e verificata la corrispondenza completa con lo ZIP precedentemente consegnato tramite SHA-256.

La modifica funzionale riguarda soltanto lo storico manutentivo nel PDF. Generatore Word, modulo generale di impaginazione, catalogo, immagini, stili, interfaccia e gestione dei dati sono identici alla 3.6.18. Aggiornati i metadati di versione, il bundle, la cache e la documentazione.

## PDF e Word

Generati due PDF con tre restauri e tre manutenzioni ciascuno, oltre a righe vuote da ignorare. Una prova contiene un'azione di restauro con 70 righe numerate e prosegue su più pagine. Verificato anche il layout della scheda priva di interventi.

- I titoli Interventi di RESTAURO precedenti e Interventi di MANUTENZIONE precedenti compaiono una sola volta ciascuno nell'intero PDF, anche nelle continuazioni.
- Tutti i sei pacchetti Data + Azione sono presenti, ordinati e separati da almeno una riga vuota. Data e inizio dell'azione rimangono sulla stessa pagina; i testi lunghi proseguono senza tagli o duplicazioni.
- Conservate tutte le 70 righe del testo lungo, una sola volta. Azione mantiene l'etichetta su una riga propria e il testo seguente allineato a sinistra.
- Le righe vuote non producono interventi; le categorie vuote non producono sottotitoli. La scheda vuota mantiene quattro pagine.
- Verificate le correzioni della 3.6.18: valore ID a 12 pt, etichetta a 9,5 pt, date delle intestazioni vuote quando manca la data iniziale e titolo dell'atlante vuoto dopo la sezione 5.
- I due PDF hanno rispettivamente cinque e sei pagine. Controllate visivamente tutte le 11 pagine e verificati anche testo del PDF effettivo e assenza di campi modulo trasparenti. Le esportazioni non modificano i dati della scheda.

Il generatore Word è stato confrontato byte per byte con la 3.6.18 ed è invariato. Non è stata apportata alcuna modifica alla sua impaginazione.

## Download e distribuzione

Superate le combinazioni JSON, PDF + JSON, DOCX + JSON e DOCX + PDF + JSON offline, su desktop e iPhone simulato, senza dispositivo fisico. Il JSON rimane obbligatorio e il DOCX nativo non richiede un PDF intermedio. Su iPhone più formati vengono raccolti in un solo ZIP.

Cache aggiornata dalla 3.6.18 alla 3.6.19 con 21 risorse, navigazione offline e isolamento dalle altre app. Bundle e sorgenti JavaScript verificati.

51 file pronti per la radice GitHub, inclusi mappa e catalogo. Esclusi documenti e JSON di prova, vecchi template e node_modules. ZIP verificato con CRC, unzip -t ed estrazione e confronto di tutti i file. Nessuna pubblicazione o modifica automatica della repository.
