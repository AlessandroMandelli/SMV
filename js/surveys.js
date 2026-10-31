import { uid, localDate, surveyData, immediateRows, diagnosisHasContent } from "./model.js";

/** Viste per consultazione/esportazione; registerSurvey crea invece copie indipendenti. */
export function surveyEntries(state) {
  return [...(state.surveys || []).filter(v => v.id !== state.survey.id),
    { ...state.survey, data: surveyData(state, { clone: false }) }];
}
export function registerSurvey(state) {
  const entry = { ...state.survey, recordedAt: new Date().toISOString(), data: surveyData(state) };
  const index = state.surveys.findIndex(v => v.id === entry.id);
  if (index < 0) state.surveys.push(entry);
  else state.surveys[index] = entry;
  const referenced = new Set(state.surveys.flatMap(visit => visit.data.photoIds));
  const current = new Set(state.photos.map(photo => photo.id));
  state.photoArchive = state.photoArchive.filter(photo => referenced.has(photo.id) && !current.has(photo.id));
}
/** Propone l'ultima esecuzione registrata; senza interventi datati riparte
 * dall'ultimo sopralluogo. Non considera scadenze o programmazioni future. */
export function suggestedSurveyDate(state) {
  const visits = surveyEntries(state);
  const valid = value => /^\d{4}-\d{2}-\d{2}$/.test(value || "") &&
    localDate(new Date(value + "T12:00:00")) === value;
  const visitDates = visits.map(visit => visit.date).filter(valid);
  const latestVisit = visitDates.sort().at(-1) || state.general.date || localDate();
  const executionDates = visits.flatMap(visit => [
    ...visit.data.diagnosis.map(row => row.resolvedDate),
    ...visit.data.immediate.records.filter(row => row.area || row.action)
      .map(row => row.date || visit.data.immediate.executedDate),
  ]).filter(valid);
  // La proposta non può precedere una visita già registrata.
  return [latestVisit, ...executionDates].sort().at(-1);
}
export function beginSurvey(state, date = localDate(), notes = "") {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || localDate(new Date(date + "T12:00:00")) !== date)
    throw Error("Inserisci la data del nuovo sopralluogo.");
  if (state.survey.date && date < state.survey.date)
    throw Error("Il nuovo sopralluogo non può precedere quello già registrato.");
  registerSurvey(state);
  state.updateBaseline = {
    conditions: state.conditions.map(r => r.id), diagnosis: state.diagnosis.map(r => r.id),
    restorations: state.history.restorations.map(r => r.id),
    maintenance: state.history.maintenance.map(r => r.id),
    priorities: state.priorities.map(r => r.id),
    immediate: state.immediate.records.map(r => r.id),
    resolved: state.diagnosis.filter(r => r.resolvedDate).map(r => r.id),
    actions: state.diagnosis.flatMap(r => r.actions.map(a => a.id)),
  };
  state.survey = { id: uid(), date, notes };
  state.filenameDate = new Date().toISOString();
  state.customFilename = false;
  state.filename = "";
  state.immediate.date = date;
  state.preventive.date = date;
  state.section = 0;
}
// L'elenco dei blocchi cambia solo all'importazione o al nuovo sopralluogo.
// Le ricerche per ciascun campo non devono scorrere tutte le righe precedenti.
const baselineIndexes = new WeakMap();
function wasPresent(baseline, collection, id) {
  if (!baseline || !id) return false;
  if (!baselineIndexes.has(baseline))
    baselineIndexes.set(baseline, Object.fromEntries(
      Object.entries(baseline).map(([key, ids]) => [key, new Set(ids)]),
    ));
  return baselineIndexes.get(baseline)[collection]?.has(id) || false;
}

export function lockedPath(state, path) {
  const baseline = state.updateBaseline;
  const [group, index, key, actionIndex] = path.split(".");
  if (group === "general" && ["object", "complex", "owner"].includes(index)) return true;
  if (group === "diagnosis" && key === "actions" && state.diagnosis[index]?.resolvedDate) return true;
  if (!baseline) return false;
  if (group === "general") return true;
  if (group === "priorities") return wasPresent(baseline, "priorities", state.priorities[index]?.id);
  if (group === "immediate" && index === "records")
    return wasPresent(baseline, "immediate", state.immediate.records[key]?.id);
  if (group === "conditions") return wasPresent(baseline, "conditions", state.conditions[index]?.id);
  if (group === "history") return wasPresent(baseline, index, state.history[index]?.[key]?.id);
  if (group === "diagnosis") {
    const row = state.diagnosis[index];
    if (key === "actions") return wasPresent(baseline, "actions", row?.actions[actionIndex]?.id);
    if (key === "resolvedAction") return wasPresent(baseline, "resolved", row?.id);
    return key !== "resolvedDate" && wasPresent(baseline, "diagnosis", row?.id);
  }
  return false;
}

/** Stessa regola per il pulsante disabilitato e per l'azione di cancellazione. */
export function lockedRemoval(state, { action, key, index, row }) {
  const i = Number(index);
  if (action === "remove-priority" && state.priorities[i]?.diagnosisId) {
    const source = state.diagnosis.findIndex(record => record.id === state.priorities[i].diagnosisId);
    if (source >= 0 && lockedPath(state, `diagnosis.${source}.area`)) return true;
  }
  if (action === "remove-photo") {
    const photo = state.photos[i];
    return !!photo && state.surveys.some(visit =>
      visit.id !== state.survey.id && visit.data.photoIds.includes(photo.id));
  }
  const paths = {
    "remove-diagnosis": `diagnosis.${i}.area`,
    "remove-condition": `conditions.${i}.exposure`,
    "remove-history": `history.${key}.${i}.action`,
    "remove-priority": `priorities.${i}.risk`,
    "remove-immediate": `immediate.records.${i}.action`,
    "remove-preventive": `diagnosis.${row}.actions.${i}.action`,
  };
  return paths[action] ? lockedPath(state, paths[action]) : false;
}
export function diagnosisHistory(state, id) {
  return diagnosisHistories(state).get(id) || [];
}

export function diagnosisHistories(state) {
  const histories = new Map(), previous = new Map();
  for (const visit of surveyEntries(state)) {
    for (const row of visit.data.diagnosis) {
      const signature = JSON.stringify([row.area, row.element, row.pathology, row.causes,
        row.risk, row.detectedDate, row.resolvedDate]);
      if (!histories.has(row.id)) histories.set(row.id, []);
      if (signature !== previous.get(row.id))
        histories.get(row.id).push({ date: visit.date, notes: visit.notes, row });
      previous.set(row.id, signature);
    }
  }
  return histories;
}

export function nextReference(state) {
  const rows = [...state.diagnosis, ...(state.surveys || []).flatMap(v => v.data.diagnosis)];
  const number = rows.reduce((max, row) => Math.max(max, Number(row.reference?.replace(/^D/, "")) || 0), 0) + 1;
  return "D" + String(number).padStart(2, "0");
}
export function archivePhoto(state, photo) {
  if (state.surveys.some(v => v.data.photoIds.includes(photo.id)) &&
    !state.photoArchive.some(p => p.id === photo.id)) state.photoArchive.push(photo);
}
export function photoIndex(state) {
  return new Map([...state.photoArchive, ...state.photos].map(p => [p.id, p]));
}

/** Metadati della visita, immagine condivisa: modificare oggi non riscrive ieri. */
export function photosForSurvey(data, images) {
  const details = new Map((data.photoDetails || []).map(p => [p.id, p]));
  return data.photoIds.map(id => {
    const image = images.get(id);
    return image ? { ...image, ...details.get(id) } : null;
  }).filter(Boolean);
}

export function allPhotos(state) {
  const images = photoIndex(state), seen = new Set(), photos = [];
  for (const visit of surveyEntries(state)) {
    for (const photo of photosForSurvey(visit.data, images)) {
      const key = JSON.stringify([photo.id, photo.caption, photo.insertedDate]);
      if (seen.has(key)) continue;
      seen.add(key);
      photos.push({ ...photo, surveyDate: visit.date });
    }
  }
  return photos;
}
function openDiagnosisIds(visits) {
  const ids = new Set();
  for (const visit of visits) for (const row of visit.data.diagnosis)
    if (!row.resolvedDate && diagnosisHasContent(row)) ids.add(row.id);
  return ids;
}
const hasPreventiveHistory = (row, openEarlier) => !row.resolvedDate || openEarlier.has(row.id);

/** Una risoluzione immediata non diventa un piano storico alla successiva importazione. */
export function preventiveRows(state, previousVisits = (state.surveys || []).filter(visit => visit.id !== state.survey?.id)) {
  const openEarlier = openDiagnosisIds(previousVisits);
  return state.diagnosis.map((row, index) => ({ ...row, index }))
    .filter(row => hasPreventiveHistory(row, openEarlier));
}

/** Conserva i piani distinti; i degradi risolti alla prima registrazione non ne generano uno. */
export function preventiveGroups(state) {
  const groups = [], seen = new Set(), openEarlier = new Set();
  const currentRows = new Map(state.diagnosis.map(row => [row.id, row]));
  for (const visit of surveyEntries(state)) {
    for (const row of visit.data.diagnosis) {
      if (!hasPreventiveHistory(row, openEarlier)) continue;
      const actions = row.actions.filter(a => Object.entries(a).some(([k,v]) => k !== "id" && String(v || "").trim()));
      const context = [row.area, row.element, row.pathology, row.causes, row.detectedDate];
      const unique = actions.filter(a => {
        const key = JSON.stringify([row.id, context, a]);
        if (seen.has(key)) return false;
        seen.add(key); return true;
      });
      if (unique.length)
        groups.push({ ...row, actions: unique, programmedDate: visit.date,
          resolvedDate: currentRows.has(row.id) ? currentRows.get(row.id).resolvedDate : row.resolvedDate });
    }
    // Solo le visite già chiuse possono rendere storico un piano risolto.
    for (const row of visit.data.diagnosis)
      if (!row.resolvedDate && diagnosisHasContent(row)) openEarlier.add(row.id);
  }
  return groups;
}
export function maintenanceEntries(state) {
  const entries = [], seen = new Set();
  for (const visit of surveyEntries(state)) {
    const references = new Map(visit.data.diagnosis.map(row => [row.id, row.reference]));
    for (const row of immediateRows(visit.data)) {
      if (![row.area, row.action, row.date].some(Boolean)) continue;
      const key = JSON.stringify([row.id, row.area, row.element, row.pathology, row.causes, row.action, row.date]);
      if (!seen.has(key)) {
        seen.add(key);
        entries.push({ ...row, reference: references.get(row.id) || "", surveyDate: visit.date });
      }
    }
  }
  return entries;
}
