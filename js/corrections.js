import { windowsForRisk, inheritedRiskSource, syncDiagnosticLinks } from "./model.js";

const dataVersions = state => [state, ...state.surveys.map(visit => visit.data)];
const at = (data, keys) => keys.reduce((value, key) => value?.[key], data);

/** Individua la stessa voce per ID, anche se il suo indice è cambiato nello storico. */
function fieldTargets(state, keys, correction) {
  const property = keys.at(-1);
  const current = at(state, keys.slice(0, -1));
  if (!current || !Object.hasOwn(current, property)) throw Error("Campo non valido.");
  const targets = [{ row: current, current: true }];
  if (keys[0] === "diagnosis" && keys[2] === "actions")
    targets[0].parent = state.diagnosis[Number(keys[1])];
  if (!correction) return targets;

  for (const visit of state.surveys) {
    const data = visit.data;
    let row, parent;
    if (keys[0] === "general") row = data.general;
    else if (keys[0] === "photos")
      row = data.photoDetails.find(photo => photo.id === current.id);
    else if (keys[0] === "diagnosis" && keys[2] === "actions") {
      parent = data.diagnosis.find(record => record.id === targets[0].parent.id);
      row = parent?.actions.find(action => action.id === current.id);
    } else {
      const index = keys.findIndex(key => /^\d+$/.test(key));
      if (index >= 0)
        row = at(data, keys.slice(0, index))?.find(record => record.id === current.id);
    }
    if (row) targets.push({ row, parent, current: false });
  }
  if (keys[0] === "photos")
    for (const photo of state.photoArchive)
      if (photo.id === current.id) targets.push({ row: photo, current: false });
  return targets;
}

/** Modifica normale: solo visita corrente. Lucchetto aperto: corregge anche le copie. */
export function editField(state, path, value, { correction = false } = {}) {
  const keys = path.split(".");
  if (keys.some(key => ["__proto__", "prototype", "constructor"].includes(key)))
    throw Error("Campo non valido.");
  if (inheritedRiskSource(state, path)) return;
  const property = keys.at(-1);
  const diagnosis = keys[0] === "diagnosis" && keys.length === 3;
  for (const target of fieldTargets(state, keys, correction)) {
    const { row, current } = target;
    // Correggere un intervento già eseguito non deve risolvere retroattivamente
    // le visite nelle quali il degrado era ancora aperto.
    if (!current && diagnosis && property === "resolvedDate" && !row.resolvedDate) continue;
    if (!current && diagnosis && property === "resolvedAction" && !row.resolvedDate && !row.resolvedAction) continue;
    row[property] = Array.isArray(value) ? [...value] : value;
    if (property === "risk" && row.window && !windowsForRisk(value).includes(row.window))
      row.window = "";
    if (diagnosis && property === "resolvedDate") {
      if (correction && !value) row.resolvedAction = "";
    }
  }
  if (path === "general.id") {
    state.customFilename = false;
    state.filename = "";
  }
  if (keys[0] === "general" && ["complex", "owner"].includes(property) && state.fixedCommon)
    state.fixedCommon[property] = value;
  if (path === "general.date" && !state.updateBaseline &&
    !state.surveys.some(visit => visit.id !== state.survey.id)) state.survey.date = value;
  if (correction && diagnosis && property === "resolvedDate" && !value) pruneBaseline(state);
  let linksChanged = false;
  if (keys[0] === "diagnosis") {
    linksChanged = syncDiagnosticLinks(state);
    if (correction && diagnosis && property === "risk") {
      const id = state.diagnosis[Number(keys[1])].id;
      for (const visit of state.surveys)
        syncDiagnosticLinks(visit.data, { createPriorities: false, diagnosisId: id });
    }
  }
  return linksChanged;
}

/** Non conserva identificativi di voci eliminate, né indici di blocco obsoleti. */
function pruneBaseline(state) {
  if (!state.updateBaseline) return;
  const present = {
    conditions: state.conditions,
    diagnosis: state.diagnosis,
    restorations: state.history.restorations,
    maintenance: state.history.maintenance,
    priorities: state.priorities,
    immediate: state.immediate.records,
    resolved: state.diagnosis.filter(row => row.resolvedDate),
    actions: state.diagnosis.flatMap(row => row.actions),
  };
  state.updateBaseline = Object.fromEntries(Object.entries(present).map(([key, rows]) => {
    const ids = new Set(rows.map(row => row.id));
    return [key, (state.updateBaseline[key] || []).filter(id => ids.has(id))];
  }));
}

function removeId(rows, id) {
  for (let index = rows.length - 1; index >= 0; index--)
    if (rows[index].id === id) rows.splice(index, 1);
}

/** Rimozione correttiva: elimina la voce da tutte le copie, senza archiviarla. */
export function purgeRecord(state, { action, key, index, row }) {
  let i = Number(index);
  if (action === "remove-priority" && state.priorities[i]?.diagnosisId) {
    i = state.diagnosis.findIndex(record => record.id === state.priorities[i].diagnosisId);
    if (i < 0) return false;
    action = "remove-diagnosis";
  }
  if (action === "remove-photo") {
    const photo = state.photos[i];
    if (!photo) return false;
    removeId(state.photos, photo.id);
    removeId(state.photoArchive, photo.id);
    for (const visit of state.surveys) {
      visit.data.photoIds = visit.data.photoIds.filter(id => id !== photo.id);
      removeId(visit.data.photoDetails, photo.id);
    }
    return true;
  }
  if (action === "remove-preventive") {
    const diagnosis = state.diagnosis[Number(row)];
    const id = diagnosis?.actions[i]?.id;
    if (!id) return false;
    for (const data of dataVersions(state)) {
      const parent = data.diagnosis.find(record => record.id === diagnosis.id);
      if (!parent) continue;
      parent.actionsInitialized = true;
      removeId(parent.actions, id);
    }
  } else {
    const paths = {
      "remove-history": ["history", key],
      "remove-condition": ["conditions"],
      "remove-diagnosis": ["diagnosis"],
      "remove-priority": ["priorities"],
      "remove-immediate": ["immediate", "records"],
    };
    const path = paths[action];
    const current = path && at(state, path)?.[i];
    const id = current?.id;
    if (!id) return false;
    // Le azioni preventive e gli interventi derivati della diagnostica
    // scompaiono insieme alla riga alla quale appartengono.
    for (const data of dataVersions(state)) {
      if (action === "remove-priority" && current.diagnosisId) {
        const source = data.diagnosis.find(record => record.id === current.diagnosisId);
        if (source) source.priorityExcluded = true;
      }
      if (action === "remove-diagnosis")
        data.priorities = data.priorities.filter(priority => priority.diagnosisId !== id);
      removeId(at(data, path), id);
    }
  }
  pruneBaseline(state);
  return true;
}
