# Verifiche della revisione 3.6.11

Base: 3.6.10. Modifiche concordate dal 30 ottobre 2026 alle 11:53, inclusa la successiva revisione grafica della selezione oggetto.

## Interfaccia e modello

Verifiche automatiche con Happy DOM e IndexedDB simulato:

- Quattro categorie Cappelle, Archi, Fontane, Viale; nomi estesi, Grotte delle Romite fra V e VI Cappella. Identificativi dei beni già presenti conservati.
- Pulsanti in un'unica colonna, larghezza comune in base al contenuto, blu del primo pulsante home, sola iniziale maiuscola e titolo centrato.
- Mappa filtrata per categoria: 15 marcatori per cappelle/grotte, tre archi o quattro fontane; un solo checkbox selezionato, bloccato finché la pagina non viene sbloccata. Il Viale ha solo il tracciato rosso.
- Oggetto compilato e bloccato nella nuova scheda; correzione della selezione e dei dati precedenti salvata nel JSON senza conservare il valore errato. Materie e tecniche compilabile da nuova, bloccato e sbloccabile dopo importazione.
- Data odierna proposta all'importazione; nessun campo Note del sopralluogo. I dati delle visite esistenti restano conservati.
- D01 risolto nella prima visita escluso dalle preventive anche dopo successive importazioni. D02 e D03 risolti quattro e otto mesi dopo conservano il piano precedente. Nuovi degradi restano aggiungibili.
- Azioni condotte in loco non eredita il testo preventivo. I testi di esecuzione esistenti restano conservati; le correzioni preventive non li modificano.
- Risolto in data ultima colonna della tabella preventiva; riga risolta verde e nessun dettaglio o riquadro separato sotto. Piano precedente accessibile dalla cronologia della pagina.
- Menu home Info, separatore rientrato, Installa app. App riconosciuta come installata: Info sola. Passare dalla finestra dell'app al tutto schermo non ripristina la voce di installazione.
- Conservate le regressioni su rimozione delle righe, priorità collegate, urgenza ereditata, prima azione automatica, lucchetti per pagina e correzioni definitive. Foto, date, didascalie e operazioni concorrenti controllate.

## Esportazioni e funzionamento offline

Superate tutte le combinazioni JSON, PDF + JSON, DOCX + JSON, DOCX + PDF + JSON in ambiente desktop e iPhone simulato, con accesso alle sole risorse offline. JSON obbligatorio, ZIP unico per più formati su iPhone. Il DOCX non richiede un PDF intermedio. Conservati generatori indipendenti.

Cache aggiornata dalla 3.6.10 alla 3.6.11: 21 risorse disponibili offline, cache delle altre app preservate, bozza non cancellata e navigazione associata alla versione corretta dei sorgenti.

## Word e PDF

Creati tre casi incrementali con date 15 febbraio, 15 giugno e 15 ottobre 2026 e un caso per il Viale. I documenti di prova sono esclusi dallo ZIP.

| Caso | Pagine Word | Pagine PDF | Valori non vuoti confrontati |
| --- | ---: | ---: | ---: |
| Prima compilazione | 7 | 7 | 34 |
| Secondo sopralluogo | 7 | 8 | 38 |
| Terzo sopralluogo con testi lunghi | 10 | 10 | 45 |
| Viale con dati minimi | 5 | 5 | Controllo mappa e denominazione |

Controllate le immagini delle pagine, il testo estratto, le date originarie delle programmazioni e le date di risoluzione. Nessuna stampa dei riepiloghi Storico sopralluoghi, Storico del degrado, Note del sopralluogo e Priorità del sopralluogo. Storico manutentivo ordinario e piani preventivi conservati presenti.

Verificate le nuove diciture Azioni preventive programmate il e RISOLTO IN DATA con data in grassetto su rettangolo verde chiaro. Nessuna dicitura Programmazione originaria conservata. PRIORITÀ usa il carattere Unicode À con accento grave e normalizzazione NFC. Allineamenti con tabulazioni o posizioni esplicite; le tabulazioni nel PDF usano arresti misurati.

Word nativo con paragrafi, tabelle e immagini in linea, struttura ripresa dalla 3.4.3. Nessuna forma VML o casella di testo sovrapposta. Qualifiche sotto Operatore, nessun pallino aggiuntivo davanti al Tecnico manutentore, Stato nella colonna accanto. XML delle parti leggibile; non è una validazione completa contro lo schema OOXML. PDF senza campi modulo o widget.

Nuova mappa senza deformazione, stessa geometria del Viale in SVG, Word e PDF. Campionati i segmenti del tracciato: 98,5% sul sentiero bianco; gli attraversamenti delle strutture sono previsti.

Il rendering Word è stato controllato con LibreOffice; Microsoft Word per Mac non è disponibile in questo ambiente. Non è stato eseguito un collaudo su iPhone fisico. Chromium locale non è disponibile: i controlli dell'editor utilizzano il DOM simulato, non screenshot di un browser reale.

## Distribuzione

51 file pronti da copiare nella radice GitHub, compresa assets/map.jpg. Esclusi test, documenti e JSON di prova, vecchi template e node_modules. Controllati sintassi JavaScript, versioni, ID HTML e risorse della cache. ZIP verificato con CRC, unzip -t, estrazione completa e confronto byte per byte con il checkpoint finale; controllo ripetuto dopo il salvataggio. Repository e pubblicazione GitHub Pages non modificate automaticamente.
