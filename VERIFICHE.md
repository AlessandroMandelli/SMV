# Verifiche della versione 3.4.1

- Test dal bundle distribuito: sette combinazioni di formati (tre singoli, tre coppie e tutti e tre), ripetute per desktop e iPhone simulato. Contenuti e nomi controllati: nessun formato aggiunto o perso. Su iPhone un singolo file è diretto e ogni selezione multipla produce un solo ZIP. JSON singolo verificato senza caricare il generatore PDF o DOCX.
- Box Salva scheda: tutti i formati inizialmente selezionati, pulsante Salva disabilitato senza selezioni, chiusura senza download. Errori mostrati nel box e comandi disabilitati durante la generazione. I file derivano da un'unica copia dei dati; una modifica durante la generazione invalida il risultato.
- Menu: Torna alla home rimosso, Reset scheda conservato e verificato, Info con indirizzo SMV e versione V.3.4.1. Separatore rientrato. Sei scenari di installazione verificati: browser, modalità standalone, iOS standalone, API delle app installate, evento appinstalled e API non supportata.
- DOCX compilato e vuoto generati e aperti con LibreOffice. Renderizzate e ispezionate tutte le dieci pagine del caso compilato e tutte le quattro del caso vuoto. Tabelle e testi nativi modificabili, immagini intere, fotografie quattro più una, nessuna pagina vuota. Intestazioni e marchi solo nelle tre aperture. Testi finali e collegamenti degli interventi conservati.
- Generazione DOCX interamente locale con la libreria ZIP già inclusa. Nessuna chiamata a servizi di conversione. Validati XML, relazioni, parti DOCX e contenuti dei media.
- PDF invariato nella grafica e nei contenuti; nei test di esportazione il caso compilato mantiene dodici pagine. Modello dati, formato JSON, catalogo e storage invariati rispetto alla 3.3.
- Verifica preesistente dell'interfaccia superata: multilinea, date storiche libere, urgenza ALTO, interventi risolti e indici delle azioni preventive.
- Cache 3.4.1, versione Info generata dalla stessa sorgente della build, disponibilità delle risorse locali e integrità ZIP controllate. Pacchetto privo del JSON di prova.

## Pulizia del pacchetto

- Rimossi il template PDF storico e il README generico di fontkit, entrambi non usati dall'app. Conservate le licenze, i font, le immagini, le librerie e i sorgenti per la manutenzione.
- Conservata la migrazione delle vecchie bozze e dei vecchi JSON, effettivamente richiamata dall'app. Storage e modello dati non modificati.
- Cache limitata a venti risorse dell'app e alla pagina iniziale: nessun template storico, documentazione o copia dei moduli già presenti nel bundle. La build verifica che ogni risorsa esista.
- Simulata la prima installazione senza il vecchio template: cache creata correttamente. Simulata l'attivazione: vecchia cache della PWA rimossa e cache di altre app conservata. Verificate navigazione e risorse offline.
- Ripetute le sette combinazioni di esportazione su desktop e iPhone simulato consentendo accesso soltanto alle risorse del nuovo elenco offline: tutte superate.
- Controllati integrità ZIP, riferimenti dei file, versione Info e assenza di file di prova e di residui nel pacchetto.

Limiti della verifica: i test dell'interfaccia e di iPhone usano un simulatore DOM; il browser headless non è disponibile in questo ambiente. Non è stata eseguita una prova su iPhone fisico o in Microsoft Word nativo. Il rendering del DOCX è stato verificato con LibreOffice. L'installazione è rilevabile solo nei limiti delle API esposte dal browser; Safari/iOS riconosce la modalità PWA quando l'app è aperta dalla Home.

Nextcloud e APK non fanno parte di questa versione. Il sito e la repository remota non sono stati pubblicati automaticamente.
