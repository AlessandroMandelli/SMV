# Verifiche della revisione 3.6.24

Base: archivio dell'ultima consegna 3.6.23, 2.712.189 byte, SHA-256 `4305d91002fbea2f90eabafaf80cd0b19c14dc10e81e2210f19e76503ccd98a5`. Verificati CRC e corrispondenza esatta dei 51 file prima della modifica.

## Correzione localizzata

Allineate al filo inferiore della scritta Cròmo le linee di base di s.c.ar.l. e dell'intera riga dei dati aziendali nel footer PDF. La posizione si ricava dal bordo inferiore del logo e dalla dimensione effettiva del font, senza spostare logo, numerazione o corpo della pagina. Generatore Word e stili dell'app invariati.

## PDF

Generati con lo stesso stato sia il PDF della 3.6.23 sia quello aggiornato, confrontando tutte le operazioni di disegno e le tabelle:

- Scheda essenziale dell'Acquedotto, data iniziale vuota e riquadri note: quattro pagine.
- Scheda con due sopralluoghi, storico manutentivo lungo, otto diagnosi, quattro risoluzioni, priorità rimossa conservando il degrado, azioni preventive storicizzate e cinque fotografie: diciannove pagine.

In tutti i casi le sole differenze di impaginazione sono le coordinate verticali delle due scritte del footer. Contenuti, righe, tabelle, interruzioni di pagina, loghi e numerazione coincidono integralmente con la 3.6.23. I dati della scheda non vengono modificati dall'esportazione.

Renderizzati con Poppler e controllati visivamente tutti i 23 footer, oltre a una pagina completa con note. Verificati anche i PDF tramite estrazione delle coordinate:

- Linea di base di entrambe le scritte a 597,9 pt dal bordo superiore, coincidente entro 0,02 pt con il bordo inferiore del logo.
- Logo invariato a 28,8 pt da sinistra e 563 pt dall'alto, dimensioni 113,5 x 34,9 pt.
- Sigla societaria a 11 pt e recapiti a 7,5 pt, come nella versione precedente; riga dei recapiti completa e senza tagli.
- Tutti i testi entro la pagina, separati dal contenuto e dai riquadri note. Numerazione corretta anche con pagine a due cifre.
- Nessun campo di modulo trasparente.

## Word e salvataggio

Confrontate tutte le parti del DOCX con la 3.6.23, usando una scheda con sopralluoghi e fotografie: corpo, footer, immagini, stili e relazioni identici per byte. Cambia soltanto il metadato della versione dell'app. Dati originali invariati.

Superate cinque combinazioni di esportazione su desktop simulato e cinque su iPhone simulato: JSON obbligatorio, JSON singolo diretto, ZIP per più formati, contenuti e nomi verificati. Le risorse sono disponibili anche offline; il Word nativo non crea PDF intermedi.

Verificata la cache 3.6.24 con venti risorse, risposta con la versione per Cerca aggiornamenti, navigazione offline e pulizia della sola cache precedente. Un download interrotto conserva la cache funzionante e permette un tentativo successivo completo. Le prove di browser e iPhone sono simulate; non è stata eseguita una prova su dispositivo fisico.

## Archivio

Versione coerente fra package, configurazione, bundle, HTML e service worker. Modificato soltanto il modulo del layout PDF, oltre ai metadati di versione, ai file generati e alla documentazione. Interfaccia, tema, ricerca aggiornamenti, catalogo, mappa e logica dei sopralluoghi conservati.

ZIP con 51 file pronti per la radice GitHub. Controllati sintassi JavaScript, riferimenti HTML e risorse, CRC, unzip -t, estrazione e corrispondenza dei file con i sorgenti finali. Esclusi PDF, DOCX e JSON di prova, node_modules, vecchi template e filigrane. Nessuna pubblicazione automatica della repository.
