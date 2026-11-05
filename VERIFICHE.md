# Verifiche della revisione 3.6.17

Base: checkpoint completo della 3.6.16. Cambiati soltanto i generatori Word/PDF, i metadati di versione, il bundle, la cache e la documentazione. Catalogo, immagini, stili, interfaccia e gestione dei dati conservati byte per byte.

## Word e PDF

Generati quattro Word e quattro PDF: scheda vuota, scheda con storico manutentivo e diagnostica, scheda con cinque fotografie e scheda con un'azione di restauro di 85 righe. Controllate visivamente tutte le 40 pagine risultanti e validato l'XML dei Word.

- Azione è su una riga propria, in grassetto; il testo seguente è allineato a sinistra, senza rientri, per restauro e manutenzione. Conservati a capo e tutte le 85 righe del testo lungo, senza tagli o duplicazioni. Il titolo dello storico rimane con l'inizio del suo contenuto.
- Nella scheda vuota Word e PDF passano da cinque a quattro pagine: titoli 5 e 6 sulla seconda pagina, con un paragrafo di separazione nel Word e la corrispondente spaziatura nel PDF.
- Quando la sezione 5 contiene dati, il titolo dell'atlante vuoto compare dopo la diagnostica e le priorità. Le note generali restano nel riquadro a fondo pagina, sotto il titolo 6.
- Con cinque fotografie, sei pagine complessive in entrambi i formati: atlante su nuove pagine, quattro foto nella prima e una nella seconda, con intestazione ripetuta. Verificato che anche le fotografie storicizzate rendono l'atlante non vuoto.
- Nessun campo modulo PDF trasparente. Le esportazioni non modificano i dati della scheda.

Word renderizzato con LibreOffice; Microsoft Word per Mac non è disponibile in questo ambiente. I test dell'interfaccia e di iPhone sono simulati, senza dispositivo fisico.

## Download e distribuzione

Superate le combinazioni JSON, PDF + JSON, DOCX + JSON e DOCX + PDF + JSON offline, su desktop e iPhone simulato. Il JSON rimane obbligatorio, il DOCX nativo non richiede un PDF intermedio. Su iPhone più formati vengono raccolti in un solo ZIP.

Cache aggiornata dalla 3.6.16 alla 3.6.17 con 21 risorse, navigazione offline, bozza conservata e isolamento dalle altre app. Bundle e sorgenti JavaScript verificati.

51 file pronti per la radice GitHub, inclusi mappa e catalogo. Esclusi Word, PDF e JSON di prova, vecchi template e node_modules. ZIP verificato con CRC, unzip -t ed estrazione e confronto di tutti i file. Nessuna pubblicazione o modifica automatica della repository.
