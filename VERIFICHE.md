# Verifiche della revisione 3.6.15

Base: 3.6.14. Correzione circoscritta alle coordinate dei marcatori Grotte delle Romite e VI Cappella; catalogo e bundle ricompilati. Logica dell'app, stile dei checkbox e generatori Word/PDF invariati.

## Mappa

Verificato che soltanto le coordinate dei due beni siano cambiate: identificativi, denominazioni, ordine dei beni e tutti gli altri marcatori restano identici. Il catalogo contiene gli stessi 24 beni.

Controllata la separazione di tutte le coppie di checkbox della categoria cappelle/grotte a larghezze della mappa di 234, 250, 285, 307, 320 e 390 pixel, considerando anche il bordo esterno di selezione. Controllo visivo con selezione della grotta e della VI Cappella alle larghezze mobile e desktop.

Prove di interfaccia con Happy DOM: categorie, selezione singola, mappa bloccata e sbloccata, importazione di JSON precedenti, correzione dell'oggetto e salvataggio JSON. I marcatori usano il catalogo aggiornato e non le vecchie coordinate eventualmente presenti nell'assetSnapshot importato.

## Esportazioni

Generati Word e PDF con la grotta selezionata: cinque pagine per formato, 15 checkbox distinti nella mappa. Verificata la geometria PDF e ispezionate tutte le pagine renderizzate, oltre alla mappa Word incorporata. I dati della scheda non vengono modificati durante la generazione.

Word verificato tramite LibreOffice, non con Microsoft Word per Mac. Le prove dell'interfaccia sono simulate; nessun collaudo su iPhone fisico in questa revisione.

## Distribuzione

Cache aggiornata dalla 3.6.14 alla 3.6.15 con le stesse 21 risorse offline. Confermati riconoscimento dell'installazione, conservazione delle bozze e isolamento dalle altre app.

51 file pronti per la radice GitHub, inclusa la mappa. Esclusi file di prova, vecchi template e node_modules. Integrità controllata con CRC, unzip -t ed estrazione e confronto di tutti i file. Nessuna pubblicazione o modifica automatica della repository.
