# Verifiche della revisione 3.6.20

Base: ultima versione 3.6.19 consegnata. Recuperati i 51 file e ricostruito l'archivio precedente, verificando l'identica corrispondenza SHA-256: `0f05fada0e8184b3409e434e36262455d57255ca525f85b705910fa2182d0a10`. La repository pubblica consultabile al momento del controllo conteneva una versione precedente e non è stata usata come base.

## Nomi, priorità e sopralluoghi

- Verificati i nomi automatici di tutti i 24 beni, con oggetto iniziale, ID, tipo di documento e data finale senza ora. Verificati ID lunghi, caratteri non ammessi, nome personalizzato, vecchi nomi automatici e importazione JSON. Catalogo, ID assegnati e mappa restano invariati.
- Rimozione della sola priorità su nuova scheda e su scheda importata: conservati diagnosi, livello di rischio, azioni preventive, date di programmazione e interventi eseguiti. La priorità non ricompare dopo il salvataggio, la riapertura o l'avvio di un sopralluogo successivo.
- Verificati tre sopralluoghi consecutivi, rimozione correttiva dalle copie storiche e protezioni del lucchetto. Coperti anche dati pregressi con identificativi diversi per priorità collegate allo stesso degrado. La cancellazione esplicita della diagnostica mantiene la rimozione delle voci collegate.
- Eseguito il percorso dell'interfaccia: nuova scheda, inserimento diagnostica, rimozione priorità, caricamento e scatto foto, esportazione JSON, reimportazione, risoluzione e correzione con lucchetto. Conservati i blocchi anagrafici e le funzioni del catalogo per tutti i 24 beni.

## Fotografie

Prove con codifica e decodifica reali di immagini e controlli sul peso binario, usando adattatori per le API del browser:

- JPEG da 16.717.967 byte ridotto a 1.728.328 byte, 2.400 × 1.800 pixel.
- PNG da 19.175.561 byte convertito in JPEG da 1.912.240 byte, 2.400 × 1.867 pixel.
- JPEG da 448.401 byte e PNG da 948.024 byte conservati byte per byte.
- WebP convertito in JPEG compatibile con i documenti; JPEG con orientamento EXIF normalizzato con corretto scambio di larghezza e altezza.
- Verificati l'ulteriore ridimensionamento quando le prime compressioni superano il limite, l'encoder senza risultato, i file non leggibili e il rilascio delle risorse anche in errore.
- Provati entrambi i comandi Scatta foto e Carica foto. I file originali non vengono modificati. Le foto già contenute nei JSON importati non vengono ricompresse.

## Word e PDF

Generatori Word, PDF e modulo di impaginazione confrontati byte per byte con la 3.6.19: nessuna modifica. Generati una scheda Word e un PDF con cinque fotografie elaborate, due restauri, due manutenzioni, diagnosi conservata dopo la rimozione della priorità, azione preventiva storicizzata e intervento eseguito.

- Sei pagine per ciascun formato; controllate visivamente tutte le 12 pagine, comprese le due pagine fotografiche con distribuzione 4 + 1 e intestazione ripetuta.
- Confermati mappa e loghi, tabelle native del Word, ID a 12 pt, titoli dello storico manutentivo una sola volta per categoria, riquadro delle note, didascalie multilinea e date di risoluzione in grassetto.
- La priorità eliminata non compare nei documenti, mentre diagnosi, azione preventiva e intervento rimangono presenti. Nessun campo modulo PDF trasparente. Tutte le parti XML del DOCX sono valide; le immagini elaborate sono entro 2.000.000 byte ciascuna.
- Le esportazioni non modificano lo stato della scheda. La resa Word è stata controllata con LibreOffice, non con Microsoft Word per Mac.

## Download e distribuzione

Superate le combinazioni JSON, PDF + JSON, DOCX + JSON e DOCX + PDF + JSON offline, su desktop e iPhone simulato. Controllati anche i nomi effettivi dei download e dei file dentro lo ZIP. Il JSON rimane obbligatorio; il DOCX non richiede un PDF intermedio. Più formati su iPhone producono un unico ZIP; su desktop restano separati.

Verificati aggiornamento della cache dalla 3.6.19 alla 3.6.20, navigazione offline, isolamento dalle altre app e 20 risorse in cache. L'immagine di filigrana non è più referenziata né distribuita; il relativo elemento e gli stili desktop e mobile sono rimossi. Nessun logo del Sacro Monte aggiunto.

Controllati sintassi JavaScript, identificativi HTML, bundle e versione. Archivio con 50 file, mappa e catalogo inclusi, verificato con CRC, `unzip -t`, estrazione e confronto di ogni file con i sorgenti finali. Esclusi documenti e JSON di prova, vecchi template e node_modules.

Le prove dell'interfaccia e del download usano Happy DOM e IndexedDB con adattatori per le API del browser. Non è stato disponibile un browser Chromium eseguibile né un iPhone fisico: il comportamento nativo di installazione, fotocamera e download su dispositivo resta da confermare. Nessuna pubblicazione o modifica automatica della repository.
