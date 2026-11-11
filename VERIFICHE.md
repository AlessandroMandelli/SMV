# Verifiche della revisione 3.6.21

Base: versione 3.6.20 recuperata dalla repository SMV al commit `8f955fe58597f2b51fd0327ca799e8240630a5c8`. Ricostruito l'archivio con i 50 file e verificata la corrispondenza esatta con l'ultima consegna: 2.704.473 byte, SHA-256 `eb4664423b5e9ac7d3bf8a3dc282a4186b69b49faf82c74229bbc26358b43d1d`.

## Modifica localizzata

- Footer completo su ogni pagina del Word e del PDF, comprese le continuazioni.
- Word con logo originale, scritta s.c.ar.l. color oro, recapiti su una riga e numerazione automatica a destra. Tabella e tabulazioni native; nessuna casella di testo sovrapposta.
- Un solo footer Word predefinito, referenziato da tutte le sezioni; rimossa la distinzione tra footer della prima pagina e delle successive.
- Posizione del footer PDF e dimensioni dei suoi elementi conservate; rimosso il limite alle sole pagine iniziali delle sezioni.
- Modificati soltanto i due moduli interessati, i metadati di versione, il bundle, la cache e la documentazione. Catalogo, mappa, fotografie, nomenclatura, diagnostica, priorità, storico e collegamenti sono identici alla 3.6.20.

## Documenti e continuazioni

Generati due casi con gli stessi dati sia con i generatori 3.6.20 sia con quelli aggiornati:

1. Scheda essenziale con data generale vuota e note a fondo pagina: quattro pagine Word e quattro pagine PDF.
2. Scheda con due sopralluoghi, testo manutentivo lungo, otto diagnosi, priorità rimossa conservando il degrado, quattro risoluzioni, azioni preventive storicizzate, cinque fotografie e note: 15 pagine Word e 19 pagine PDF.

Per entrambi i casi, il corpo XML del Word coincide con la 3.6.20 dopo l'esclusione delle sole proprietà del footer; operazioni e coordinate del corpo PDF e struttura delle tabelle coincidono integralmente. Le esportazioni non modificano i dati della scheda.

Controllati il footer e la sua resa su tutte le 42 pagine effettive, con estrazione dei contenuti, verifica delle coordinate e controllo visivo dei dettagli a fondo pagina:

- Logo, s.c.ar.l., indirizzo, dati fiscali, e-mail e PEC presenti una sola volta per pagina.
- Recapiti su una sola riga; s.c.ar.l. a 11 pt e color oro, recapiti e contatori a 7,5 pt, come nella proposta approvata.
- Logo di 113,5 × 34,9 pt; margine sinistro e posizione costanti in tutte le pagine di ciascun formato.
- Campi PAGE e NUMPAGES aggiornati correttamente, comprese le pagine con numerazione a due cifre.
- Nessuna sovrapposizione con testi, immagini o riquadri delle note.
- Nessun footer Word nascosto dalla proprietà Prima pagina diversa; relazioni delle immagini e riferimenti di sezione validi.

Tutti gli XML e le relazioni interne dei DOCX sono stati verificati. Rendering Word eseguito con LibreOffice; la verifica nativa in Microsoft Word per Mac resta da confermare.

## Salvataggio e distribuzione

Superate le combinazioni JSON, PDF + JSON, DOCX + JSON e DOCX + PDF + JSON offline su desktop e iPhone simulato. JSON obbligatorio, più formati raccolti in un unico ZIP su iPhone e download separati su desktop. Il Word nativo non genera un PDF intermedio. Le prove del download usano Happy DOM e IndexedDB; nessun dispositivo iPhone fisico.

Verificato l'aggiornamento della cache dalla 3.6.20 alla 3.6.21: 20 risorse, navigazione e risorse offline, conservazione delle cache di altre app. La filigrana rimane esclusa.

Archivio finale con 50 file pronti per la radice GitHub, mappa e catalogo inclusi. Controllati sintassi JavaScript, identificativi HTML, riferimenti delle risorse, CRC dello ZIP, unzip -t, estrazione e corrispondenza di ogni file con i sorgenti finali. Esclusi documenti e JSON di prova, node_modules e vecchi template. Nessuna pubblicazione automatica della repository.
