# Verifiche della revisione 3.6.13

Base utilizzata: 3.6.12. Modifiche limitate alla nomenclatura e all'aggiunta di Acquedotto.

## Nomi dei file

Verificati tutti i 24 beni: 14 cappelle con numeri romani, tre archi con Primo/Secondo/Terzo, tre fontane ordinali, Fontana_del_Mosè, Grotta_delle_Romite, Viale e Acquedotto. Controllati prefisso, maiuscole e minuscole, separatori, ID maiuscolo e assenza di parentesi di template e ora.

Verificati segnaposto XX.XX_anno, aggiornamento immediato all'inserimento e alla correzione dell'ID, ritorno al segnaposto cancellando l'ID e conservazione dell'anno già presente nell'identificativo importato. Il nome e la data finale restano completi anche con identificativi troppo lunghi. I caratteri non validi per il filesystem sono sostituiti soltanto nel nome, senza alterare il dato originale.

La data del nome è indipendente dalle date compilate nel documento: è fissata all'apertura e conservata da salvataggio, riapertura e ripresa della bozza. Avviare l'aggiornamento di un JSON usa la data locale odierna e conserva l'ID. Controllati il formato precedente con timestamp ISO e il nuovo formato con sola data; ripetute le prove di nomenclatura con fusi Europe/Rome e America/Los_Angeles.

## Interfaccia e compatibilità

Prove con Happy DOM e IndexedDB simulato: cinque categorie nell'ordine Cappelle, Archi, Fontane, Acquedotto, Viale; Acquedotto diretto senza tendina; oggetto compilato e bloccato, nome visualizzato aggiornato con l'ID, nessun marcatore con coordinate inesistenti. Conservati i controlli su due finestre, chiusure esterne e ×, mappe per categoria, selezione singola, correzioni definitive e riconoscimento dell'installazione.

Superate le regressioni su JSON importati, visite successive, diagnostica e azioni collegate, lucchetti, materiali e foto. Conservati gli identificativi tecnici dei beni precedenti e lo schema JSON 2.

## Download ed esportazione

Superate tutte le combinazioni JSON, PDF + JSON, DOCX + JSON e DOCX + PDF + JSON offline, su desktop e iPhone simulato. Controllati i nomi effettivi dei download e di ciascun file interno allo ZIP. Provato Fontana_del_Mosè con accento anche nel nome dello ZIP e dei tre file interni.

Creata una scheda Acquedotto di prova: Word e PDF di cinque pagine, dati e denominazione completi, titolo dei metadati coerente con il nome generato, nessuna alterazione dei dati sorgente. Controllati XML Word e tutte le pagine renderizzate di entrambi i documenti. Nessun campo modulo PDF. I generatori e il layout della 3.6.12 restano invariati.

Word controllato con LibreOffice; Microsoft Word per Mac non è disponibile in questo ambiente. I test dell'interfaccia e del comportamento iPhone sono simulati, senza un collaudo su telefono fisico.

## Distribuzione

Cache aggiornata dalla 3.6.12 alla 3.6.13, con 21 risorse offline e conservazione di bozza e cache delle altre app. Nuovo bundle compilato, versioni e identificativi HTML controllati.

51 file pronti per la radice GitHub, inclusa la mappa. Esclusi documenti e JSON di prova, vecchi template e node_modules. Integrità ZIP controllata con CRC, unzip -t ed estrazione e confronto di tutti i file; controllo ripetuto dopo il salvataggio. La repository non viene modificata automaticamente.
