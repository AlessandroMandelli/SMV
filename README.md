# Schede Restauro 3.6.23

PWA per il Sacro Monte di Varese, utilizzabile offline su desktop e telefono. Esporta PDF, Word modificabile e JSON. Lo ZIP contiene il sito già compilato, pronto per GitHub Pages senza npm o un server applicativo.

## Novità della revisione

- **Cerca aggiornamenti** è presente in Opzioni sia nella home sia nella compilazione, dopo il separatore e prima di Installa app. Rimane visibile anche quando l'app è già installata; in questo caso il separatore resta presente.
- Il comando salva la bozza, controlla la pubblicazione online, attende che tutti i file siano pronti e che il nuovo aggiornamento controlli la pagina. Poi ricarica l'app e riprende la stessa scheda nella stessa sezione; dalla home ritorna alla home. Fotografie, storico, date e nome personalizzato rimangono conservati.
- Durante la ricerca compaiono **Ricerca in corso…** e, quando necessario, **Aggiornamento in corso…**. Se la versione è già attuale viene mostrato **L'app è già aggiornata**. In caso di connessione assente, download incompleto o salvataggio locale fallito, la scheda resta aperta e si può riprovare. Il controllo ha un limite di attesa per evitare che i pulsanti restino occupati indefinitamente.
- Rimane il controllo automatico al caricamento dell'app; la compilazione non viene ricaricata automaticamente durante il lavoro. Il comando manuale applica anche un aggiornamento già scaricato mentre la finestra mostrava ancora la versione precedente.

## Correzioni già incluse nella 3.6.22

- Nel footer Word, **s.c.ar.l.** e i recapiti sono abbassati al filo inferiore della scritta Cròmo. Il logo conserva posizione e dimensioni; rimangono la riga unica, le tabulazioni e la numerazione automatica. Il footer PDF è invariato.
- **Salva scheda** scarica il solo JSON direttamente. Se vengono scelti due o tre formati, scarica un unico ZIP su tutti i dispositivi, desktop compreso. Il JSON rimane obbligatorio.
- L'intera interfaccia segue automaticamente la modalità chiara o scura del dispositivo/browser, anche quando la preferenza cambia ad app aperta. Sono adattati home, campi, controlli nativi, tabelle, menu, finestre, storico e stati risolti. Mappa e fotografie mantengono i colori originali; Word e PDF conservano il fondo bianco e i propri stili.

## Correzioni già incluse nella 3.6.21

- Il footer completo compare su **tutte le pagine del Word e del PDF**, comprese seconda pagina, fotografie e continuazioni delle tabelle e degli interventi.
- Nel Word, logo Cròmo, scritta **s.c.ar.l.** color oro, recapiti su una sola riga e numerazione a destra riprendono la proposta grafica approvata. Il footer usa tabelle e tabulazioni native di Word; i numeri di pagina rimangono campi automatici.
- Le intestazioni superiori mantengono il comportamento già previsto per ciascuna sezione. La modifica riguarda il footer e conserva i contenuti della 3.6.20.

## Correzioni già incluse nella 3.6.20

- I nomi automatici iniziano con l'oggetto, seguito da ID, `scheda_ispezione_periodica` e data di apertura o aggiornamento, senza ora. Esempio di struttura: `Acquedotto_ID_02.12_2026_scheda_ispezione_periodica_2026-11-09.json`. L'ID effettivo è quello della scheda; l'esempio non cambia gli ID del catalogo. La stessa base è usata per DOCX, PDF, JSON e ZIP. Il nome rimane personalizzabile; riprendere la bozza non aggiorna la data del nome.
- Le fotografie appena scattate o caricate vengono conservate entro **2 MB ciascuna (2.000.000 byte)**. Se necessario vengono compresse in JPEG e ridimensionate; JPEG e PNG già compatibili e sotto il limite mantengono i byte originali, salvo la normalizzazione dell'orientamento EXIF. Il file originale sul dispositivo rimane intatto. Le fotografie già presenti nei JSON importati non vengono ricompresse automaticamente.
- **Rimuovi priorità** elimina soltanto il riquadro della priorità: conserva la riga diagnostica, il livello di rischio, le azioni preventive e gli interventi eseguiti. La priorità rimossa non viene ricreata dopo salvataggio, importazione o un nuovo sopralluogo. La cancellazione esplicita della riga diagnostica conserva invece il comportamento precedente e rimuove le voci collegate.
- Rimossa la filigrana della home su desktop e mobile, senza aggiungere il logo del Sacro Monte. L'immagine inutilizzata non è inclusa nel sito né nella cache.

## Correzioni già incluse nella 3.6.19

- Solo nel PDF, nello storico manutentivo, **Interventi di RESTAURO precedenti** e **Interventi di MANUTENZIONE precedenti** compaiono una sola volta ciascuno, prima del primo intervento della relativa categoria. I titoli non si ripetono per i record successivi o sulle pagine di continuazione.
- Ogni pacchetto Data + Azione è separato dal successivo da almeno una riga vuota. Le azioni restano sotto la propria etichetta, allineate a sinistra. Le categorie prive di interventi compilati non vengono stampate.

## Correzioni già incluse nella 3.6.18

- Se la data della prima scheda è vuota, Word e PDF lasciano vuota anche la data nelle intestazioni del registro di manutenzione immediata e delle azioni preventive. Le etichette Data rimangono. Le date dei singoli rilievi, interventi e programmi non vengono cancellate. Quando la data iniziale è presente, le sezioni mantengono le proprie date indipendenti.
- Il valore dell'ID è a 12 pt nelle tre intestazioni Word e PDF. L'etichetta **ID Scheda:** rimane a 9,5 pt. I grassetti restano quelli previsti; un ID lungo va a capo senza uscire dal suo riquadro.

## Modifiche ai documenti già incluse nella 3.6.17

- Nello storico manutentivo, sia per gli interventi di restauro sia per quelli di manutenzione, il testo compilato inizia sotto l'etichetta **Azione:** ed è allineato a sinistra nel Word e nel PDF. Le righe e gli a capo del testo vengono conservati anche per contenuti lunghi.
- Se non ci sono fotografie, il titolo **6. ATLANTE FOTOGRAFICO** segue la sezione 5 senza un'interruzione di pagina obbligatoria. Se la sezione 5 è vuota, tra i due titoli rimane lo spazio di un paragrafo; se è compilata, il titolo 6 segue i suoi contenuti. Le note generali rimangono nel riquadro a fondo pagina. Anche le fotografie dei sopralluoghi precedenti sono considerate per stabilire se l'atlante è vuoto.

## Anagrafica introdotta nella 3.6.16

- Inserita l'anagrafica dei 23 beni dal file DATI_SMV(1).docx e completata la Terza Fontana secondo le indicazioni dell'utente. Tutti i 24 beni hanno un ID univoco: da 02.01_2026 a 02.24_2026.
- Le nuove schede precompilano Oggetto, ID, Cronologia, Quota e Distanza dal Santuario dove forniti. I campi partono bloccati e si sbloccano con il lucchetto della prima pagina. Per Acquedotto e Viale non sono state inventate quote o distanze.
- Nei campi e nei documenti si conservano le maiuscole del Word. Oggetto e ID sono in grassetto; i valori di cronologia, quota e distanza sono normali. Distanze e quote mantengono il separatore italiano delle migliaia e l'unità di misura.
- La scelta del bene dalla home usa le nuove denominazioni con l'attuale uso di maiuscole e minuscole. Confermate Seconda Fontana, Arco di San Carlo e Terza Fontana, Arco di Sant’Ambrogio.
- La Terza Fontana ha ID 02.24_2026, cronologia XVII secolo, quota 724 m e distanza dal Santuario 938 m.
- Aprire il lucchetto permette di correggere anche i dati forniti dal catalogo. Le correzioni, comprese le cancellazioni di un valore, rimangono dopo salvataggio, ripresa e importazione JSON; non vengono sostituite dai valori iniziali. Nei JSON precedenti si conservano i dati presenti, compresi quelli vuoti; vengono inizializzati soltanto i campi mancanti. Cambiare bene dalla mappa a lucchetto aperto aggiorna i relativi dati anagrafici.

Conservati i checkbox separati di Grotta e VI Cappella, le altre coordinate, il tracciato del Viale, le note sotto al titolo, la colonna Risolto in data e la gestione delle versioni delle azioni preventive. Non vengono eliminati automaticamente i gruppi di azioni ripetuti.

## Pubblicazione

Estrai lo ZIP e carica tutti i file e le cartelle nella radice della repository, sostituendo quelli della versione precedente. `index.html`, `styles.css`, `app.bundle.js`, `sw.js` e `manifest.webmanifest` devono trovarsi accanto alle cartelle `assets`, `js`, `vendor` e `tools`. Non caricare lo ZIP senza estrarlo. Se presente nella vecchia versione, elimina anche `assets/home-landscape.png`, che non è più utilizzato. Attendi il completamento di GitHub Pages. La cache 3.6.23 sostituisce quella precedente senza cancellare la bozza; una scheda in compilazione non viene ricaricata forzatamente.

Per il primo passaggio dalla 3.6.22, che non contiene il nuovo pulsante, ricarica l'app con connessione, attendi il controllo iniziale e ricaricala di nuovo se mostra ancora la versione precedente. Dalla 3.6.23 in poi puoi usare Cerca aggiornamenti. La ricerca riguarda il percorso da cui hai aperto l'app, anche se la repository ha un nome diverso da SMV.

## Home e compilazione

- **Compila una nuova scheda** avvia la prima ispezione.
- **Carica e aggiorna stato conservativo** importa l'ultimo JSON e avvia un nuovo sopralluogo. La data della visita è conservata nello storico; le note delle visite già esistenti nei vecchi JSON sono mantenute. Il nome automatico assume la data del caricamento, senza ora, secondo la nomenclatura indicata sopra; la data originaria della scheda e gli stati precedenti restano disponibili. Il file importato resta intatto.
- **Riprendi la compilazione** riapre la bozza sullo stesso dispositivo e profilo browser, senza iniziare una visita o aggiornare le date.

Storico manutentivo e stato conservativo hanno schermate distinte. I titoli superiori duplicati e i campi ID/data/oggetto delle sezioni finali non occupano spazio nella compilazione; le corrispondenti intestazioni rimangono nei documenti. Tra nome file e Opzioni si trovano il lucchetto e l'icona cronologia. La cronologia mostra soltanto le versioni precedenti della pagina corrente.

Salva scheda registra lo stato corrente. Non sono necessari pulsanti separati Nuovo sopralluogo o Registra aggiornamento nell'editor. La bozza locale si salva durante la compilazione. L'Info conserva il collegamento SMV approvato; i percorsi tecnici sono relativi e funzionano anche sotto SMV_V5. Installa app scompare quando l'installazione viene rilevata.

Cerca aggiornamenti conserva i dati in IndexedDB e usa soltanto una breve indicazione nella sessione della finestra per riaprire la home o la compilazione dopo la ricarica. Non avvia un nuovo sopralluogo, non aggiunge campi al JSON e non aggiorna le date della scheda. L'indicazione viene consumata una sola volta e scade dopo dieci minuti.

## Blocchi e correzioni definitive

Nella nuova scheda Materie e tecniche è direttamente compilabile. Dopo l'importazione del JSON è bloccato insieme agli altri dati precedenti della prima pagina. Oggetto, ID, Cronologia e gli altri campi forniti dal catalogo, oltre a Complesso ed Ente proprietario, partono protetti anche nella nuova scheda. Il lucchetto della prima pagina permette di correggerli.

- Il lucchetto agisce soltanto sulla pagina visualizzata. Un secondo clic ripristina i blocchi; le altre pagine conservano il proprio stato.
- Dopo un'importazione sono protetti gli interventi pregressi, gli stati conservativi, la diagnostica precedente salvo Risolto in data, le priorità, gli interventi eseguiti, le azioni preventive e le fotografie storicizzate. Le nuove voci restano compilabili.
- Aprire il lucchetto permette correzioni e rimozioni definitive. La stessa voce viene aggiornata o eliminata anche nelle copie storiche, usando il suo identificativo. Il JSON finale non conserva il contenuto errato o gli elementi eliminati. Le immagini eliminate vengono rimosse anche dall'archivio interno quando non hanno più riferimenti.
- I normali aggiornamenti a lucchetto chiuso conservano la storia reale: risolvere oggi un degrado non risolve le visite anteriori. Correggere invece una data già registrata modifica le copie che la riportavano.
- I permessi di sblocco non sono esportati nel JSON. Tornando alla home, creando o importando una scheda e riaprendo l'app vengono ripristinate le protezioni previste.

## Collegamenti con la diagnostica

Le nuove priorità e le azioni preventive sono collegate al degrado tramite identificativo stabile. Il grado d'urgenza eredita il Livello di rischio ed è sempre bloccato, anche a lucchetto aperto: si corregge il rischio nella riga diagnostica. Una finestra d'intervento divenuta incompatibile viene cancellata per permettere una nuova scelta. Non compare Azzera scelta.

Rimuovere una priorità non modifica la diagnostica né le azioni collegate. Le priorità storicizzate rimangono protette dal lucchetto della pagina; rimuoverle a pagina sbloccata elimina la priorità anche dalle copie precedenti, conservando il degrado e le azioni. Una priorità nuova segue il proprio blocco, indipendentemente dalla data del degrado collegato.

Risolto in data genera automaticamente la voce negli interventi eseguiti. Per la visita corrente le azioni condotte in loco sono compilabili; per gli interventi chiusi sono protette. Non c'è un comando per aggiungere manualmente nuovi interventi eseguiti. Gli interventi manuali dei vecchi JSON e le vecchie priorità senza collegamento rimangono disponibili, senza attribuire loro un degrado arbitrario.

Il degrado risolto che era aperto in un sopralluogo precedente mantiene la programmazione originaria: nell'editor la riga della tabella è verde chiaro e contiene la data di risoluzione. Il piano precedente si consulta dall'icona cronologia, senza un riquadro o una tendina aggiuntivi sotto la tabella. Nei documenti il piano viene riportato per intero con la data originaria e la data di risoluzione nell'ultima colonna della tabella, la cui riga è verde chiaro. Le voci inserite e risolte nella loro prima visita restano soltanto negli interventi eseguiti.

## Fotografie e salvataggio

Scatta foto e Carica foto registrano la data locale di inserimento, distinta dalla data dello scatto. Ogni foto ha una didascalia facoltativa multilinea, allineata a sinistra in Arial 9,5 sotto l'immagine. Nei documenti con più sopralluoghi è indicata anche la visita di riferimento. I JSON precedenti senza metadati usano la data e la didascalia disponibili.

Il limite di 2 MB riguarda il peso binario di ogni nuova immagine, non il peso complessivo del JSON: la codifica base64 usata nel JSON occupa più spazio. La compressione verifica il peso effettivo prodotto, riducendo ulteriormente le dimensioni se necessario. I formati diversi da JPEG e PNG vengono convertiti in JPEG quando il browser riesce a leggerli; un'immagine non leggibile non viene aggiunta.

Quando contiene fotografie, l'atlante inizia su una nuova pagina, contiene fino a quattro fotografie per pagina e ripete l'intestazione sulle continuazioni, sia nel PDF sia nel Word. Se è vuoto, viene stampato soltanto il titolo dopo la sezione 5, sulla stessa pagina quando lo spazio lo consente. Didascalie particolarmente lunghe possono richiedere altre pagine. Le didascalie delle visite chiuse sono conservate separatamente dall'immagine; correggerle a lucchetto aperto aggiorna anche le copie precedenti della stessa fotografia.

Salva scheda include sempre il JSON e permette di aggiungere DOCX e PDF. Il JSON non può essere deselezionato. Su tutti i dispositivi, il solo JSON viene scaricato direttamente; due o tre formati sono raccolti in un unico ZIP. Il JSON conserva i dati e lo storico necessari per il sopralluogo successivo.

Le finestre in sovraimpressione si chiudono con la × oppure con un clic o tocco esterno. Durante importazioni e salvataggi in corso resta la protezione contro la chiusura accidentale.

## Documenti

Il PDF mantiene la propria impaginazione. Le tabelle contengono soltanto righe effettivamente compilate, senza riempimenti vuoti; non vengono creati campi di modulo trasparenti. I loghi delle intestazioni superiori e le intestazioni principali compaiono una volta per sezione, con intestazione dell'atlante ripetuta sulle pagine fotografiche. Il footer completo compare invece su tutte le pagine, con posizione costante e numerazione a destra.

Il Word usa tabelle native e immagini in linea: mappa e titoli non dipendono da caselle sovrapposte. Le note hanno un riquadro a fondo pagina, i ruoli sono incolonnati e Stato rimane nella colonna accanto. Gli elenchi usano la numerazione Word; non c'è un pallino davanti a Tecnico manutentore. I testi usano tabulazioni invece di sequenze di spazi per l'allineamento.

Il Word rimane modificabile e scorre con il contenuto: numero di pagine e interruzioni possono differire dal PDF e dall'applicazione usata per aprirlo. Il controllo visivo della revisione usa LibreOffice; la resa nativa in Microsoft Word per Mac resta da confermare. I dati vengono preparati in comune, mentre i due formati hanno generatori distinti. Richiedere soltanto il DOCX non crea un PDF intermedio.

## Manutenzione del codice

I sorgenti leggibili sono in `js/`; per ricompilarli eseguire `npm ci` e `npm run build`. Il sito distribuito funziona senza questi comandi. `assets/beni.json` contiene l'anagrafica, i valori iniziali `fixed`, i campi in grassetto `boldFields` e il campo `fileLabel` per la parte del nome relativa a ciascun bene, `assets/map.jpg` la planimetria e `js/road.js` il tracciato sovrapposto del Viale. Il catalogo contiene le nuove coordinate delle cappelle, delle grotte, degli archi e delle fontane. Non viene utilizzato un vecchio template PDF.

`js/corrections.js` applica le correzioni definitive, `js/surveys.js` gestisce sopralluoghi e collegamenti, `js/pdf.js` e `js/docx.js` generano i documenti. Le note scritte manualmente restano testi autonomi: eventuali riferimenti da correggere vanno modificati nel relativo campo.

`js/updates.js`, già incluso nel bundle, gestisce la ricerca manuale, l'attesa dell'aggiornamento completo e il ritorno alla pagina precedente. Il service worker restituisce la propria versione su richiesta, così una pagina ancora aperta con il vecchio codice riconosce anche una cache già aggiornata. Non vengono cancellati i dati locali per forzare l'aggiornamento.

I nuovi JSON mantengono lo schema 2 e importano gli schemi 1 e 2. Lo ZIP del sito non contiene JSON o documenti di prova, vecchi template o `node_modules`. Non comprende integrazioni Nextcloud o applicazioni native.
