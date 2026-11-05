/** Modello unico condiviso da editor, bozza, JSON e PDF. */
import { EDITOR_LAYOUT_VERSION, importedSection } from "./sections.js";
export { SECTIONS } from "./sections.js";
export const APP_ID = "schede-restauro";
export const SCHEMA_VERSION = 2;
export const COMMON = Object.freeze({
  operator: "Francesco Maria Peron",
  company: "Cròmo s.c.ar.l.",
  address: "Via Matteotti, 8 – 21030 Castello Cabiaglio (Varese)",
  email: "info@cromorestauri.com",
  pec: "cromo restauri@sicurezzapostale.it",
  complex: "Sacro Monte di Varese – Percorso devozionale dei 15 misteri",
  owner: "Parrocchia Santa Maria del Monte al Sacro Monte di Varese",
  authorization: "D.L., Arch. Gaetano Arricobene",
});
export const RISKS = ["BASSO", "MEDIO", "ALTO"];
export const WINDOWS = [
  "PROSECUZIONE MONITORAGGIO",
  "IMMEDIATO",
  "ENTRO 6 MESI",
  "ENTRO 12 MESI",
];
export const HIGH_WINDOWS = [
  "MONITORAGGIO",
  "IMMEDIATO",
  "ENTRO 3 MESI",
  "ENTRO 6 MESI",
];
export const windowsForRisk = (risk) =>
  risk === "ALTO" ? HIGH_WINDOWS : WINDOWS;
export const immediateRows = (state) => [
  ...state.diagnosis
    .filter((r) => r.resolvedDate)
    .map((r) => ({
      id: r.id,
      area: r.area,
      element: r.element,
      pathology: r.pathology,
      causes: r.causes,
      date: r.resolvedDate,
      action: r.resolvedAction,
    })),
  ...state.immediate.records,
];
export const METHODS = ["Visiva (da terra)", "Visiva (da presidio)", "Tattile"];
export const ROLES = [
  "TECNICO MANUTENTORE",
  "RESTAURATORE BENI CULTURALI",
  "GIARDINIERE/MANUTENTORE",
];
export const STATUSES = ["IN ATTESA", "PIANIFICATO", "ATTIVO"];
export const uid = () => crypto.randomUUID();
export function localDate(d = new Date()) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}
export function localTime(d = new Date()) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
export const historyRecord = () => ({ id: uid(), date: "", action: "" });
export const conditionRecord = () => ({
  id: uid(),
  date: "",
  exposure: "",
  methods: [],
  assessment: "",
});
export const diagnosisRecord = () => ({
  id: uid(),
  area: "",
  element: "",
  reference: "",
  detectedDate: "",
  pathology: "",
  causes: "",
  risk: "",
  resolvedDate: "",
  resolvedAction: "",
  priorityExcluded: false,
  actionsInitialized: false,
  actions: [],
});
export const priorityRecord = (diagnosisId = "") => ({
  id: uid(),
  diagnosisId,
  risk: "",
  window: "",
  anomalies: "",
});
export const immediateRecord = () => ({ id: uid(), area: "", action: "" });
export const preventiveRecord = () => ({
  id: uid(),
  risk: "",
  window: "",
  description: "",
  action: "",
  objective: "",
  operator: "",
  role: "",
  status: "",
});
export const diagnosisHasContent = row =>
  [row.area, row.element, row.pathology, row.causes, row.risk, row.resolvedDate]
    .some(value => String(value || "").trim());

/** Restituisce il degrado da cui viene ereditata l'urgenza. */
export function inheritedRiskSource(state, path) {
  const keys = path.split(".");
  if (keys[0] === "diagnosis" && keys[2] === "actions" && keys[4] === "risk")
    return state.diagnosis[Number(keys[1])] || null;
  if (keys[0] === "priorities" && keys[2] === "risk") {
    const id = state.priorities[Number(keys[1])]?.diagnosisId;
    return id ? state.diagnosis.find(row => row.id === id) || null : null;
  }
  return null;
}

/** Aggiorna i dati derivati; la lettura delle copie storiche non genera nuovi blocchi. */
export function syncDiagnosticLinks(state, { createPriorities = true, createActions = createPriorities, diagnosisId = null } = {}) {
  let changed = false;
  const sources = new Map(state.diagnosis.map(row => [row.id, row]));
  const kept = state.priorities.filter(priority => !priority.diagnosisId ||
    (sources.has(priority.diagnosisId) && !sources.get(priority.diagnosisId).priorityExcluded));
  if (kept.length !== state.priorities.length) {
    state.priorities = kept;
    changed = true;
  }
  const inherit = (record, risk) => {
    if (record.risk !== risk) { record.risk = risk; changed = true; }
    if (record.window && !windowsForRisk(risk).includes(record.window)) {
      record.window = "";
      changed = true;
    }
  };
  const linked = new Set();
  for (const priority of state.priorities) {
    if (!priority.diagnosisId) continue;
    linked.add(priority.diagnosisId);
    if (!diagnosisId || priority.diagnosisId === diagnosisId)
      inherit(priority, sources.get(priority.diagnosisId).risk);
  }
  for (const row of state.diagnosis) {
    if (diagnosisId && row.id !== diagnosisId) continue;
    if (createActions && !row.actionsInitialized && !row.resolvedDate && diagnosisHasContent(row)) {
      if (!row.actions.length) row.actions.push(preventiveRecord());
      row.actionsInitialized = true;
      changed = true;
    }
    for (const action of row.actions) inherit(action, row.risk);
    if (createPriorities && diagnosisHasContent(row) && !row.priorityExcluded && !linked.has(row.id)) {
      state.priorities.push({ ...priorityRecord(row.id), risk: row.risk });
      linked.add(row.id);
      changed = true;
    }
  }
  return changed;
}

export function newState(assetId) {
  const openedAt = new Date(), date = localDate(openedAt);
  return {
    app: APP_ID,
    schemaVersion: SCHEMA_VERSION,
    createdAt: openedAt.toISOString(),
    updatedAt: openedAt.toISOString(),
    assetId,
    survey: { id: uid(), date, notes: "" },
    surveys: [],
    photoArchive: [],
    updateBaseline: null,
    filename: "",
    customFilename: false,
    section: 0,
    editorVersion: EDITOR_LAYOUT_VERSION,
    filenameDate: openedAt.toISOString(),
    general: {
      id: "",
      date,
      time: localTime(openedAt),
      object: "",
      chronology: "",
      author: "",
      altitude: "",
      distance: "",
      complex: COMMON.complex,
      owner: COMMON.owner,
      subject: "",
      height: "",
      width: "",
      depth: "",
      materials: "",
    },
    history: {
      restorations: [],
      maintenance: [],
    },
    conditions: [],
    diagnosis: [],
    priorities: [],
    inspectionNotes: "",
    photos: [],
    immediate: {
      date,
      executedDate: "",
      records: [],
      notes: "",
    },
    preventive: { date, notes: "" },
  };
}
/** Giorno locale dell'apertura, indipendente dalle date compilate nel documento.
 * Accetta timestamp ISO e sola data, presente in alcune versioni precedenti. */
export function filenameDay(state) {
  const value = state.filenameDate || state.createdAt;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : localDate(new Date(value));
}
/** Le vecchie bozze con sola data recuperano l'ora dalla creazione, senza usare
 * l'ora corrente: ripresa e salvataggi successivi mantengono lo stesso nome. */
export function filenameTime(state) {
  const value = state.filenameDate;
  const timestamp = value && !/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : state.createdAt;
  return localTime(new Date(timestamp)).replace(":", "-");
}
export function baseName(state, assets) {
  if (state.customFilename && state.filename.trim())
    return safeFilename(state.filename);
  const asset = assets.find(item => item.id === state.assetId);
  const date = filenameDay(state);
  const prefix = `scheda_ispezione_periodica_${asset?.fileLabel || "Bene"}_ID_`;
  const suffix = "_" + date + "_" + filenameTime(state);
  const identifier = (String(state.general.id || "").trim() || `XX.XX_${date.slice(0, 4)}`)
    .normalize("NFC")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .replace(/\s+/g, "_");
  // Riserva lo spazio per prefisso e data anche con identificativi molto lunghi.
  const id = identifier.slice(0, Math.max(1, 160 - prefix.length - suffix.length));
  return safeFilename(prefix + id + suffix);
}
export function safeFilename(name) {
  return (
    name
      .normalize("NFC")
      .trim()
      .replace(/\.(docx|pdf|json|zip)$/i, "")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
      .replace(/[. ]+$/, "")
      .slice(0, 160) || "Scheda_Restauro"
  );
}
export function formatMeasure(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (!/^-?(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?$/.test(raw))
    throw Error(
      "Inserisci un numero con virgola per i decimali, per esempio 1.950,50.",
    );
  const [whole, fraction] = raw.replaceAll(".", "").split(",");
  const negative = whole.startsWith("-");
  const digits = whole.replace("-", "").replace(/^0+(?=\d)/, "");
  return (
    (negative ? "-" : "") +
    digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
    (fraction !== undefined ? "," + fraction : "")
  );
}
export const measureText = (value) =>
  value ? `${formatMeasure(value)} m` : "";
export const displayDate = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value || "") ? value.split("-").reverse().join("/") : String(value || "");
export function displayMonth(value) {
  if (!value) return "";
  const [y, m] = value.split("-");
  return `${["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"][Number(m) - 1]} ${y}`;
}
/** I dati del catalogo inizializzano le nuove schede; la lettura di JSON e bozze
 * conserva i valori salvati, comprese le correzioni e i campi svuotati. */
export function applyFixed(state, assets, { initialize = true } = {}) {
  const selected = assets.find((a) => a.id === state.assetId);
  const fixed = selected?.fixed || {};
  state.assetSnapshot = selected ? structuredClone(selected) : null;
  if (initialize) {
    if (!state.general.object && selected) state.general.object = fixed.object || selected.label;
    for (const key of Object.keys(state.general))
      if (Object.hasOwn(fixed, key)) state.general[key] = String(fixed[key]);
  }
  if (state.assetSnapshot)
    for (const key of Object.keys(fixed))
      if (Object.hasOwn(state.general, key)) state.assetSnapshot.fixed[key] = state.general[key];
  state.fixedCommon = { ...COMMON, complex: state.general.complex, owner: state.general.owner };
  return state;
}
export const isGeneralBold = (state, key) => state.assetSnapshot?.boldFields?.includes(key) === true;
export function parseState(input, assets, { allowIncomplete = false } = {}) {
  if (!input || input.app !== APP_ID || ![1, SCHEMA_VERSION].includes(input.schemaVersion))
    throw Error(
      "JSON non compatibile. Usa una scheda esportata da questa versione. Le bozze precedenti rimangono nel browser.",
    );
  if (!assets.some((a) => a.id === input.assetId))
    throw Error("Il bene indicato nel JSON non è disponibile.");
  const out = newState(input.assetId);
  const text = (v) => (typeof v === "string" ? v : "");
  const arr = (v) => {
    if (!Array.isArray(v))
      throw Error("Struttura JSON non valida: elenco mancante.");
    return v;
  };
  const date = (v, month = false) => {
    v = text(v);
    if (!v) return "";
    if (
      month
        ? !/^\d{4}-(0[1-9]|1[0-2])$/.test(v)
        : !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(v)
    )
      throw Error("Data JSON non valida.");
    if (!month && localDate(new Date(v + "T12:00:00")) !== v)
      throw Error("Data JSON non valida.");
    return v;
  };
  const choice = (v, list) => {
    v = text(v);
    if (v && !list.includes(v)) throw Error("Scelta JSON non riconosciuta.");
    return v;
  };
  const records = (values, factory, keys) =>
    arr(values).map((value) => {
      if (!value || typeof value !== "object")
        throw Error("Riga JSON non valida.");
      const row = factory();
      row.id = text(value.id) || row.id;
      for (const k of keys) row[k] = text(value[k]);
      return row;
    });
  out.createdAt = text(input.createdAt);
  if (!Number.isFinite(Date.parse(out.createdAt)))
    throw Error("Data di creazione non valida.");
  out.updatedAt = Number.isFinite(Date.parse(input.updatedAt)) ? input.updatedAt : out.createdAt;
  out.filenameDate = Number.isFinite(Date.parse(input.filenameDate)) ? input.filenameDate : "";
  out.filename = safeFilename(text(input.filename));
  out.customFilename = input.customFilename === true;
  out.section = importedSection(input.section, input.editorVersion);
  const defaults = assets.find(asset => asset.id === input.assetId)?.fixed || {};
  for (const key of Object.keys(out.general)) {
    // Le schede precedenti conservavano questi valori soltanto nei dati fissi.
    // Una correzione esplicitamente vuota deve invece rimanere vuota.
    if (["complex", "owner"].includes(key) && !Object.hasOwn(input.general || {}, key))
      out.general[key] = typeof input.fixedCommon?.[key] === "string" ? input.fixedCommon[key] : COMMON[key];
    else if (!Object.hasOwn(input.general || {}, key) && Object.hasOwn(defaults, key))
      out.general[key] = String(defaults[key]);
    else out.general[key] = text(input.general?.[key]);
  }
  out.fixedCommon = { ...COMMON, complex: out.general.complex, owner: out.general.owner };
  out.general.date = date(out.general.date);
  if (out.general.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(out.general.time))
    throw Error("Ora JSON non valida.");
  for (const k of ["altitude", "distance", "height", "width", "depth"]) {
    try {
      out.general[k] = formatMeasure(out.general[k]);
    } catch (error) {
      if (!allowIncomplete) throw error;
    }
  }
  out.history.restorations = records(
    input.history?.restorations,
    historyRecord,
    ["date", "action"],
  );
  out.history.maintenance = records(input.history?.maintenance, historyRecord, [
    "date",
    "action",
  ]);
  out.conditions = records(input.conditions, conditionRecord, [
    "date",
    "exposure",
    "assessment",
  ]);
  out.conditions.forEach((r, i) => {
    r.date = date(r.date || input.general?.date);
    r.methods = arr(input.conditions[i].methods)
      .map((m) => choice(m, METHODS))
      .filter(Boolean);
  });
  out.diagnosis = records(input.diagnosis, diagnosisRecord, [
    "area",
    "element",
    "reference",
    "detectedDate",
    "pathology",
    "causes",
    "risk",
    "resolvedDate",
    "resolvedAction",
  ]);
  out.diagnosis.forEach((r, i) => {
    r.reference = r.reference || "D" + String(i + 1).padStart(2, "0");
    r.detectedDate = date(r.detectedDate || input.general?.date);
    r.risk = choice(r.risk, RISKS);
    r.resolvedDate = date(r.resolvedDate);
    r.priorityExcluded = input.diagnosis[i].priorityExcluded === true;
    r.actionsInitialized = input.diagnosis[i].actionsInitialized === true || input.diagnosis[i].actions?.length > 0;
    r.actions = records(input.diagnosis[i].actions, preventiveRecord, [
      "risk",
      "window",
      "description",
      "action",
      "objective",
      "operator",
      "role",
      "status",
    ]);
    for (const a of r.actions) {
      a.risk = choice(a.risk, RISKS);
      a.window = choice(a.window, [...WINDOWS, ...HIGH_WINDOWS]);
      a.role = choice(a.role, ROLES);
      a.status = choice(a.status, STATUSES);
    }
  });
  out.priorities = records(input.priorities, priorityRecord, [
    "diagnosisId",
    "risk",
    "window",
    "anomalies",
  ]);
  for (const r of out.priorities) {
    r.risk = choice(r.risk, RISKS);
    r.window = choice(r.window, [...WINDOWS, ...HIGH_WINDOWS]);
    if (r.diagnosisId && !out.diagnosis.some(row => row.id === r.diagnosisId))
      throw Error("Priorità collegata a un degrado mancante.");
  }
  const linkedPriorities = out.priorities.map(row => row.diagnosisId).filter(Boolean);
  if (new Set(linkedPriorities).size !== linkedPriorities.length)
    throw Error("Più priorità collegate allo stesso degrado.");
  out.inspectionNotes = text(input.inspectionNotes);
  const photo = (p) => {
    if (
      !p ||
      !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\s]+$/.test(
        p.data || "",
      )
    )
      throw Error("Fotografia JSON non valida.");
    if (
      !Number.isFinite(p.width) ||
      !Number.isFinite(p.height) ||
      p.width <= 0 ||
      p.height <= 0
    )
      throw Error("Dimensioni fotografia non valide.");
    return { id: text(p.id) || uid(), data: p.data, width: p.width, height: p.height, surveyDate: date(p.surveyDate || input.general?.date), insertedDate: date(p.insertedDate || p.surveyDate || input.general?.date), caption: text(p.caption) };
  };
  out.photos = arr(input.photos).map(photo);
  out.photoArchive = arr(input.photoArchive || []).map(photo);
  out.immediate.date = date(input.immediate?.date);
  out.immediate.executedDate = date(input.immediate?.executedDate);
  out.immediate.records = records(input.immediate?.records, immediateRecord, [
    "area",
    "action",
  ]);
  out.immediate.notes = text(input.immediate?.notes);
  out.preventive.date = date(input.preventive?.date);
  out.preventive.notes = text(input.preventive?.notes);
  const survey = (value, fallback = {}) => ({
    id: text(value?.id) || fallback.id || uid(),
    date: date(value?.date || fallback.date),
    notes: text(value?.notes),
  });
  out.survey = survey(input.survey, { date: out.general.date });
  const photoById = new Map([...out.photoArchive, ...out.photos].map(p => [p.id, p]));
  out.surveys = arr(input.surveys || []).map(entry => {
    const meta = survey(entry);
    if (!entry.data || typeof entry.data !== "object") throw Error("Sopralluogo JSON non valido.");
    const photos = arr(entry.data.photoIds || []).map(id => {
      if (!photoById.has(id)) throw Error("Fotografia dello storico mancante nel JSON.");
      return photoById.get(id);
    });
    // Riutilizza la validazione senza introdurre uno storico ricorsivo.
    const parsed = parseState({ ...out, ...entry.data, photos, survey: meta,
      surveys: [], photoArchive: [], updateBaseline: null },
      assets.map(a => ({ ...a, fixed: {} })), { allowIncomplete });
    const data = surveyData(parsed);
    // Le descrizioni sono versionate; i dati binari rimangono una sola volta nel JSON.
    if (entry.data.photoDetails) {
      const details = arr(entry.data.photoDetails);
      if (new Set(details.map(p => p?.id)).size !== details.length)
        throw Error("Metadati fotografici dello storico duplicati.");
      const byId = new Map(details.map(p => [text(p?.id), p]));
      if (details.length !== data.photoIds.length || data.photoIds.some(id => !byId.has(id)))
        throw Error("Metadati fotografici dello storico non coerenti.");
      data.photoDetails = data.photoIds.map(id => {
        const p = byId.get(id);
        return { id, caption: text(p.caption), insertedDate: date(p.insertedDate),
          surveyDate: date(p.surveyDate || meta.date) };
      });
    }
    return { ...meta, recordedAt: text(entry.recordedAt), data };
  });
  if (new Set(out.surveys.map(v => v.id)).size !== out.surveys.length)
    throw Error("Identificativi dei sopralluoghi duplicati.");
  for (const list of [out.diagnosis, out.conditions, out.history.restorations,
    out.history.maintenance, out.priorities, out.immediate.records,
    out.diagnosis.flatMap(row => row.actions), out.photos, out.photoArchive])
    if (new Set(list.map(r => r.id)).size !== list.length) throw Error("Identificativi delle righe duplicati.");
  for (const p of out.photos) {
    const archived = out.photoArchive.find(a => a.id === p.id);
    if (archived && archived.data !== p.data)
      throw Error("Fotografie con lo stesso identificativo e contenuti differenti.");
  }
  if (input.updateBaseline) {
    const baseline = input.updateBaseline;
    const ids = key => arr(baseline[key] || []).map(text).filter(Boolean);
    out.updateBaseline = { conditions: ids("conditions"), diagnosis: ids("diagnosis"),
      restorations: ids("restorations"), maintenance: ids("maintenance"), actions: ids("actions"),
      priorities: ids("priorities"), immediate: ids("immediate"), resolved: ids("resolved") };
    // Completa i blocchi dei JSON delle versioni precedenti dal sopralluogo chiuso.
    const previous = out.surveys.filter(v => v.id !== out.survey.id).at(-1)?.data;
    if (previous) {
      if (!baseline.priorities) out.updateBaseline.priorities = previous.priorities.map(r => r.id);
      if (!baseline.immediate) out.updateBaseline.immediate = previous.immediate.records.map(r => r.id);
      if (!baseline.resolved) out.updateBaseline.resolved = previous.diagnosis.filter(r => r.resolvedDate).map(r => r.id);
    }
  }
  return applyFixed(out, assets, { initialize: false });
}

/** Dati immutabili di un sopralluogo. Le foto sono referenziate, mai duplicate. */
export function surveyData(state, { clone = true } = {}) {
  const keys = ["general", "history", "conditions", "diagnosis", "priorities",
    "inspectionNotes", "immediate", "preventive"];
  const data = Object.fromEntries(keys.map(key => [key, state[key]]));
  data.photoIds = state.photos.map(p => p.id);
  data.photoDetails = state.photos.map(({ id, caption = "", insertedDate = "", surveyDate = "" }) =>
    ({ id, caption, insertedDate, surveyDate }));
  return clone ? structuredClone(data) : data;
}
