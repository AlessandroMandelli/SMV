# Verifiche della revisione 3.6.16

Base: 3.6.15 pubblicata nella repository SMV_V5, recuperata e verificata prima di applicare le modifiche.

## Catalogo e interfaccia

Confrontati tutti i valori e i grassetti dei 23 beni del Word DATI_SMV(1).docx con il catalogo. Aggiunti i dati concordati della Terza Fontana: ID 02.24_2026, XVII secolo, quota 724 m, distanza 938 m. Verificati i 24 ID senza duplicati o salti. Conservati tutti gli identificativi tecnici, fileLabel, categorie e coordinate della 3.6.15.

Provate tutte le 24 nuove schede con Happy DOM e IndexedDB simulato: dati corretti, nomenclature nella scelta degli oggetti, Oggetto e ID in grassetto, campi forniti protetti e sbloccabili con il lucchetto. Verificata la protezione contro modifiche ai controlli senza sblocco.

Provati salvataggio e importazione JSON dopo la correzione dei campi forniti e dopo la cancellazione di un valore. Le modifiche rimangono nelle versioni storiche e nei metadati dell'anagrafica; il catalogo non ripristina valori corretti o cancellati. Verificato il cambio di bene dalla mappa e il conseguente aggiornamento di ID e dati fissi. I JSON precedenti conservano valori e campi intenzionalmente vuoti; i soli campi assenti possono essere inizializzati.

Superata la regressione su Materie e tecniche, blocchi di pagina, correzioni definitive e successive importazioni. Conservato lo schema JSON 2 e l'importazione degli schemi 1 e 2.

## Word e PDF

Generati tre Word e tre PDF: I Cappella, Terza Fontana e Acquedotto, cinque pagine per documento. Controllati i 30 rendering e l'XML Word: maiuscole, apostrofi, accenti, ID e Oggetto in grassetto nelle tre intestazioni, altri valori in carattere normale. Nessun campo modulo PDF trasparente. Le esportazioni non modificano i dati della scheda.

Word controllato con LibreOffice; Microsoft Word per Mac non è disponibile in questo ambiente. I test dell'interfaccia e di iPhone sono simulati, senza dispositivo fisico.

## Download e distribuzione

Superate le combinazioni JSON, PDF + JSON, DOCX + JSON e DOCX + PDF + JSON offline, su desktop e iPhone simulato. Il JSON rimane obbligatorio, il DOCX nativo non richiede un PDF intermedio.

Cache aggiornata dalla 3.6.15 alla 3.6.16 con 21 risorse, bozza conservata e isolamento dalle altre app. Bundle e sorgenti JavaScript verificati.

51 file pronti per la radice GitHub, inclusi mappa e catalogo. Esclusi Word, PDF e JSON di prova, vecchi template e node_modules. ZIP verificato con CRC, unzip -t ed estrazione e confronto di tutti i file. Nessuna pubblicazione o modifica automatica della repository.
