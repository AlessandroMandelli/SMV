import { displayDate, immediateRows, measureText } from "./model.js";
import { photoIndex, photosForSurvey, preventiveRows } from "./surveys.js";

const escape = value => String(value ?? "").replace(/[&<>"']/g, char =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const content = value => escape(value || "—");
const labels = {
  date: "Data", exposure: "Esposizione", assessment: "Valutazione sintetica",
  action: "Azione", area: "Macro-Area", element: "Elemento", pathology: "Patologia",
  causes: "Cause principali", risk: "Grado d’urgenza", resolvedDate: "Risolto in data",
  resolvedAction: "Azioni condotte in loco", reference: "ID",
  detectedDate: "Data del rilievo", description: "Descrizione", objective: "Obiettivo",
  operator: "Operatore", role: "Qualifica", status: "Stato", window: "Finestra d’intervento",
  anomalies: "Anomalie attese", id: "ID scheda", time: "Ora", object: "Oggetto",
  chronology: "Cronologia", author: "Autore", altitude: "Quota s.l.m.",
  distance: "Distanza dal Santuario", subject: "Soggetto", height: "Altezza H",
  width: "Larghezza L", depth: "Profondità P", materials: "Materie e tecniche",
  complex: "Complesso", owner: "Ente proprietario",
};
const measures = new Set(["altitude", "distance", "height", "width", "depth"]);

function field(key, value) {
  if (key === "date" || key.endsWith("Date")) value = displayDate(value);
  if (measures.has(key) && value) {
    try { value = measureText(value); } catch { /* Una bozza può contenere una misura incompleta. */ }
  }
  return `<p><strong>${labels[key] || key}:</strong> ${content(value)}</p>`;
}
function card(row, keys = Object.keys(row).filter(key =>
  !["id", "diagnosisId"].includes(key) && typeof row[key] === "string" && row[key].trim())) {
  const methods = row.methods?.length ? `<p><strong>Metodologia ispezione:</strong> ${content(row.methods.join(", "))}</p>` : "";
  return `<div class="history-record">${keys.map(key => field(key, row[key])).join("")}${methods}</div>`;
}
const note = value => value ? `<p class="history-note"><strong>Note aggiuntive:</strong> ${escape(value)}</p>` : "";
const records = rows => rows.length ? rows.map(row => card(row)).join("") : "<p>Nessuna voce compilata.</p>";
function intervention(row, fallbackDate) {
  const headers = ["ID", "Macro-Area", "Elemento", "Patologia", "Cause principali", "Eseguito in data"];
  const values = [row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row.date || fallbackDate)];
  const columns = [5, 18, 18, 26, 21, 12].map(width => `<col style="width:${width}%">`).join("");
  return `<div class="history-record"><div class="table-wrap"><table class="context-table"><colgroup>${columns}</colgroup><thead><tr>${headers.map(label => `<th scope="col">${label}</th>`).join("")}</tr></thead><tbody><tr>${values.map(value => `<td>${content(value)}</td>`).join("")}</tr></tbody></table></div>${field("resolvedAction", row.action)}</div>`;
}
function priorities(data) {
  const sources = new Map(data.diagnosis.map(row => [row.id, row.reference]));
  return data.priorities.map((row, index) => {
    const reference = sources.get(row.diagnosisId);
    const title = reference ? "Priorità " + reference : "Priorità preesistente · " + (index + 1);
    return `<h4>${content(title)}</h4>${card(row)}`;
  }).join("") || "<p>Nessuna voce compilata.</p>";
}

/** Mostra soltanto i dati della pagina richiesta, senza ricopiare tutte le visite. */
export function historyPage(data, section, images = new Map(), previousVisits = []) {
  switch (section) {
    case "context":
      return Object.entries(data.general).map(([key, value]) => field(key, value)).join("");
    case "history":
      return `<h3>Interventi di restauro precedenti</h3>${records(data.history.restorations)}<h3>Interventi di manutenzione precedenti</h3>${records(data.history.maintenance)}`;
    case "conditions":
      return records(data.conditions);
    case "diagnosis":
      return data.diagnosis.map(row => card(row, ["reference", "area", "element", "pathology", "causes", "risk", "detectedDate", "resolvedDate"])).join("") +
        `<h3>Indice di priorità</h3>${priorities(data)}${note(data.inspectionNotes)}`;
    case "photos": {
      const photos = photosForSurvey(data, images);
      return photos.length ? `<div class="photo-grid">${photos.map(photo =>
        `<article><img loading="lazy" src="${escape(photo.data)}" alt="Fotografia del sopralluogo"><p>Inserita il ${content(displayDate(photo.insertedDate || photo.surveyDate))}</p><p>${content(photo.caption)}</p></article>`).join("")}</div>` : "<p>Nessuna fotografia inserita.</p>";
    }
    case "immediate": {
      const references = new Map(data.diagnosis.map(row => [row.id, row.reference]));
      const rows = immediateRows(data).map(row => ({ ...row, reference: references.get(row.id) || "" }));
      return (rows.length ? rows.map(row => intervention(row, data.immediate.executedDate)).join("") : records([])) + note(data.immediate.notes);
    }
    case "preventive":
      return preventiveRows(data, previousVisits).filter(row => row.actions.length).map(row =>
        `<h3>${content(row.reference)} · ${content(row.area)} · ${content(row.pathology)}</h3>${row.element ? field("element", row.element) : ""}${row.causes ? field("causes", row.causes) : ""}${row.detectedDate ? field("detectedDate", row.detectedDate) : ""}${row.resolvedDate ? `<p><strong>RISOLTO IN DATA ${content(displayDate(row.resolvedDate))}</strong></p>` : ""}${records(row.actions)}`).join("") + note(data.preventive.notes);
    default:
      return "";
  }
}

export function historyHtml(state, section) {
  const visits = state.surveys.filter(visit => visit.id !== state.survey.id);
  if (!visits.length) return "<p>Nessun sopralluogo precedente per questa scheda.</p>";
  const images = section === "photos" ? photoIndex(state) : new Map();
  return visits.map((visit, index) => `<details class="visit-history"><summary>Sopralluogo del ${content(displayDate(visit.date))}</summary><div class="historic-page">${historyPage(visit.data, section, images, visits.slice(0, index))}</div></details>`).join("");
}
