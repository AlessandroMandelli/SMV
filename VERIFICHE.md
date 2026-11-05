# Verifiche della revisione 3.6.18

Base: checkpoint completo della 3.6.17. Cambiati soltanto i generatori Word/PDF e il relativo modulo di impaginazione, i metadati di versione, il bundle, la cache e la documentazione. Catalogo, immagini, stili, interfaccia e gestione dei dati conservati byte per byte.

## Word e PDF

Generati quattro Word e quattro PDF: date delle sezioni compilate con valori distinti, data iniziale cancellata, data reinserita dopo la cancellazione e ID lungo con data iniziale vuota. Controllate tutte le 32 pagine renderizzate e validato l'XML dei Word.

- Il valore dell'ID è a 12 pt nelle tre intestazioni; ID Scheda rimane a 9,5 pt e in grassetto. Verificati i 24 mezzi punti nell'XML Word e i 12 punti nel PDF effettivo. Conservati i grassetti del valore e l'allineamento sulla linea di base nel PDF.
- La cancellazione della data iniziale, anche dopo esportazione e riapertura del JSON, lascia vuote le date delle tre intestazioni. Le etichette Data mantengono dimensione e posizione previste.
- Quando la data iniziale è presente o viene reinserita, manutenzione immediata e azioni preventive conservano le proprie date, anche se diverse dalla prima scheda. Le esportazioni non modificano i valori memorizzati.
- Date dei rilievi, di risoluzione, degli interventi eseguiti e della programmazione conservate sia con data iniziale compilata sia vuota.
- ID lungo a capo nei riquadri senza tagli o riduzione sotto 12 pt. Quattro pagine per ciascun esempio nei due formati, senza nuove pagine dovute alla modifica.
- Conservate le modifiche della 3.6.17: testo dello storico sotto Azione, titolo dell'atlante vuoto dopo la diagnostica senza pagina dedicata. Nessun campo modulo PDF trasparente.

Word renderizzato con LibreOffice; Microsoft Word per Mac non è disponibile in questo ambiente. I test di iPhone sono simulati, senza dispositivo fisico.

## Download e distribuzione

Superate le combinazioni JSON, PDF + JSON, DOCX + JSON e DOCX + PDF + JSON offline, su desktop e iPhone simulato. Il JSON rimane obbligatorio, il DOCX nativo non richiede un PDF intermedio. Su iPhone più formati vengono raccolti in un solo ZIP.

Cache aggiornata dalla 3.6.17 alla 3.6.18 con 21 risorse, navigazione offline, bozza conservata e isolamento dalle altre app. Bundle e sorgenti JavaScript verificati.

51 file pronti per la radice GitHub, inclusi mappa e catalogo. Esclusi Word, PDF e JSON di prova, vecchi template e node_modules. ZIP verificato con CRC, unzip -t ed estrazione e confronto di tutti i file. Nessuna pubblicazione o modifica automatica della repository.
