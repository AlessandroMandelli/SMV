# Verifiche della versione 2.4

Controlli effettuati sul pacchetto prima della consegna:

- Titolo della home aggiornato; pesi espliciti 700/400 e ridimensionamento del titolo in base alla larghezza effettiva del sottotitolo. Proporzioni CSS iniziali verificate con font compatibili con Arial. Controlli di regressione dell'avvio dell'app e della cache delle risorse.
- Nuove schede con tutti e sei i gruppi ripetibili vuoti. Aggiunta, rimozione dell'ultimo, annullamento della rimozione, pulsante disabilitato a gruppo vuoto e conservazione del primo elemento quando viene rimosso il secondo.
- Pulsanti Aggiungi/Rimuovi affiancati con la stessa classe grafica; assenza dei comandi di rimozione dentro i gruppi interessati. Diagnostica con sei colonne e larghezza minima non forzata.
- Assenza dei testi fissi dell'operatore dalla compilazione; presenza del campo Operatore compilabile nelle azioni. Foto senza icone nei due comandi e assenza della frase introduttiva rimossa.
- Altezza CSS calcolata di 40 px per testo, date, ora e mese. Il controllo dei vincoli di larghezza mobile rimane attivo.
- Cancellazione di una riga diagnostica con azioni: conferma specifica, annullamento senza perdita dei dati e conservazione delle azioni appartenenti alla riga precedente dopo la rimozione.
- PDF con gruppi vuoti e con dieci righe diagnostiche interamente vuote: nessuna tabella visibile e nessuna pagina diagnostica aggiunta. Dieci righe compilate divise in 8+2: verifica visiva e raster dell'assenza di righe residue nella seconda pagina. Due righe compilate su dieci: escluse le otto vuote.
- Dati fissi dell'operatore e indirizzo conservati nel PDF. Confronto raster con il precedente PDF vuoto: le differenze restano confinate alle aree delle tabelle eliminate.
- Simulazione DOM con identificazione iPhone/Chrome: un solo download automatico ZIP contenente un PDF valido e un JSON coerente con i campi compilati; controllo CRC e riapertura dei due file.
- Verifica dei collegamenti separati PDF e JSON e della loro invalidazione dopo una modifica. Generazione ZIP volutamente fallita: il PDF rimane scaricabile e il JSON disponibile separatamente.
- Condivisione PDF simulata, invocata direttamente dal tocco sul pulsante; annullamento senza perdita dei file o finestra di errore.
- Controllo delle regole CSS calcolate nel simulatore DOM a larghezze di 320, 393, 852 e 1280 pixel: dimensioni dei campi data/ora/mese e trasformazione mobile della tabella. Il simulatore non misura il layout nativo dei controlli WebKit.
- Confronto delle coordinate dei 14 punti originali con la repository; invariati. Il primo arco è stato spostato a sinistra e in basso.
- Verifica della home, della selezione iniziale, delle voci del menu e dell'assenza dell'archivio e della finestra di conferma dopo l'esportazione.
- Esecuzione dell'interfaccia effettivamente distribuita (`app.bundle.js`) in ambiente DOM con salvataggio simulato: campi, righe e gruppi ripetibili, collegamenti fra diagnostica e azioni, date indipendenti, bozza e reset. Su desktop il comando finale carica le librerie PDF locali e avvia entrambi i download, senza dialoghi di conferma dell'app.
- Avvio della home con IndexedDB non rispondente; Nuova scheda e Importa JSON rimangono utilizzabili.
- Evento di installazione simulato: il clic chiama il prompt conservato. I browser che non lo espongono ricevono le istruzioni.
- PDF normale, PDF con fotografie aggiuntive e PDF con celle/testi molto lunghi. Controllo del testo finale per escludere perdite e confronto visivo con il modello originale.
- PDF con tabelle vuote, righe compilate, righe con soli spazi e righe parzialmente compilate: stampate soltanto le righe con dati, senza riempimento delle righe residue.
- Atlante con 0, 1, 4, 5, 8 e 9 fotografie: massimo quattro per pagina, ordine di inserimento, proporzioni conservate, nessuna sovrapposizione e assenza di sfondo, cornici e segnaposto.
- Confronti raster a 144 dpi, escluse le sole aree delle tabelle e dell'atlante modificate nelle rispettive versioni. Font, grassetti, loghi e disposizione delle altre parti restano conservati.
- Controlli di sintassi, risorse locali, cache sotto un percorso GitHub Pages e integrità ZIP.

Non è disponibile un iPhone fisico o un browser WebKit nativo in questo ambiente. I test DOM e service worker non equivalgono a una prova in Chrome su iOS. L'effettivo contenimento dei controlli nativi, i download e la condivisione in File vanno verificati dopo la pubblicazione sull'iPhone utilizzato.

La versione pubblicata e la repository non sono state modificate automaticamente.
