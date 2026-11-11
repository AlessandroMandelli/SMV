import { ROAD_SIZE, ROAD_SVG_POINTS, mapAssets } from "./road.js";
import {
  SECTIONS,
  RISKS,
  windowsForRisk,
  METHODS,
  ROLES,
  STATUSES,
  newState,
  displayDate,
  baseName,
  formatMeasure,
  applyFixed,
  parseState,
  historyRecord,
  conditionRecord,
  diagnosisRecord,
  preventiveRecord,
  inheritedRiskSource,
  syncDiagnosticLinks,
  isGeneralBold,
} from "./model.js";
import { beginSurvey, registerSurvey, suggestedSurveyDate, lockedPath, lockedRemoval, nextReference, archivePhoto, preventiveRows } from "./surveys.js";
import * as storage from "./storage.js";
import { ASSETS } from "./catalog.js";
import { migrateLegacy } from "./legacy.js";
import { buildExportFiles } from "./documents.js";
import { historyHtml } from "./history-view.js";
import { readPhoto } from "./photos.js";
import { initDialogs } from "./dialogs.js";
import { editField, purgeRecord } from "./corrections.js";
import { SECTION_DEFINITIONS } from "./sections.js";
import { VERSION, PWA_URL } from "./config.js";
import { ExportFiles } from "./export.js";
import { initHomeTitle } from "./home-title.js";
import { checkForUpdates, rememberUpdateView, takeUpdateView } from "./updates.js";

const $ = (id) => document.getElementById(id);
const exportFiles = new ExportFiles($("exportReady"), notify);
const updateView = takeUpdateView();
// Permessi temporanei per pagina: non fanno parte della bozza né del JSON.
const unlockedPages = new Set();
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let assets = [],
  state = null,
  draftAvailable = false,
  storageReady = false,
  saveTimer,
  saveChain = Promise.resolve(),
  revision = 0,
  savedRevision = 0,
  toastTimer,
  busy = false,
  pendingImport = null;
function notify(message) {
  $("toast").textContent = message;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").hidden = true), 6500);
}
function showMessage(title, message) {
  $("dialogTitle").textContent = title;
  $("dialogMessage").textContent = message;
  $("messageDialog").showModal();
}
function get(path) {
  return path.split(".").reduce((o, k) => o?.[k], state) ?? "";
}
function pageUnlocked() {
  return !!state && unlockedPages.has(SECTION_DEFINITIONS[state.section].key);
}
function fieldIsLocked(path) {
  return !!inheritedRiskSource(state, path) || (!pageUnlocked() && lockedPath(state, path));
}
function removalIsLocked(data) {
  return !pageUnlocked() && lockedRemoval(state, data);
}
function syncPageLock() {
  const unlocked = pageUnlocked();
  const label = (unlocked ? "Blocca la pagina" : "Sblocca la pagina") +
    (state ? ": " + SECTION_DEFINITIONS[state.section].label : "");
  $("pageLockButton").setAttribute("aria-pressed", String(unlocked));
  $("pageLockButton").setAttribute("aria-label", label);
  $("pageLockButton").title = label;
  $("pageLockShackle").setAttribute("d", unlocked
    ? "M8 11V7a4 4 0 0 1 7.5-2"
    : "M8 11V7a4 4 0 0 1 8 0v4");
}
function set(path, value) {
  if (fieldIsLocked(path)) return;
  return editField(state, path, value, { correction: pageUnlocked() });
}
function asset() {
  return assets.find((a) => a.id === state?.assetId);
}
function currentName() {
  return baseName(state, assets);
}
function syncFilename() {
  if (!state) return;
  const name = currentName();
  if (!state.customFilename) state.filename = name;
  if (document.activeElement !== $("filename"))
    $("filename").value = name;
}
function changed() {
  exportFiles.clear();
  state.updatedAt = new Date().toISOString();
  revision++;
  draftAvailable = true;
  $("resumeButton").disabled = false;
  $("saveStatus").textContent = "Salvataggio…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persist, 250);
  syncFilename();
}
function persist() {
  clearTimeout(saveTimer);
  if (!state) return saveChain;
  const copy = structuredClone(state),
    version = revision;
  saveChain = saveChain
    .catch(() => {})
    .then(async () => {
      try {
        if (!storageReady) throw Error("Archivio non disponibile");
        await storage.saveDraft(copy);
        savedRevision = version;
        if (version === revision) $("saveStatus").textContent = "Bozza salvata";
        return true;
      } catch {
        $("saveStatus").textContent = "Bozza non salvata";
        notify(
          "Salvataggio locale non riuscito. Mantieni aperta la scheda e salvala prima di uscire.",
        );
        return false;
      }
    });
  return saveChain;
}
function show(view) {
  for (const name of ["home", "editor"]) $(name).hidden = name !== view;
  $("options").open = false;
  $("homeOptions").open = false;
  if (view === "home") {
    unlockedPages.clear();
    syncPageLock();
  }
  window.scrollTo(0, 0);
  if (view === "editor") render();
}
function field(
  label,
  path,
  {
    type = "text",
    wide = false,
    multiline = false,
    fixed = false,
    value,
    unit = false,
  } = {},
) {
  const val = value ?? get(path);
  const bold = path.startsWith("general.") && isGeneralBold(state, path.split(".")[1]);
  fixed = fixed || fieldIsLocked(path);
  const read = fixed ? ' readonly aria-readonly="true"' : "";
  const common = `data-path="${escape(path)}"${bold ? ' class="field-value-bold"' : ""}${read}${unit ? ' data-measure="true" inputmode="decimal"' : ""}`;
  const control = multiline
    ? `<textarea ${common} rows="3">${escape(val)}</textarea>`
    : `<input type="${type}" ${common} value="${escape(val)}"${unit ? ' placeholder="m"' : ""}>`;
  return `<label class="field${wide ? " wide" : ""}"><span>${escape(label)}${fixed ? ' <span aria-label="non modificabile">🔒</span>' : ""}${unit ? " <small>(m)</small>" : ""}</span>${control}</label>`;
}
function fixedField(label, value, wide = true) {
  return field(label, "", { fixed: true, value, wide });
}
function band(title) {
  return `<h2 class="section-heading">${escape(title)}</h2>`;
}
function removeButton(action, index, extra = "") {
  return `<button type="button" class="remove" data-action="${action}" data-index="${index}" ${extra}>Rimuovi</button>`;
}
function addButton(label, action, extra = "") {
  return `<button class="add-button" type="button" data-action="${action}" ${extra}>＋ ${escape(label)}</button>`;
}
function riskField(label, path) {
  const value = get(path);
  const source = inheritedRiskSource(state, path);
  const title = source ? ` title="Ereditato dal livello di rischio di ${escape(source.reference)}"` : "";
  return `<label class="field"><span>${escape(label)}</span><select ${fieldIsLocked(path) ? 'disabled aria-readonly="true"' : ""}${title} data-path="${path}" class="risk-${String(value).toLowerCase().replace("basso", "low").replace("medio", "medium").replace("alto", "high")}"><option value="">—</option>${RISKS.map((r) => `<option${r === value ? " selected" : ""}>${r}</option>`).join("")}</select></label>`;
}
function choices(label, path, values, multiple = false) {
  const value = get(path);
  const disabled = fieldIsLocked(path) ? " disabled" : "";
  return `<fieldset class="choice-group"><legend>${escape(label)}</legend><div class="choices">${values.map((v, i) => `<label><input${disabled} type="${multiple ? "checkbox" : "radio"}" name="${path}" value="${escape(v)}" data-path="${path}"${multiple ? ' data-multiple="true"' : ""}${multiple ? (Array.isArray(value) && value.includes(v) ? " checked" : "") : value === v ? " checked" : ""}>${escape(v)}</label>`).join("")}</div></fieldset>`;
}
function mapHtml() {
  const locked = !pageUnlocked();
  const checks = mapAssets(assets, state.assetId).map(item =>
    `<button type="button" class="map-check${item.id === state.assetId ? " selected" : ""}" role="checkbox" aria-checked="${item.id === state.assetId}" aria-disabled="${locked}" ${locked ? "disabled" : ""} data-map-asset="${item.id}" aria-label="${escape(item.label)}" title="${escape(item.label)}" style="left:${item.x}%;top:${item.y}%">${item.id === state.assetId ? "✓" : ""}</button>`).join("");
  const road = state.assetId === "strada" ? `<svg class="map-road" viewBox="0 0 ${ROAD_SIZE.width} ${ROAD_SIZE.height}" aria-label="Viale del Santuario e delle Cappelle selezionato"><polyline points="${ROAD_SVG_POINTS}" /></svg>` : "";
  return `<aside class="map-panel"><h2>LOCALIZZAZIONE BENE</h2><div class="map-frame"><img src="./assets/map.jpg" alt="Planimetria del percorso del Sacro Monte di Varese">${road}${checks}</div></aside>`;
}
function firstSection() {
  const general = (label, key, options = {}) =>
    field(label, "general." + key, options);
  return `<div class="first-layout"><div><div class="fields">${field("ID scheda", "general.id", { wide: true })}${field("Data", "general.date", { type: "date" })}${field("Ora", "general.time", { type: "time" })}</div>
  ${band("1. IDENTIFICAZIONE DEL BENE")}<div class="fields">${general("Oggetto", "object", { wide: true })}${general("Cronologia", "chronology")}${general("Autore", "author")}${general("Quota s.l.m.", "altitude", { unit: true })}${general("Distanza dal Santuario", "distance", { unit: true })}${general("Complesso", "complex", { wide: true })}${general("Ente proprietario", "owner", { wide: true })}</div>
  ${band("2. SOGGETTO E DATI TECNICO-DIMENSIONALI")}<div class="fields">${general("Soggetto", "subject", { wide: true, multiline: true })}</div><div class="fields three wide-note">${general("Altezza H", "height", { unit: true })}${general("Larghezza L", "width", { unit: true })}${general("Profondità P", "depth", { unit: true })}</div><div class="wide-note">${general("Materie e Tecniche", "materials", { multiline: true })}</div></div>${mapHtml()}</div>`;
}
function historyCards(key, title) {
  return `${band(title)}${state.history[key].map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>${escape(title)} · ${i + 1}</h3>${removeButton("remove-history", i, `data-key="${key}"`)}</div><div class="fields">${field("Data", `history.${key}.${i}.date`)}${field("Azione", `history.${key}.${i}.action`, { multiline: true, wide: true })}</div></article>`).join("")}<div class="repeat-actions">${addButton("Aggiungi intervento", "add-history", `data-key="${key}"`)}</div>`;
}
function historySection() {
  return `${band("3. STORICO MANUTENTIVO")}${historyCards("restorations", "Interventi di RESTAURO precedenti")}${historyCards("maintenance", "Interventi di MANUTENZIONE precedenti")}`;
}
function conditionsSection() {
  return `${band("4. STATO CONSERVATIVO ATTUALE")}${state.conditions.map((r, i) => `<article class="repeat-card condition-card"><div class="card-top"><h3>Stato conservativo · ${i + 1}</h3>${removeButton("remove-condition", i)}</div>${field("Data del rilievo", `conditions.${i}.date`, { type: "date" })}${field("Esposizione", `conditions.${i}.exposure`)}${choices("Metodologia Ispezione", `conditions.${i}.methods`, METHODS, true)}${field("Valutazione sintetica", `conditions.${i}.assessment`, { multiline: true })}</article>`).join("")}<div class="repeat-actions">${addButton("Aggiungi stato conservativo", "add-condition")}</div>`;
}
const diagnosisHeaders = [
  "ID",
  "Macro-Area",
  "Elemento",
  "Patologia riscontrata",
  "Cause principali",
  "Livello di rischio",
  "Data del rilievo",
  "Risolto in data",
];
function diagnosisRow(row, index) {
  const path = `diagnosis.${index}`;
  return `<tr role="row">
    <td role="cell" class="diagnosis-id"><span class="diagnosis-id-label">ID</span><div class="diagnosis-id-controls"><strong class="degradation-reference">${escape(row.reference)}</strong><button type="button" class="remove diagnosis-remove" data-action="remove-diagnosis" data-index="${index}" aria-label="Rimuovi riga ${escape(row.reference)}" title="Rimuovi riga ${escape(row.reference)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button></div></td>
    ${["area", "element", "pathology", "causes"].map((key, column) =>
      `<td role="cell">${field(diagnosisHeaders[column + 1], path + "." + key, { multiline: true })}</td>`,
    ).join("")}
    <td role="cell">${riskField("Livello di rischio", path + ".risk")}</td>
    <td role="cell">${field("Data del rilievo", path + ".detectedDate", { type: "date" })}</td>
    <td role="cell">${field("Risolto in data", path + ".resolvedDate", { type: "date" })}</td>
  </tr>`;
}
function diagnosisSection() {
  const table = `<div class="table-wrap"><table class="diagnosis-table" role="table"><thead role="rowgroup"><tr role="row">${diagnosisHeaders.map(header => `<th role="columnheader" scope="col">${header}</th>`).join("")}</tr></thead><tbody role="rowgroup">${state.diagnosis.map(diagnosisRow).join("")}</tbody></table></div>`;
  return band("5. DIAGNOSTICA DEL DEGRADO E PRIORITÀ DI INTERVENTO") + table +
    `<div class="repeat-actions">${addButton("Aggiungi riga", "add-diagnosis")}</div>` +
    band("INDICE DI PRIORITÀ E TEMPISTICHE DI INTERVENTO") +
    `<div id="priorityCards">${priorityCards()}</div>` +
    `<div class="wide-note">${field("Note aggiuntive", "inspectionNotes", { multiline: true })}</div>`;
}
function priorityCards() {
  const sources = new Map(state.diagnosis.map(row => [row.id, row]));
  return state.priorities.map((priority, index) => {
    const source = sources.get(priority.diagnosisId);
    const title = source ? "Priorità " + source.reference : "Priorità preesistente · " + (index + 1);
    const disabled = removalIsLocked({ action: "remove-priority", index: String(index) }) ? "disabled" : "";
    return `<article class="repeat-card priority-card"><div class="card-top"><h3>${escape(title)}</h3>${removeButton("remove-priority", index, disabled)}</div>${riskField("Grado d’urgenza", `priorities.${index}.risk`)}${choices("Finestra d’intervento programmata", `priorities.${index}.window`, windowsForRisk(priority.risk))}${field("Anomalie attese", `priorities.${index}.anomalies`, { multiline: true })}</article>`;
  }).join("");
}
function refreshPriorities() {
  const container = $("priorityCards");
  if (container) container.innerHTML = priorityCards();
}
function photosSection() {
  return `${band("6. ATLANTE FOTOGRAFICO")}<div class="photo-actions"><button type="button" data-action="camera" class="primary">Scatta foto</button><button type="button" data-action="photos">Carica foto</button></div><div class="photo-grid">${state.photos.map((p, i) => `<article class="photo-card"><img src="${escape(p.data)}" alt="Fotografia ${i + 1}"><div><span>Foto ${i + 1} · Inserita il ${escape(displayDate(p.insertedDate || p.surveyDate))}</span>${removeButton("remove-photo", i)}</div>${field("Didascalia", `photos.${i}.caption`, { multiline: true })}</article>`).join("")}</div>${!state.photos.length ? '<p class="empty">Aggiungi le fotografie del sopralluogo.</p>' : ""}`;
}
function immediateSection() {
  const derived = state.diagnosis.map((row, index) => row.resolvedDate
    ? `<article class="repeat-card immediate-card">${diagnosticContextTable([row], "Eseguito in data", "resolvedDate")}${field("Azioni condotte in loco", `diagnosis.${index}.resolvedAction`, { wide: true, multiline: true, value: row.resolvedAction })}</article>` : "").join("");
  const previous = state.immediate.records.map((row, index) =>
    `<article class="repeat-card immediate-card"><div class="card-top"><h3>Intervento preesistente · ${index + 1}</h3>${removeButton("remove-immediate", index)}</div>${diagnosticContextTable([{ ...row, date: state.immediate.executedDate }], "Eseguito in data", "date", () => field("Macro-Area", `immediate.records.${index}.area`))}${field("Azioni condotte in loco", `immediate.records.${index}.action`, { wide: true, multiline: true })}</article>`,
  ).join("");
  return band("INTERVENTI ESEGUITI") + derived + previous +
    (!derived && !previous ? '<p class="empty">Compila Risolto in data nella diagnostica per generare un intervento eseguito.</p>' : "") +
    `<div class="wide-note">${field("Note aggiuntive", "immediate.notes", { multiline: true })}</div>`;
}
function diagnosticContextTable(rows, dateLabel, dateKey, areaControl = null) {
  if (!rows.length) return "";
  const headers = ["ID", "Macro-Area", "Elemento", dateKey === "detectedDate" ? "Patologia riscontrata" : "Patologia", "Cause principali", dateLabel];
  const preventive = dateKey === "detectedDate";
  if (preventive) headers.push("Risolto in data");
  const columns = (preventive ? [5, 15, 16, 23, 19, 11, 11] : [5, 18, 18, 26, 21, 12]).map(width => `<col style="width:${width}%">`).join("");
  const body = rows.map(row => {
    const values = [row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row[dateKey])];
    if (preventive) values.push(displayDate(row.resolvedDate));
    return `<tr${preventive && row.resolvedDate ? ' class="resolved-row"' : ""}>${values.map((value, index) => `<td>${index === 1 && areaControl ? areaControl(row) : escape(value)}</td>`).join("")}</tr>`;
  }).join("");
  return `<div class="table-wrap"><table class="context-table${preventive ? " preventive-table" : ""}"><colgroup>${columns}</colgroup><thead><tr>${headers.map(header => `<th scope="col">${escape(header)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
}
function preventiveContext(row) {
  const context = [
    `<strong>${escape(row.reference)}</strong>`,
    escape(row.area || "Macro-Area non compilata"),
    escape(row.element),
    escape(row.pathology),
  ].filter(Boolean).join(" · ");
  const status = row.resolvedDate
    ? ` · <strong class="resolved-status">RISOLTO IN DATA ${escape(displayDate(row.resolvedDate))}</strong>`
    : "";
  return `<div class="record-context${row.resolvedDate ? " resolved" : ""}">${context}${status}</div>`;
}
function preventiveAction(row, action, index) {
  const path = `diagnosis.${row.index}.actions.${index}`;
  return `<article class="repeat-card">
    <div class="card-top"><h3>Azione preventiva ${escape(row.reference)} · ${index + 1}</h3>${removeButton("remove-preventive", index, `data-row="${row.index}"`)}</div>
    ${riskField("Grado d’urgenza", path + ".risk")}
    ${choices("Finestra d’intervento", path + ".window", windowsForRisk(action.risk))}
    <div class="fields">
      ${field("Descrizione", path + ".description", { wide: true, multiline: true })}
      ${field("Azione", path + ".action", { wide: true, multiline: true })}
      ${field("Obiettivo", path + ".objective", { wide: true, multiline: true })}
      ${field("Operatore", path + ".operator", { wide: true })}
    </div>
    ${choices("Qualifica operatore", path + ".role", ROLES)}
    ${choices("Stato", path + ".status", STATUSES)}
  </article>`;
}
function preventiveRow(row) {
  const actions = row.actions.map((action, index) => preventiveAction(row, action, index)).join("");
  if (row.resolvedDate) return "";
  return preventiveContext(row) + actions +
    addButton("Aggiungi azione per " + row.reference, "add-preventive", `data-row="${row.index}"`);
}
function preventiveSection() {
  const rows = preventiveRows(state);
  const table = diagnosticContextTable(rows, "Data del rilievo", "detectedDate");
  return band("AZIONI PREVENTIVE") + table + rows.map(preventiveRow).join("") +
    (!rows.length ? '<p class="empty">Nessuna azione preventiva da programmare.</p>' : "") +
    `<div class="wide-note">${field("Note aggiuntive", "preventive.notes", { multiline: true })}</div>`;
}
const sectionRenderers = {
  context: firstSection,
  history: historySection,
  conditions: conditionsSection,
  diagnosis: diagnosisSection,
  photos: photosSection,
  immediate: immediateSection,
  preventive: preventiveSection,
};
function setBusy(value) {
  busy = value;
  for (const id of ["next", "previous", "filename", "newButton", "importButton", "resetButton", "pageLockButton", "surveyHistoryButton", "homeUpdateButton", "updateButton"])
    $(id).disabled = value;
  $("resumeButton").disabled = value || !draftAvailable;
  for (const button of $("sectionContent").querySelectorAll('[data-action="camera"], [data-action="photos"]'))
    button.disabled = value;
  for (const form of [$("newDialog"), $("newForm"), $("surveyForm")])
    for (const control of form.querySelectorAll("button, input, select, textarea")) control.disabled = value;
}
function render() {
  if (syncDiagnosticLinks(state)) changed();
  const section = SECTION_DEFINITIONS[state.section];
  syncPageLock();
  $("sectionContent").innerHTML = sectionRenderers[section.key]();
  // Le rimozioni dei dati precedenti richiedono lo sblocco di questa pagina.
  for (const button of $("sectionContent").querySelectorAll('[data-action^="remove-"]')) {
    if (removalIsLocked(button.dataset)) {
      button.disabled = true;
      if (button.dataset.action === "remove-photo")
        button.title = "Fotografia di un sopralluogo precedente: sblocca la pagina per rimuoverla";
    }
  }
  syncFilename();
  $("sectionCounter").textContent =
    `Sezione ${state.section + 1} di ${SECTIONS.length}`;
  $("previous").textContent = state.section
    ? "← " + SECTIONS[state.section - 1]
    : "Home";
  $("next").textContent =
    state.section === SECTIONS.length - 1
      ? "Salva scheda"
      : SECTIONS[state.section + 1] + " →";
  setBusy(busy);
}
function navigate(direction) {
  if (busy || !state) return;
  if (direction < 0 && state.section === 0) {
    persist();
    show("home");
    return;
  }
  state.section = Math.max(0, Math.min(SECTIONS.length - 1, state.section + direction));
  changed();
  render();
  window.scrollTo(0, 0);
  $("sectionContent").focus({ preventScroll: true });
}

$("sectionContent").addEventListener("input", (event) => {
  const el = event.target;
  if (
    !el.matches("[data-path]") ||
    el.readOnly ||
    ["radio", "checkbox"].includes(el.type)
  )
    return;
  if (fieldIsLocked(el.dataset.path)) return;
  const linksChanged = set(el.dataset.path, el.value);
  el.setCustomValidity("");
  changed();
  if (linksChanged) refreshPriorities();
});
$("sectionContent").addEventListener("change", (event) => {
  const el = event.target;
  if (!el.matches("[data-path]") || el.readOnly || el.disabled || fieldIsLocked(el.dataset.path)) return;
  let linksChanged = false;
  if (el.dataset.measure) {
    try {
      el.value = formatMeasure(el.value);
      el.setCustomValidity("");
      linksChanged = set(el.dataset.path, el.value);
    } catch (error) {
      el.setCustomValidity(error.message);
      el.reportValidity();
      return;
    }
  } else if (el.dataset.multiple) {
    const list = get(el.dataset.path);
    linksChanged = set(
      el.dataset.path,
      el.checked
        ? [...new Set([...list, el.value])]
        : list.filter((v) => v !== el.value),
    );
  } else if (el.type === "radio") {
    if (el.checked) linksChanged = set(el.dataset.path, el.value);
  } else linksChanged = set(el.dataset.path, el.value);
  if (el.tagName === "SELECT") {
    el.className =
      "risk-" +
      ({ BASSO: "low", MEDIO: "medium", ALTO: "high" }[el.value] || "");
  }
  changed();
  if (el.dataset.path.endsWith(".risk")) {
    render();
  } else if (linksChanged) refreshPriorities();
});
$("sectionContent").addEventListener("click", (event) => {
  const marker = event.target.closest("[data-map-asset]");
  if (marker) {
    if (busy || !pageUnlocked()) return;
    const selected = assets.find(item => item.id === marker.dataset.mapAsset);
    if (!selected || selected.kind !== asset()?.kind || selected.id === state.assetId) return;
    state.assetId = selected.id;
    state.customFilename = false;
    state.filename = "";
    state.assetSnapshot = structuredClone(selected);
    for (const [key, value] of Object.entries(selected.fixed))
      editField(state, "general." + key, String(value), { correction: true });
    for (const visit of state.surveys) visit.data.assetId = selected.id;
    changed(); render(); return;
  }
  const button = event.target.closest("button[data-action]");
  if (!button || button.disabled) return;
  const { action, key, row } = button.dataset;
  const i = Number(button.dataset.index);
  if (action === "camera") {
    $("cameraInput").click();
    return;
  }
  if (action === "photos") {
    $("photoInput").click();
    return;
  }
  if (removalIsLocked(button.dataset)) return;
  if (action.startsWith("remove-")) {
    const removesDiagnosis = action === "remove-diagnosis";
    if (
      !confirm(
        action === "remove-priority"
          ? pageUnlocked()
            ? "Eliminare definitivamente questa priorità da tutti i sopralluoghi? Il rilievo diagnostico e le azioni collegate vengono conservati."
            : "Rimuovere questa priorità? Il rilievo diagnostico e le azioni collegate vengono conservati."
          : pageUnlocked()
          ? removesDiagnosis
            ? "Eliminare definitivamente questa riga e le azioni collegate da tutti i sopralluoghi?"
            : "Eliminare definitivamente questo elemento da tutti i sopralluoghi?"
          : removesDiagnosis
            ? "Eliminare il rilievo diagnostico, la priorità e le azioni collegate?"
            : "Rimuovere questo elemento e i dati contenuti?",
      )
    )
      return;
    if (pageUnlocked() && purgeRecord(state, button.dataset)) {
      changed();
      render();
      return;
    }
  }
  switch (action) {
    case "add-history":
      state.history[key].push(historyRecord());
      break;
    case "remove-history":
      state.history[key].splice(i, 1);
      break;
    case "add-condition":
      state.conditions.push({ ...conditionRecord(), date: state.survey.date });
      break;
    case "remove-condition":
      state.conditions.splice(i, 1);
      break;
    case "add-diagnosis":
      state.diagnosis.push({ ...diagnosisRecord(), reference: nextReference(state), detectedDate: state.survey.date });
      break;
    case "remove-diagnosis":
      state.diagnosis.splice(i, 1);
      break;
    case "remove-priority":
      if (state.priorities[i]?.diagnosisId) {
        const source = state.diagnosis.find(record => record.id === state.priorities[i].diagnosisId);
        if (source) source.priorityExcluded = true;
      }
      state.priorities.splice(i, 1);
      break;
    case "remove-photo":
      archivePhoto(state, state.photos[i]);
      state.photos.splice(i, 1);
      break;
    case "remove-immediate":
      state.immediate.records.splice(i, 1);
      break;
    case "add-preventive":
      if (state.diagnosis[Number(row)].resolvedDate) return;
      state.diagnosis[Number(row)].actionsInitialized = true;
      state.diagnosis[Number(row)].actions.push(preventiveRecord());
      break;
    case "remove-preventive":
      state.diagnosis[Number(row)].actionsInitialized = true;
      state.diagnosis[Number(row)].actions.splice(i, 1);
      break;
    default:
      return;
  }
  changed();
  render();
});
$("filename").addEventListener("input", () => {
  if (!state || busy) return;
  state.filename = $("filename").value;
  state.customFilename = !!state.filename.trim();
  changed();
});
$("filename").addEventListener("blur", () => {
  if (!state || busy) return;
  state.filename = currentName();
  syncFilename();
});
$("previous").onclick = () => navigate(-1);
$("next").onclick = () =>
  state.section === SECTIONS.length - 1 ? exportFinal() : navigate(1);
function openInfo() {
  $("options").open = false;
  $("appVersion").textContent = "V." + VERSION;
  $("pwaLink").href = PWA_URL;
  $("pwaLink").textContent = PWA_URL;
  $("homeOptions").open = false;
  $("infoDialog").showModal();
}
$("infoButton").onclick = openInfo;
$("homeInfoButton").onclick = openInfo;
const updateButtons = [$("homeUpdateButton"), $("updateButton")];
async function searchForUpdates() {
  if (busy) return;
  $("options").open = $("homeOptions").open = false;
  const view = $("editor").hidden ? "home" : "editor";
  const controls = [...$("sectionContent").querySelectorAll("button, input, select, textarea")]
    .map(element => ({ element, disabled: element.disabled }));
  const progress = message => {
    for (const button of updateButtons) button.textContent = message;
    notify(message);
  };
  let reloading = false;
  setBusy(true);
  for (const { element } of controls) element.disabled = true;
  for (const button of updateButtons) button.setAttribute("aria-busy", "true");
  try {
    progress("Ricerca in corso…");
    if (state && !await persist())
      throw Error("Bozza non salvata. Salva la scheda prima di applicare un aggiornamento.");
    const update = await checkForUpdates(progress);
    if (!update.available) {
      notify("L’app è già aggiornata alla V." + VERSION + ".");
      return;
    }
    progress("Aggiornamento in corso…");
    // Ricontrolla il salvataggio prima di abbandonare la finestra corrente.
    if (state && !await persist())
      throw Error("Bozza non salvata. L’aggiornamento non è stato applicato; la scheda resta aperta.");
    try { rememberUpdateView(view, update.version); }
    catch { throw Error("Non è possibile preparare la riapertura della scheda. Riprova senza chiudere l’app."); }
    location.reload();
    reloading = true;
  } catch (error) {
    const networkError = ["TypeError", "NetworkError", "SecurityError", "InvalidStateError"].includes(error.name);
    notify(networkError
      ? navigator.onLine === false ? "Connessione assente. Riprova quando sei online."
        : "Impossibile cercare gli aggiornamenti. Controlla la connessione e riprova."
      : error.message || "Impossibile cercare gli aggiornamenti. Riprova tra poco.");
  } finally {
    // Durante la navigazione mantieni i campi fermi: nessuna modifica può
    // arrivare fra l'ultimo salvataggio e la chiusura della vecchia pagina.
    if (!reloading) {
      setBusy(false);
      for (const { element, disabled } of controls) element.disabled = disabled;
      for (const button of updateButtons) {
        button.textContent = "Cerca aggiornamenti";
        button.removeAttribute("aria-busy");
      }
    }
  }
}
for (const button of updateButtons) button.onclick = searchForUpdates;
$("newButton").onclick = () => {
  $("assetSelect").replaceChildren();
  for (const button of $("newDialog").querySelectorAll("[data-kind]")) button.setAttribute("aria-pressed", "false");
  $("newDialog").showModal();
};
$("newDialog").addEventListener("click", event => {
  const button = event.target.closest("[data-kind]");
  if (!button || busy) return;
  const kind = button.dataset.kind;
  const items = assets.filter(item => item.kind === kind);
  $("assetSelect").replaceChildren(...items.map(item => {
    const option = document.createElement("option");
    option.value = item.id; option.textContent = item.label; return option;
  }));
  for (const category of $("newDialog").querySelectorAll("[data-kind]"))
    category.setAttribute("aria-pressed", String(category === button));
  if (kind === "road" || kind === "aqueduct") createSheet(items[0].id);
  else $("assetDialog").showModal();
});
$("newForm").onsubmit = event => { event.preventDefault(); return createSheet(); };
async function createSheet(assetId = $("assetSelect").value) {
  if (busy || !assets.some(item => item.id === assetId)) return;
  if (
    draftAvailable &&
    !confirm(
      "Creare una nuova scheda sostituendo la bozza corrente? Salva prima la scheda se vuoi conservarla.",
    )
  )
    return;
  setBusy(true);
  try {
    clearTimeout(saveTimer);
    await saveChain;
    state = applyFixed(newState(assetId), assets);
    unlockedPages.clear();
    $("assetDialog").close();
    $("newDialog").close();
    changed();
    show("editor");
  } finally { setBusy(false); }
}
$("resumeButton").onclick = () => { if (!busy && state) show("editor"); };
$("resetButton").onclick = async () => {
  if (busy) {
    notify("Attendi il completamento del salvataggio.");
    return;
  }
  if (
    !confirm(
      "Cancellare tutti i dati e le fotografie della bozza? I file già esportati resteranno disponibili.",
    )
  )
    return;
  setBusy(true);
  try {
    clearTimeout(saveTimer);
    await saveChain;
    if (storageReady) await storage.removeDraft();
    try { localStorage.removeItem("restauro-v3-fallback"); } catch { /* Può essere disabilitato su iOS. */ }
    state = null;
    draftAvailable = false;
    revision = savedRevision = 0;
    $("resumeButton").disabled = true;
    show("home");
    notify("Bozza cancellata.");
  } catch (error) {
    notify("Reset non riuscito: " + error.message);
  } finally { setBusy(false); }
};
// Le finestre sono sorelle nel DOM: il tocco sullo sfondo di quella superiore
// non viene propagato alla finestra delle categorie sottostante.
$("newDialog").addEventListener("close", () => {
  if ($("assetDialog").open) $("assetDialog").close();
});
const transactionalDialogs = new Set(["newDialog", "assetDialog", "surveyDialog", "saveDialog"]);
initDialogs(dialog => !busy || !transactionalDialogs.has(dialog.id));
document.addEventListener("click", (e) => {
  for (const id of ["options", "homeOptions"])
    if (!e.target.closest("#" + id)) $(id).open = false;
});

async function insertPhotos(files) {
  if (busy || !state || !files.length) return;
  const target = state;
  let failures = 0, added = 0;
  setBusy(true);
  try {
    for (const file of files) {
      try {
        const photo = await readPhoto(file, target.survey.date);
        if (state !== target) return;
        target.photos.push(photo);
        added++;
      } catch { failures++; }
    }
    if (added && state === target) {
      changed();
      await persist();
    }
    if (failures) notify(`${failures} immagini non leggibili. Convertile in JPEG o PNG e riprova.`);
  } finally {
    setBusy(false);
    if (state === target) render();
  }
}
for (const id of ["photoInput", "cameraInput"])
  $(id).onchange = async (event) => {
    await insertPhotos([...event.target.files]);
    event.target.value = "";
  };
$("importButton").onclick = () => $("jsonInput").click();
$("jsonInput").onchange = async (event) => {
  if (busy) return;
  setBusy(true);
  try {
    const file = event.target.files[0];
    if (!file) return;
    const raw = JSON.parse(await file.text());
    const next = parseState(
      raw.version === 3 ? await migrateLegacy(raw, assets) : raw,
      assets,
    );
    pendingImport = next;
    openSurveyDialog();
  } catch (error) {
    showMessage("Importazione non riuscita", error.message);
  } finally {
    event.target.value = "";
    setBusy(false);
  }
};
function openSurveyDialog() {
  const source = pendingImport || state;
  $("surveyDate").value = suggestedSurveyDate(source);
  $("surveyDate").min = source.survey.date;
  $("surveyError").hidden = true;
  $("surveyDialog").showModal();
}
$("surveyDialog").addEventListener("close", () => { pendingImport = null; });
$("surveyForm").onsubmit = async event => {
  event.preventDefault();
  if (busy) return;
  setBusy(true);
  try {
    const source = pendingImport || state;
    parseState(source, assets);
    if (pendingImport && draftAvailable && !confirm("Sostituire la bozza corrente con la scheda importata?")) return;
    const next = structuredClone(source);
    beginSurvey(next, $("surveyDate").value);
    clearTimeout(saveTimer); await saveChain;
    state = next;
    unlockedPages.clear();
    $("surveyDialog").close();
    pendingImport = null;
    changed(); show("editor"); await persist();
  } catch (error) { $("surveyError").textContent = error.message; $("surveyError").hidden = false; }
  finally { setBusy(false); }
};
$("pageLockButton").onclick = () => {
  if (!state || busy) return;
  const key = SECTION_DEFINITIONS[state.section].key;
  // Il cambio dei permessi non deve richiudere le azioni preventive già aperte.
  const expanded = [...$("sectionContent").querySelectorAll("details")].map(detail => detail.open);
  if (unlockedPages.has(key)) unlockedPages.delete(key);
  else unlockedPages.add(key);
  render();
  [...$("sectionContent").querySelectorAll("details")].forEach((detail, index) => {
    detail.open = expanded[index] || false;
  });
  notify(pageUnlocked() ? "Pagina sbloccata: le correzioni sostituiscono i dati anche nello storico."
    : "Blocchi della pagina ripristinati.");
};
$("surveyHistoryButton").onclick = () => {
  if (!state || busy) return;
  const section = SECTION_DEFINITIONS[state.section];
  $("surveyHistoryTitle").textContent = "Storico · " + section.label;
  $("surveyHistoryContent").innerHTML = historyHtml(state, section.key);
  $("surveyHistoryDialog").showModal();
};
// Rilascia anche le immagini pesanti quando si chiude la cronologia.
$("surveyHistoryDialog").addEventListener("close", () => {
  $("surveyHistoryContent").replaceChildren();
});
function exportFinal() {
  if (busy) return;
  $("saveForm").reset();
  enforceJson();
  $("confirmSave").disabled = false;
  $("saveError").hidden = true;
  $("saveDialog").showModal();
}
const formatInputs = [...document.querySelectorAll('#saveForm input[name="format"]')];
const jsonFormat = formatInputs.find(input => input.value === "json");
function enforceJson() {
  jsonFormat.checked = true;
  jsonFormat.disabled = true;
}
$("saveForm").addEventListener("change", () => {
  enforceJson();
  $("confirmSave").disabled = busy;
});
$("saveForm").onsubmit = async event => {
  event.preventDefault();
  if (busy) return;
  enforceJson();
  const selected = formatInputs.filter(input => input.checked).map(input => input.value);
  if (!selected.length) return;
  $("saveError").hidden = true;
  setBusy(true);
  $("closeSave").disabled = true;
  $("confirmSave").disabled = true;
  $("confirmSave").textContent = "Generazione…";
  formatInputs.forEach(input => input.disabled = true);
  exportFiles.clear();
  let version = revision;
  try {
    syncDiagnosticLinks(state);
    const normalized = parseState(state, assets);
    registerSurvey(normalized);
    state = normalized;
    version = ++revision;
    await persist();
    const snapshot = structuredClone(state);
    const files = await buildExportFiles(snapshot, assets, selected);
    if (version !== revision) throw Error("La scheda è stata modificata. Premi nuovamente Salva.");
    if (await exportFiles.prepare(files, baseName(snapshot, assets))) {
      if (version !== revision) {
        exportFiles.clear();
        throw Error("La scheda è stata modificata. Premi nuovamente Salva.");
      }
      $("saveDialog").close();
      exportFiles.download();
    }
  } catch (error) {
    $("saveError").textContent = error.message;
    $("saveError").hidden = false;
  } finally {
    setBusy(false);
    formatInputs.forEach(input => input.disabled = input === jsonFormat);
    $("closeSave").disabled = false;
    $("confirmSave").textContent = "Salva";
    $("confirmSave").disabled = !formatInputs.some(input => input.checked);
    render();
  }
};
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && state && revision !== savedRevision) persist();
});
window.addEventListener("pagehide", () => {
  if (state) persist();
});
window.addEventListener("beforeunload", (event) => {
  if (state && revision !== savedRevision) {
    event.preventDefault();
    event.returnValue = "";
  }
});
async function init() {
  assets = ASSETS;
  $("newButton").disabled = false;
  $("importButton").disabled = false;
  window.RestauroAppReady = true;
  // La home è utilizzabile subito. L'apertura della bozza non blocca i pulsanti.
  const startRevision = revision;
  let storageFailed = false;
  try {
    await storage.openStorage();
    storageReady = true;
    const saved = await storage.loadDraft();
    let recovered = null;
    if (saved) recovered = parseState(saved, assets, { allowIncomplete: true });
    else {
      const legacy = await storage.loadLegacyDraft();
      if (legacy) recovered = await migrateLegacy(legacy, assets);
    }
    if (recovered && !state && revision === startRevision) {
      state = recovered;
      draftAvailable = true;
      $("resumeButton").disabled = false;
    } else if (state && revision > savedRevision) persist();
  } catch (error) {
    storageFailed = true;
    notify("Bozza locale non disponibile: " + error.message);
  }
  if (updateView && !storageFailed) {
    if (updateView === "editor" && state) show("editor");
    notify("App aggiornata alla V." + VERSION + ".");
  }
}
init().catch((error) => showMessage("Avvio non riuscito", error.message));
initHomeTitle();
