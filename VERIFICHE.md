# Verifiche della revisione 3.6.25

Base 3.6.24 recuperata dalla repository pubblicata dopo il ripristino dell'ambiente di lavoro. Ricostruito l'archivio dell'ultima consegna e verificata la corrispondenza esatta: 51 file, 2.712.401 byte, SHA-256 `fffda6b56b0a39ddafacca17c7fbe632be7869faf2df08afc4f695a8048b6da6`.

## Correzione

Prima pagina PDF riportata al margine superiore di 28,8 pt del Word. Riposizionati titolo, loghi, primo blocco dei metadati e localizzazione; i contenuti della prima colonna seguono l'intestazione. Mappa, checkbox e tracciato del Viale condividono il nuovo riferimento verticale. Non cambiano larghezze, font, dimensioni delle immagini, contenuti o footer.

## Confronto con il Word

Generati PDF e Word dagli stessi dati di una scheda con sopralluoghi e cinque fotografie. Rendering Word con LibreOffice e PDF con Poppler, confrontando prima pagina e coordinate estratte:

- Titolo della scheda: differenza verticale di circa 0,36 pt.
- Titolo Localizzazione bene: differenza di circa 0,05 pt.
- Inizio dell'ID: differenza inferiore a 0,01 pt.
- Immagini dei due loghi e della mappa: coordinate superiori coincidenti.

Corpo, immagini, stili, relazioni e footer del DOCX sono identici per byte alla 3.6.24; cambia soltanto il metadato della versione. Il Word di riferimento non è stato modificato. Non è stata effettuata una nuova prova nativa in Word per Mac.

## PDF e contenuti lunghi

Cinque schede di prova, per 36 pagine complessive: Acquedotto essenziale con note, scheda con storico lungo e quindici pagine, scheda di confronto Word/PDF, Viale con tracciato rosso e scheda con ID multilinea, diciotto righe di autore e ventiquattro di materie e tecniche.

Nei quattro casi ordinari il confronto con la 3.6.24 conferma che cambiano soltanto coordinate verticali della prima pagina; tutte le pagine successive e le tabelle sono identiche. Nella prova con testo lungo sono conservate tutte le righe e le continuazioni. Le esportazioni non modificano i dati della scheda.

Controllate visivamente le prime pagine e tutte le cinque pagine del caso con testi lunghi. Verificati su tutti i PDF footer, numerazione e assenza di campi di modulo trasparenti. Conservato l'allineamento del footer PDF introdotto nella 3.6.24. Nessun testo oltre il margine inferiore del contenuto o sovrapposto al footer.

## Salvataggio e distribuzione

Superate cinque combinazioni di esportazione su desktop simulato e cinque su iPhone simulato: JSON obbligatorio, JSON singolo, ZIP per più formati, nomi e contenuti corretti e funzionamento offline. Il DOCX nativo non crea un PDF intermedio.

Cache 3.6.25 con venti risorse, controllo della versione per Cerca aggiornamenti, navigazione e risorse offline, rimozione della sola cache precedente. Interfaccia, tema, salvataggio della bozza, aggiornamenti e logica dei sopralluoghi conservati. Prove del browser e di iPhone simulate in Happy DOM; nessun iPhone fisico.

ZIP finale con 51 file pronti per GitHub. Verificati sintassi JavaScript, riferimenti HTML, file della cache, CRC, unzip -t, estrazione e corrispondenza dei file con i sorgenti finali. Esclusi documenti e JSON di prova, vecchi template, filigrane e node_modules. Nessuna modifica della repository remota.
