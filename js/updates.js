import { VERSION } from "./config.js";

const TIMEOUT = 45000;
const TIMEOUT_MESSAGE = "Il controllo sta impiegando troppo tempo. Riprova tra poco.";
const returnKey = () => "schede-restauro:ritorno-aggiornamento:" + new URL("./", location.href).href;

function within(promise, milliseconds) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error(TIMEOUT_MESSAGE)), milliseconds);
    Promise.resolve(promise).then(resolve, reject).finally(() => clearTimeout(timer));
  });
}

function activated(worker, milliseconds) {
  return new Promise((resolve, reject) => {
    const finish = error => {
      clearTimeout(timer);
      worker.removeEventListener("statechange", check);
      if (error) reject(error); else resolve();
    };
    const check = () => {
      if (worker.state === "activated") finish();
      else if (worker.state === "redundant")
        finish(Error("Aggiornamento non completato. La scheda resta aperta; riprova tra poco."));
    };
    const timer = setTimeout(() => finish(Error(TIMEOUT_MESSAGE)), milliseconds);
    worker.addEventListener("statechange", check);
    check();
  });
}

function controlling(worker, milliseconds) {
  const service = navigator.serviceWorker;
  return new Promise((resolve, reject) => {
    const finish = error => {
      clearTimeout(timer);
      service.removeEventListener("controllerchange", check);
      if (error) reject(error); else resolve();
    };
    const check = () => { if (service.controller === worker) finish(); };
    const timer = setTimeout(() => finish(Error(TIMEOUT_MESSAGE)), milliseconds);
    service.addEventListener("controllerchange", check);
    check();
  });
}

function workerVersion(worker, milliseconds) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const finish = (error, version) => {
      clearTimeout(timer);
      channel.port1.close();
      channel.port2.close();
      if (error) reject(error); else resolve(version);
    };
    const timer = setTimeout(() => finish(Error("Non è stato possibile verificare la versione. Riprova tra poco.")), milliseconds);
    channel.port1.onmessage = event => {
      const version = event.data?.version;
      if (event.data?.type !== "APP_VERSION" || typeof version !== "string" || !/^\d+\.\d+(?:\.\d+)?$/.test(version))
        finish(Error("Risposta di aggiornamento non valida. Riprova tra poco."));
      else finish(null, version.replace(/\.0$/, ""));
    };
    try { worker.postMessage({ type: "GET_APP_VERSION" }, [channel.port2]); }
    catch (error) { finish(error); }
  });
}

/** Controlla la pubblicazione e attende file completi, attivazione e controllo
 * della pagina. Non cancella dati, non ricarica e non modifica la scheda. */
export async function checkForUpdates(onProgress = () => {}, timeout = TIMEOUT) {
  if (!/^https?:$/.test(location.protocol))
    throw Error("Per cercare gli aggiornamenti apri l’app dal suo indirizzo online.");
  if (navigator.onLine === false)
    throw Error("Connessione assente. Riprova quando sei online.");
  if (!("serviceWorker" in navigator) || !isSecureContext)
    throw Error("La ricerca degli aggiornamenti non è disponibile in questo browser.");

  const deadline = Date.now() + timeout;
  const remaining = () => Math.max(0, deadline - Date.now());
  const registration = await within(navigator.serviceWorker.register("./sw.js", {
    scope: "./", updateViaCache: "none",
  }), remaining());
  let candidate = registration.installing || registration.waiting;
  const found = () => {
    candidate = registration.installing || registration.waiting || candidate;
    if (candidate) onProgress("Aggiornamento in corso…");
  };
  registration.addEventListener("updatefound", found);
  try {
    found();
    await within(registration.update(), remaining());
    found();
    const worker = candidate || registration.active;
    if (!worker) throw Error("Aggiornamento non disponibile. Riprova tra poco.");
    await activated(worker, remaining());
    await controlling(worker, remaining());
    const version = await workerVersion(worker, Math.min(4000, remaining()));
    return { version, available: version !== VERSION };
  } finally {
    registration.removeEventListener("updatefound", found);
  }
}

/** Solo un'indicazione temporanea per la ricarica di questa finestra.
 * I dati della scheda rimangono nella normale bozza IndexedDB. */
export function rememberUpdateView(view, version) {
  sessionStorage.setItem(returnKey(), JSON.stringify({ view, version, time: Date.now() }));
}

export function takeUpdateView() {
  try {
    const key = returnKey(), raw = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.version !== VERSION || !["home", "editor"].includes(saved.view) ||
      !Number.isFinite(saved.time) || Math.abs(Date.now() - saved.time) > 600000) return null;
    return saved.view;
  } catch { return null; }
}
