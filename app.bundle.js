/* Schede Restauro 3.6.26 — generato dai sorgenti modulari in js/. */
(() => {
  // js/road.js
  var ROAD_SIZE = { width: 553, height: 949 };
  var DOCUMENT_MAP_WIDTH = 286;
  var ROAD_POINTS = [[246, 860], [256, 827], [270, 783], [285, 737], [295, 704], [294, 686], [293, 679], [308, 683], [330, 690], [352, 697], [365, 698], [368, 686], [366, 669], [360, 648], [352, 634], [341, 626], [324, 619], [307, 616], [292, 623], [280, 636], [271, 644], [255, 646], [235, 646], [211, 646], [202, 644], [198, 639], [198, 626], [201, 599], [201, 574], [200, 548], [208, 520], [205, 490], [204, 466], [210, 449], [204, 422], [196, 396], [193, 379], [194, 369], [199, 364], [208, 363], [218, 369], [224, 383], [231, 406], [240, 433], [255, 458], [270, 476], [277, 484], [292, 483], [302, 476], [306, 463], [306, 445], [306, 419], [294, 399], [298, 377], [296, 355], [284, 330], [273, 309], [254, 287], [235, 268], [226, 249], [225, 229], [221, 205], [219, 181], [217, 156], [215, 137], [212, 123], [226, 121], [236, 115]];
  var ROAD_SVG_POINTS = ROAD_POINTS.map((point) => point.join(",")).join(" ");
  function mapAssets(assets2, assetId) {
    var _a;
    const kind = (_a = assets2.find((asset2) => asset2.id === assetId)) == null ? void 0 : _a.kind;
    return kind && kind !== "road" ? assets2.filter((asset2) => asset2.kind === kind && Number.isFinite(asset2.x) && Number.isFinite(asset2.y)) : [];
  }

  // js/sections.js
  var EDITOR_LAYOUT_VERSION = 36;
  var SECTION_DEFINITIONS = Object.freeze([
    { key: "context", label: "Identificazione e dati del bene" },
    { key: "history", label: "Storico manutentivo" },
    { key: "conditions", label: "Stato conservativo" },
    { key: "diagnosis", label: "Diagnostica e priorit\xE0" },
    { key: "photos", label: "Atlante fotografico" },
    { key: "immediate", label: "Manutenzione immediata" },
    { key: "preventive", label: "Azioni preventive" }
  ].map(Object.freeze));
  var SECTIONS = Object.freeze(SECTION_DEFINITIONS.map((section) => section.label));
  function importedSection(index, layoutVersion) {
    if (!Number.isInteger(index)) return 0;
    const migrated = layoutVersion === EDITOR_LAYOUT_VERSION || index < 2 ? index : index + 1;
    return Math.max(0, Math.min(SECTIONS.length - 1, migrated));
  }

  // js/model.js
  var APP_ID = "schede-restauro";
  var SCHEMA_VERSION = 2;
  var COMMON = Object.freeze({
    operator: "Francesco Maria Peron",
    company: "Cr\xF2mo s.c.ar.l.",
    address: "Via Matteotti, 8 \u2013 21030 Castello Cabiaglio (Varese)",
    email: "info@cromorestauri.com",
    pec: "cromo restauri@sicurezzapostale.it",
    complex: "Sacro Monte di Varese \u2013 Percorso devozionale dei 15 misteri",
    owner: "Parrocchia Santa Maria del Monte al Sacro Monte di Varese",
    authorization: "D.L., Arch. Gaetano Arricobene"
  });
  var RISKS = ["BASSO", "MEDIO", "ALTO"];
  var WINDOWS = [
    "PROSECUZIONE MONITORAGGIO",
    "IMMEDIATO",
    "ENTRO 6 MESI",
    "ENTRO 12 MESI"
  ];
  var HIGH_WINDOWS = [
    "MONITORAGGIO",
    "IMMEDIATO",
    "ENTRO 3 MESI",
    "ENTRO 6 MESI"
  ];
  var windowsForRisk = (risk) => risk === "ALTO" ? HIGH_WINDOWS : WINDOWS;
  var immediateRows = (state2) => [
    ...state2.diagnosis.filter((r) => r.resolvedDate).map((r) => ({
      id: r.id,
      area: r.area,
      element: r.element,
      pathology: r.pathology,
      causes: r.causes,
      date: r.resolvedDate,
      action: r.resolvedAction
    })),
    ...state2.immediate.records
  ];
  var METHODS = ["Visiva (da terra)", "Visiva (da presidio)", "Tattile"];
  var ROLES = [
    "TECNICO MANUTENTORE",
    "RESTAURATORE BENI CULTURALI",
    "GIARDINIERE/MANUTENTORE"
  ];
  var STATUSES = ["IN ATTESA", "PIANIFICATO", "ATTIVO"];
  var uid = () => crypto.randomUUID();
  function localDate(d = /* @__PURE__ */ new Date()) {
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }
  function localTime(d = /* @__PURE__ */ new Date()) {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  var historyRecord = () => ({ id: uid(), date: "", action: "" });
  var conditionRecord = () => ({
    id: uid(),
    date: "",
    exposure: "",
    methods: [],
    assessment: ""
  });
  var diagnosisRecord = () => ({
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
    actions: []
  });
  var priorityRecord = (diagnosisId = "") => ({
    id: uid(),
    diagnosisId,
    risk: "",
    window: "",
    anomalies: ""
  });
  var immediateRecord = () => ({ id: uid(), area: "", action: "" });
  var preventiveRecord = () => ({
    id: uid(),
    risk: "",
    window: "",
    description: "",
    action: "",
    objective: "",
    operator: "",
    role: "",
    status: ""
  });
  var diagnosisHasContent = (row) => [row.area, row.element, row.pathology, row.causes, row.risk, row.resolvedDate].some((value) => String(value || "").trim());
  function inheritedRiskSource(state2, path) {
    var _a;
    const keys = path.split(".");
    if (keys[0] === "diagnosis" && keys[2] === "actions" && keys[4] === "risk")
      return state2.diagnosis[Number(keys[1])] || null;
    if (keys[0] === "priorities" && keys[2] === "risk") {
      const id = (_a = state2.priorities[Number(keys[1])]) == null ? void 0 : _a.diagnosisId;
      return id ? state2.diagnosis.find((row) => row.id === id) || null : null;
    }
    return null;
  }
  function syncDiagnosticLinks(state2, { createPriorities = true, createActions = createPriorities, diagnosisId = null } = {}) {
    let changed2 = false;
    const sources = new Map(state2.diagnosis.map((row) => [row.id, row]));
    const kept = state2.priorities.filter((priority) => !priority.diagnosisId || sources.has(priority.diagnosisId) && !sources.get(priority.diagnosisId).priorityExcluded);
    if (kept.length !== state2.priorities.length) {
      state2.priorities = kept;
      changed2 = true;
    }
    const inherit = (record, risk) => {
      if (record.risk !== risk) {
        record.risk = risk;
        changed2 = true;
      }
      if (record.window && !windowsForRisk(risk).includes(record.window)) {
        record.window = "";
        changed2 = true;
      }
    };
    const linked = /* @__PURE__ */ new Set();
    for (const priority of state2.priorities) {
      if (!priority.diagnosisId) continue;
      linked.add(priority.diagnosisId);
      if (!diagnosisId || priority.diagnosisId === diagnosisId)
        inherit(priority, sources.get(priority.diagnosisId).risk);
    }
    for (const row of state2.diagnosis) {
      if (diagnosisId && row.id !== diagnosisId) continue;
      if (createActions && !row.actionsInitialized && !row.resolvedDate && diagnosisHasContent(row)) {
        if (!row.actions.length) row.actions.push(preventiveRecord());
        row.actionsInitialized = true;
        changed2 = true;
      }
      for (const action of row.actions) inherit(action, row.risk);
      if (createPriorities && diagnosisHasContent(row) && !row.priorityExcluded && !linked.has(row.id)) {
        state2.priorities.push({ ...priorityRecord(row.id), risk: row.risk });
        linked.add(row.id);
        changed2 = true;
      }
    }
    return changed2;
  }
  function newState(assetId) {
    const openedAt = /* @__PURE__ */ new Date(), date = localDate(openedAt);
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
        materials: ""
      },
      history: {
        restorations: [],
        maintenance: []
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
        notes: ""
      },
      preventive: { date, notes: "" }
    };
  }
  function filenameDay(state2) {
    const value = state2.filenameDate || state2.createdAt;
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : localDate(new Date(value));
  }
  function baseName(state2, assets2) {
    if (state2.customFilename && state2.filename.trim())
      return safeFilename(state2.filename);
    const asset2 = assets2.find((item) => item.id === state2.assetId);
    const date = filenameDay(state2);
    const prefix = `${(asset2 == null ? void 0 : asset2.fileLabel) || "Bene"}_ID_`;
    const suffix = "_scheda_ispezione_periodica_" + date;
    const identifier = (String(state2.general.id || "").trim() || `XX.XX_${date.slice(0, 4)}`).normalize("NFC").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/\s+/g, "_");
    const id = identifier.slice(0, Math.max(1, 160 - prefix.length - suffix.length));
    return safeFilename(prefix + id + suffix);
  }
  function safeFilename(name) {
    return name.normalize("NFC").trim().replace(/\.(docx|pdf|json|zip)$/i, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/[. ]+$/, "").slice(0, 160) || "Scheda_Restauro";
  }
  function formatMeasure(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    if (!/^-?(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?$/.test(raw))
      throw Error(
        "Inserisci un numero con virgola per i decimali, per esempio 1.950,50."
      );
    const [whole, fraction] = raw.replaceAll(".", "").split(",");
    const negative = whole.startsWith("-");
    const digits = whole.replace("-", "").replace(/^0+(?=\d)/, "");
    return (negative ? "-" : "") + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (fraction !== void 0 ? "," + fraction : "");
  }
  var measureText = (value) => value ? `${formatMeasure(value)} m` : "";
  var displayDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || "") ? value.split("-").reverse().join("/") : String(value || "");
  function applyFixed(state2, assets2, { initialize = true } = {}) {
    const selected = assets2.find((a) => a.id === state2.assetId);
    const fixed = (selected == null ? void 0 : selected.fixed) || {};
    state2.assetSnapshot = selected ? structuredClone(selected) : null;
    if (initialize) {
      if (!state2.general.object && selected) state2.general.object = fixed.object || selected.label;
      for (const key of Object.keys(state2.general))
        if (Object.hasOwn(fixed, key)) state2.general[key] = String(fixed[key]);
    }
    if (state2.assetSnapshot) {
      for (const key of Object.keys(fixed))
        if (Object.hasOwn(state2.general, key)) state2.assetSnapshot.fixed[key] = state2.general[key];
    }
    state2.fixedCommon = { ...COMMON, complex: state2.general.complex, owner: state2.general.owner };
    return state2;
  }
  var isGeneralBold = (state2, key) => {
    var _a, _b;
    return ((_b = (_a = state2.assetSnapshot) == null ? void 0 : _a.boldFields) == null ? void 0 : _b.includes(key)) === true;
  };
  function parseState(input, assets2, { allowIncomplete = false } = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    if (!input || input.app !== APP_ID || ![1, SCHEMA_VERSION].includes(input.schemaVersion))
      throw Error(
        "JSON non compatibile. Usa una scheda esportata da questa versione. Le bozze precedenti rimangono nel browser."
      );
    if (!assets2.some((a) => a.id === input.assetId))
      throw Error("Il bene indicato nel JSON non \xE8 disponibile.");
    const out = newState(input.assetId);
    const text = (v) => typeof v === "string" ? v : "";
    const arr = (v) => {
      if (!Array.isArray(v))
        throw Error("Struttura JSON non valida: elenco mancante.");
      return v;
    };
    const date = (v, month = false) => {
      v = text(v);
      if (!v) return "";
      if (month ? !/^\d{4}-(0[1-9]|1[0-2])$/.test(v) : !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(v))
        throw Error("Data JSON non valida.");
      if (!month && localDate(/* @__PURE__ */ new Date(v + "T12:00:00")) !== v)
        throw Error("Data JSON non valida.");
      return v;
    };
    const choice = (v, list) => {
      v = text(v);
      if (v && !list.includes(v)) throw Error("Scelta JSON non riconosciuta.");
      return v;
    };
    const records2 = (values, factory, keys) => arr(values).map((value) => {
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
    const defaults = ((_a = assets2.find((asset2) => asset2.id === input.assetId)) == null ? void 0 : _a.fixed) || {};
    for (const key of Object.keys(out.general)) {
      if (["complex", "owner"].includes(key) && !Object.hasOwn(input.general || {}, key))
        out.general[key] = typeof ((_b = input.fixedCommon) == null ? void 0 : _b[key]) === "string" ? input.fixedCommon[key] : COMMON[key];
      else if (!Object.hasOwn(input.general || {}, key) && Object.hasOwn(defaults, key))
        out.general[key] = String(defaults[key]);
      else out.general[key] = text((_c = input.general) == null ? void 0 : _c[key]);
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
    out.history.restorations = records2(
      (_d = input.history) == null ? void 0 : _d.restorations,
      historyRecord,
      ["date", "action"]
    );
    out.history.maintenance = records2((_e = input.history) == null ? void 0 : _e.maintenance, historyRecord, [
      "date",
      "action"
    ]);
    out.conditions = records2(input.conditions, conditionRecord, [
      "date",
      "exposure",
      "assessment"
    ]);
    out.conditions.forEach((r, i) => {
      var _a2;
      r.date = date(r.date || ((_a2 = input.general) == null ? void 0 : _a2.date));
      r.methods = arr(input.conditions[i].methods).map((m) => choice(m, METHODS)).filter(Boolean);
    });
    out.diagnosis = records2(input.diagnosis, diagnosisRecord, [
      "area",
      "element",
      "reference",
      "detectedDate",
      "pathology",
      "causes",
      "risk",
      "resolvedDate",
      "resolvedAction"
    ]);
    out.diagnosis.forEach((r, i) => {
      var _a2, _b2;
      r.reference = r.reference || "D" + String(i + 1).padStart(2, "0");
      r.detectedDate = date(r.detectedDate || ((_a2 = input.general) == null ? void 0 : _a2.date));
      r.risk = choice(r.risk, RISKS);
      r.resolvedDate = date(r.resolvedDate);
      r.priorityExcluded = input.diagnosis[i].priorityExcluded === true;
      r.actionsInitialized = input.diagnosis[i].actionsInitialized === true || ((_b2 = input.diagnosis[i].actions) == null ? void 0 : _b2.length) > 0;
      r.actions = records2(input.diagnosis[i].actions, preventiveRecord, [
        "risk",
        "window",
        "description",
        "action",
        "objective",
        "operator",
        "role",
        "status"
      ]);
      for (const a of r.actions) {
        a.risk = choice(a.risk, RISKS);
        a.window = choice(a.window, [...WINDOWS, ...HIGH_WINDOWS]);
        a.role = choice(a.role, ROLES);
        a.status = choice(a.status, STATUSES);
      }
    });
    out.priorities = records2(input.priorities, priorityRecord, [
      "diagnosisId",
      "risk",
      "window",
      "anomalies"
    ]);
    for (const r of out.priorities) {
      r.risk = choice(r.risk, RISKS);
      r.window = choice(r.window, [...WINDOWS, ...HIGH_WINDOWS]);
      if (r.diagnosisId && !out.diagnosis.some((row) => row.id === r.diagnosisId))
        throw Error("Priorit\xE0 collegata a un degrado mancante.");
    }
    const linkedPriorities = out.priorities.map((row) => row.diagnosisId).filter(Boolean);
    if (new Set(linkedPriorities).size !== linkedPriorities.length)
      throw Error("Pi\xF9 priorit\xE0 collegate allo stesso degrado.");
    out.inspectionNotes = text(input.inspectionNotes);
    const photo = (p) => {
      var _a2, _b2;
      if (!p || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\s]+$/.test(
        p.data || ""
      ))
        throw Error("Fotografia JSON non valida.");
      if (!Number.isFinite(p.width) || !Number.isFinite(p.height) || p.width <= 0 || p.height <= 0)
        throw Error("Dimensioni fotografia non valide.");
      return { id: text(p.id) || uid(), data: p.data, width: p.width, height: p.height, surveyDate: date(p.surveyDate || ((_a2 = input.general) == null ? void 0 : _a2.date)), insertedDate: date(p.insertedDate || p.surveyDate || ((_b2 = input.general) == null ? void 0 : _b2.date)), caption: text(p.caption) };
    };
    out.photos = arr(input.photos).map(photo);
    out.photoArchive = arr(input.photoArchive || []).map(photo);
    out.immediate.date = date((_f = input.immediate) == null ? void 0 : _f.date);
    out.immediate.executedDate = date((_g = input.immediate) == null ? void 0 : _g.executedDate);
    out.immediate.records = records2((_h = input.immediate) == null ? void 0 : _h.records, immediateRecord, [
      "area",
      "action"
    ]);
    out.immediate.notes = text((_i = input.immediate) == null ? void 0 : _i.notes);
    out.preventive.date = date((_j = input.preventive) == null ? void 0 : _j.date);
    out.preventive.notes = text((_k = input.preventive) == null ? void 0 : _k.notes);
    const survey = (value, fallback = {}) => ({
      id: text(value == null ? void 0 : value.id) || fallback.id || uid(),
      date: date((value == null ? void 0 : value.date) || fallback.date),
      notes: text(value == null ? void 0 : value.notes)
    });
    out.survey = survey(input.survey, { date: out.general.date });
    const photoById = new Map([...out.photoArchive, ...out.photos].map((p) => [p.id, p]));
    out.surveys = arr(input.surveys || []).map((entry) => {
      const meta = survey(entry);
      if (!entry.data || typeof entry.data !== "object") throw Error("Sopralluogo JSON non valido.");
      const photos = arr(entry.data.photoIds || []).map((id) => {
        if (!photoById.has(id)) throw Error("Fotografia dello storico mancante nel JSON.");
        return photoById.get(id);
      });
      const parsed = parseState(
        {
          ...out,
          ...entry.data,
          photos,
          survey: meta,
          surveys: [],
          photoArchive: [],
          updateBaseline: null
        },
        assets2.map((a) => ({ ...a, fixed: {} })),
        { allowIncomplete }
      );
      const data = surveyData(parsed);
      if (entry.data.photoDetails) {
        const details = arr(entry.data.photoDetails);
        if (new Set(details.map((p) => p == null ? void 0 : p.id)).size !== details.length)
          throw Error("Metadati fotografici dello storico duplicati.");
        const byId = new Map(details.map((p) => [text(p == null ? void 0 : p.id), p]));
        if (details.length !== data.photoIds.length || data.photoIds.some((id) => !byId.has(id)))
          throw Error("Metadati fotografici dello storico non coerenti.");
        data.photoDetails = data.photoIds.map((id) => {
          const p = byId.get(id);
          return {
            id,
            caption: text(p.caption),
            insertedDate: date(p.insertedDate),
            surveyDate: date(p.surveyDate || meta.date)
          };
        });
      }
      return { ...meta, recordedAt: text(entry.recordedAt), data };
    });
    if (new Set(out.surveys.map((v) => v.id)).size !== out.surveys.length)
      throw Error("Identificativi dei sopralluoghi duplicati.");
    for (const list of [
      out.diagnosis,
      out.conditions,
      out.history.restorations,
      out.history.maintenance,
      out.priorities,
      out.immediate.records,
      out.diagnosis.flatMap((row) => row.actions),
      out.photos,
      out.photoArchive
    ])
      if (new Set(list.map((r) => r.id)).size !== list.length) throw Error("Identificativi delle righe duplicati.");
    for (const p of out.photos) {
      const archived = out.photoArchive.find((a) => a.id === p.id);
      if (archived && archived.data !== p.data)
        throw Error("Fotografie con lo stesso identificativo e contenuti differenti.");
    }
    if (input.updateBaseline) {
      const baseline = input.updateBaseline;
      const ids = (key) => arr(baseline[key] || []).map(text).filter(Boolean);
      out.updateBaseline = {
        conditions: ids("conditions"),
        diagnosis: ids("diagnosis"),
        restorations: ids("restorations"),
        maintenance: ids("maintenance"),
        actions: ids("actions"),
        priorities: ids("priorities"),
        immediate: ids("immediate"),
        resolved: ids("resolved")
      };
      const previous = (_l = out.surveys.filter((v) => v.id !== out.survey.id).at(-1)) == null ? void 0 : _l.data;
      if (previous) {
        if (!baseline.priorities) out.updateBaseline.priorities = previous.priorities.map((r) => r.id);
        if (!baseline.immediate) out.updateBaseline.immediate = previous.immediate.records.map((r) => r.id);
        if (!baseline.resolved) out.updateBaseline.resolved = previous.diagnosis.filter((r) => r.resolvedDate).map((r) => r.id);
      }
    }
    return applyFixed(out, assets2, { initialize: false });
  }
  function surveyData(state2, { clone = true } = {}) {
    const keys = [
      "general",
      "history",
      "conditions",
      "diagnosis",
      "priorities",
      "inspectionNotes",
      "immediate",
      "preventive"
    ];
    const data = Object.fromEntries(keys.map((key) => [key, state2[key]]));
    data.photoIds = state2.photos.map((p) => p.id);
    data.photoDetails = state2.photos.map(({ id, caption = "", insertedDate = "", surveyDate = "" }) => ({ id, caption, insertedDate, surveyDate }));
    return clone ? structuredClone(data) : data;
  }

  // js/surveys.js
  function surveyEntries(state2) {
    return [
      ...(state2.surveys || []).filter((v) => v.id !== state2.survey.id),
      { ...state2.survey, data: surveyData(state2, { clone: false }) }
    ];
  }
  function registerSurvey(state2) {
    const entry = { ...state2.survey, recordedAt: (/* @__PURE__ */ new Date()).toISOString(), data: surveyData(state2) };
    const index = state2.surveys.findIndex((v) => v.id === entry.id);
    if (index < 0) state2.surveys.push(entry);
    else state2.surveys[index] = entry;
    const referenced = new Set(state2.surveys.flatMap((visit) => visit.data.photoIds));
    const current = new Set(state2.photos.map((photo) => photo.id));
    state2.photoArchive = state2.photoArchive.filter((photo) => referenced.has(photo.id) && !current.has(photo.id));
  }
  function suggestedSurveyDate(state2) {
    const visits = surveyEntries(state2);
    const valid = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || "") && localDate(/* @__PURE__ */ new Date(value + "T12:00:00")) === value;
    const visitDates = visits.map((visit) => visit.date).filter(valid);
    const latestVisit = visitDates.sort().at(-1) || state2.general.date || localDate();
    const executionDates = visits.flatMap((visit) => [
      ...visit.data.diagnosis.map((row) => row.resolvedDate),
      ...visit.data.immediate.records.filter((row) => row.area || row.action).map((row) => row.date || visit.data.immediate.executedDate)
    ]).filter(valid);
    return [latestVisit, ...executionDates].sort().at(-1);
  }
  function beginSurvey(state2, date = localDate(), notes = "") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || localDate(/* @__PURE__ */ new Date(date + "T12:00:00")) !== date)
      throw Error("Inserisci la data del nuovo sopralluogo.");
    if (state2.survey.date && date < state2.survey.date)
      throw Error("Il nuovo sopralluogo non pu\xF2 precedere quello gi\xE0 registrato.");
    registerSurvey(state2);
    state2.updateBaseline = {
      conditions: state2.conditions.map((r) => r.id),
      diagnosis: state2.diagnosis.map((r) => r.id),
      restorations: state2.history.restorations.map((r) => r.id),
      maintenance: state2.history.maintenance.map((r) => r.id),
      priorities: state2.priorities.map((r) => r.id),
      immediate: state2.immediate.records.map((r) => r.id),
      resolved: state2.diagnosis.filter((r) => r.resolvedDate).map((r) => r.id),
      actions: state2.diagnosis.flatMap((r) => r.actions.map((a) => a.id))
    };
    state2.survey = { id: uid(), date, notes };
    state2.filenameDate = (/* @__PURE__ */ new Date()).toISOString();
    state2.customFilename = false;
    state2.filename = "";
    state2.immediate.date = date;
    state2.preventive.date = date;
    state2.section = 0;
  }
  var baselineIndexes = /* @__PURE__ */ new WeakMap();
  function wasPresent(baseline, collection, id) {
    var _a;
    if (!baseline || !id) return false;
    if (!baselineIndexes.has(baseline))
      baselineIndexes.set(baseline, Object.fromEntries(
        Object.entries(baseline).map(([key, ids]) => [key, new Set(ids)])
      ));
    return ((_a = baselineIndexes.get(baseline)[collection]) == null ? void 0 : _a.has(id)) || false;
  }
  function lockedPath(state2, path) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const baseline = state2.updateBaseline;
    const [group, index, key, actionIndex] = path.split(".");
    if (group === "general" && Object.hasOwn(((_a = state2.assetSnapshot) == null ? void 0 : _a.fixed) || {}, index)) return true;
    if (group === "general" && ["object", "complex", "owner"].includes(index)) return true;
    if (group === "diagnosis" && key === "actions" && ((_b = state2.diagnosis[index]) == null ? void 0 : _b.resolvedDate)) return true;
    if (!baseline) return false;
    if (group === "general") return true;
    if (group === "priorities") return wasPresent(baseline, "priorities", (_c = state2.priorities[index]) == null ? void 0 : _c.id);
    if (group === "immediate" && index === "records")
      return wasPresent(baseline, "immediate", (_d = state2.immediate.records[key]) == null ? void 0 : _d.id);
    if (group === "conditions") return wasPresent(baseline, "conditions", (_e = state2.conditions[index]) == null ? void 0 : _e.id);
    if (group === "history") return wasPresent(baseline, index, (_g = (_f = state2.history[index]) == null ? void 0 : _f[key]) == null ? void 0 : _g.id);
    if (group === "diagnosis") {
      const row = state2.diagnosis[index];
      if (key === "actions") return wasPresent(baseline, "actions", (_h = row == null ? void 0 : row.actions[actionIndex]) == null ? void 0 : _h.id);
      if (key === "resolvedAction") return wasPresent(baseline, "resolved", row == null ? void 0 : row.id);
      return key !== "resolvedDate" && wasPresent(baseline, "diagnosis", row == null ? void 0 : row.id);
    }
    return false;
  }
  function lockedRemoval(state2, { action, key, index, row }) {
    const i = Number(index);
    if (action === "remove-photo") {
      const photo = state2.photos[i];
      return !!photo && state2.surveys.some((visit) => visit.id !== state2.survey.id && visit.data.photoIds.includes(photo.id));
    }
    const paths = {
      "remove-diagnosis": `diagnosis.${i}.area`,
      "remove-condition": `conditions.${i}.exposure`,
      "remove-history": `history.${key}.${i}.action`,
      "remove-priority": `priorities.${i}.risk`,
      "remove-immediate": `immediate.records.${i}.action`,
      "remove-preventive": `diagnosis.${row}.actions.${i}.action`
    };
    return paths[action] ? lockedPath(state2, paths[action]) : false;
  }
  function nextReference(state2) {
    const rows = [...state2.diagnosis, ...(state2.surveys || []).flatMap((v) => v.data.diagnosis)];
    const number = rows.reduce((max, row) => {
      var _a;
      return Math.max(max, Number((_a = row.reference) == null ? void 0 : _a.replace(/^D/, "")) || 0);
    }, 0) + 1;
    return "D" + String(number).padStart(2, "0");
  }
  function archivePhoto(state2, photo) {
    if (state2.surveys.some((v) => v.data.photoIds.includes(photo.id)) && !state2.photoArchive.some((p) => p.id === photo.id)) state2.photoArchive.push(photo);
  }
  function photoIndex(state2) {
    return new Map([...state2.photoArchive, ...state2.photos].map((p) => [p.id, p]));
  }
  function photosForSurvey(data, images) {
    const details = new Map((data.photoDetails || []).map((p) => [p.id, p]));
    return data.photoIds.map((id) => {
      const image = images.get(id);
      return image ? { ...image, ...details.get(id) } : null;
    }).filter(Boolean);
  }
  function allPhotos(state2) {
    const images = photoIndex(state2), seen = /* @__PURE__ */ new Set(), photos = [];
    for (const visit of surveyEntries(state2)) {
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
    const ids = /* @__PURE__ */ new Set();
    for (const visit of visits) for (const row of visit.data.diagnosis)
      if (!row.resolvedDate && diagnosisHasContent(row)) ids.add(row.id);
    return ids;
  }
  var hasPreventiveHistory = (row, openEarlier) => !row.resolvedDate || openEarlier.has(row.id);
  function preventiveRows(state2, previousVisits = (state2.surveys || []).filter((visit) => {
    var _a;
    return visit.id !== ((_a = state2.survey) == null ? void 0 : _a.id);
  })) {
    const openEarlier = openDiagnosisIds(previousVisits);
    return state2.diagnosis.map((row, index) => ({ ...row, index })).filter((row) => hasPreventiveHistory(row, openEarlier));
  }
  function preventiveGroups(state2) {
    const groups = [], seen = /* @__PURE__ */ new Set(), openEarlier = /* @__PURE__ */ new Set();
    const currentRows = new Map(state2.diagnosis.map((row) => [row.id, row]));
    for (const visit of surveyEntries(state2)) {
      for (const row of visit.data.diagnosis) {
        if (!hasPreventiveHistory(row, openEarlier)) continue;
        const actions = row.actions.filter((a) => Object.entries(a).some(([k, v]) => k !== "id" && String(v || "").trim()));
        const context = [row.area, row.element, row.pathology, row.causes, row.detectedDate];
        const unique = actions.filter((a) => {
          const key = JSON.stringify([row.id, context, a]);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        if (unique.length)
          groups.push({
            ...row,
            actions: unique,
            programmedDate: visit.date,
            resolvedDate: currentRows.has(row.id) ? currentRows.get(row.id).resolvedDate : row.resolvedDate
          });
      }
      for (const row of visit.data.diagnosis)
        if (!row.resolvedDate && diagnosisHasContent(row)) openEarlier.add(row.id);
    }
    return groups;
  }
  function maintenanceEntries(state2) {
    const entries = [], seen = /* @__PURE__ */ new Set();
    for (const visit of surveyEntries(state2)) {
      const references = new Map(visit.data.diagnosis.map((row) => [row.id, row.reference]));
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

  // js/storage.js
  var DB_NAME = "SchedeRestauroV3";
  var DRAFT_KEY = "current-structured-v1";
  var database;
  function openStorage() {
    return new Promise((resolve, reject) => {
      let finished = false;
      const timeout = setTimeout(() => {
        finished = true;
        reject(Error("Il browser non ha aperto il salvataggio locale."));
      }, 3500);
      const request = indexedDB.open(DB_NAME, 1);
      const fail = (error) => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        reject(error);
      };
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("drafts"))
          request.result.createObjectStore("drafts");
      };
      request.onsuccess = () => {
        if (finished) {
          request.result.close();
          return;
        }
        finished = true;
        clearTimeout(timeout);
        database = request.result;
        database.onversionchange = () => database.close();
        resolve();
      };
      request.onerror = () => fail(request.error);
      request.onblocked = () => fail(Error("Chiudi le altre finestre della scheda e riprova."));
    });
  }
  function transaction(mode, action) {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject(Error("Salvataggio locale non disponibile."));
        return;
      }
      const tx = database.transaction("drafts", mode), request = action(tx.objectStore("drafts"));
      let result;
      const timeout = setTimeout(() => {
        tx.abort();
        reject(Error("Il salvataggio locale non risponde."));
      }, 3500);
      request.onsuccess = () => result = request.result;
      tx.oncomplete = () => {
        clearTimeout(timeout);
        resolve(result);
      };
      tx.onerror = tx.onabort = () => {
        clearTimeout(timeout);
        reject(tx.error || request.error || Error("Operazione annullata."));
      };
    });
  }
  var loadDraft = () => transaction("readonly", (s) => s.get(DRAFT_KEY));
  var saveDraft = (state2) => transaction("readwrite", (s) => s.put(state2, DRAFT_KEY));
  var loadLegacyDraft = () => transaction("readonly", (s) => s.get("current"));
  var removeDraft = () => transaction("readwrite", (s) => {
    s.delete("current");
    return s.delete(DRAFT_KEY);
  });

  // js/catalog.js
  var ASSETS = [
    {
      "id": "c01",
      "label": "I Cappella, Annunciazione dell\u2019Angelo a Maria",
      "kind": "chapel",
      "fixed": {
        "object": "I CAPPELLA, ANNUNCIAZIONE DELL\u2019ANGELO A MARIA",
        "id": "02.03_2026",
        "chronology": "XVII secolo",
        "altitude": "600",
        "distance": "2.072"
      },
      "number": 1,
      "x": 48.82459,
      "y": 88.72497,
      "fileLabel": "I_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c02",
      "label": "II Cappella, La Visita di Maria ad Elisabetta",
      "kind": "chapel",
      "fixed": {
        "object": "II CAPPELLA, LA VISITA DI MARIA AD ELISABETTA",
        "id": "02.04_2026",
        "chronology": "XVII secolo",
        "altitude": "612",
        "distance": "1.947"
      },
      "number": 2,
      "x": 51.7179,
      "y": 81.34879,
      "fileLabel": "II_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c03",
      "label": "III Cappella, La Nascita di Ges\xF9",
      "kind": "chapel",
      "fixed": {
        "object": "III CAPPELLA, LA NASCITA DI GES\xD9",
        "id": "02.05_2026",
        "chronology": "XVII secolo",
        "altitude": "623",
        "distance": "1.830"
      },
      "number": 3,
      "x": 53.88788,
      "y": 70.70601,
      "fileLabel": "III_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c04",
      "label": "IV Cappella, La Presentazione al Tempio",
      "kind": "chapel",
      "fixed": {
        "object": "IV CAPPELLA, LA PRESENTAZIONE AL TEMPIO",
        "id": "02.06_2026",
        "chronology": "XVII secolo",
        "altitude": "627",
        "distance": "1.754"
      },
      "number": 4,
      "x": 68.89693,
      "y": 72.91886,
      "fileLabel": "IV_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c05",
      "label": "V Cappella, La Disputa di Ges\xF9 con i Dottori",
      "kind": "chapel",
      "fixed": {
        "object": "V CAPPELLA, LA DISPUTA DI GES\xD9 CON I DOTTORI",
        "id": "02.07_2026",
        "chronology": "XVII secolo",
        "altitude": "646",
        "distance": "1.651"
      },
      "number": 5,
      "x": 64.01447,
      "y": 64.80506,
      "fileLabel": "V_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "grotte",
      "label": "Grotta delle Romite",
      "kind": "chapel",
      "fixed": {
        "object": "GROTTA DELLE ROMITE",
        "id": "02.11_2026",
        "chronology": "XVII secolo",
        "altitude": "668",
        "distance": "1.374"
      },
      "x": 49,
      "y": 65,
      "fileLabel": "Grotta_delle_Romite",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c06",
      "label": "VI Cappella, L\u2019Orazione nell\u2019Orto",
      "kind": "chapel",
      "fixed": {
        "object": "VI CAPPELLA, L\u2019ORAZIONE NELL\u2019ORTO",
        "id": "02.10_2026",
        "chronology": "XVII secolo",
        "altitude": "660",
        "distance": "1.651"
      },
      "number": 6,
      "x": 44.12297,
      "y": 70.5,
      "fileLabel": "VI_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c07",
      "label": "VII Cappella, La Flagellazione",
      "kind": "chapel",
      "fixed": {
        "object": "VII CAPPELLA, LA FLAGELLAZIONE",
        "id": "02.13_2026",
        "chronology": "XVII secolo",
        "altitude": "670",
        "distance": "1.371"
      },
      "number": 7,
      "x": 40.3255,
      "y": 65.54268,
      "fileLabel": "VII_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c08",
      "label": "VIII Cappella, La Coronazione di Spine",
      "kind": "chapel",
      "fixed": {
        "object": "VIII CAPPELLA, LA CORONAZIONE DI SPINE",
        "id": "02.14_2026",
        "chronology": "XVII secolo",
        "altitude": "683",
        "distance": "1.200"
      },
      "number": 8,
      "x": 38.51718,
      "y": 57.3235,
      "fileLabel": "VIII_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c09",
      "label": "IX Cappella, La Salita al Calvario",
      "kind": "chapel",
      "fixed": {
        "object": "IX CAPPELLA, LA SALITA AL CALVARIO",
        "id": "02.15_2026",
        "chronology": "XVII secolo",
        "altitude": "700",
        "distance": "1.074"
      },
      "number": 9,
      "x": 39.24051,
      "y": 49.94731,
      "fileLabel": "IX_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c10",
      "label": "X Cappella, La Crocefissione",
      "kind": "chapel",
      "fixed": {
        "object": "X CAPPELLA, LA CROCEFISSIONE",
        "id": "02.16_2026",
        "chronology": "XVII secolo",
        "altitude": "721",
        "distance": "945"
      },
      "number": 10,
      "x": 37.43219,
      "y": 37.19705,
      "fileLabel": "X_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c11",
      "label": "XI Cappella, La Resurrezione",
      "kind": "chapel",
      "fixed": {
        "object": "XI CAPPELLA, LA RESURREZIONE",
        "id": "02.18_2026",
        "chronology": "XVII secolo",
        "altitude": "738",
        "distance": "825"
      },
      "number": 11,
      "x": 47.37794,
      "y": 46.68072,
      "fileLabel": "XI_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c12",
      "label": "XII Cappella, L\u2019Ascensione",
      "kind": "chapel",
      "fixed": {
        "object": "XII CAPPELLA, L\u2019ASCENSIONE",
        "id": "02.19_2026",
        "chronology": "XVII secolo",
        "altitude": "746",
        "distance": "590"
      },
      "number": 12,
      "x": 56.41953,
      "y": 51.42255,
      "fileLabel": "XII_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c13",
      "label": "XIII Cappella, La Discesa dello Spirito Santo",
      "kind": "chapel",
      "fixed": {
        "object": "XIII CAPPELLA, LA DISCESA DELLO SPIRITO SANTO",
        "id": "02.20_2026",
        "chronology": "XVII secolo",
        "altitude": "752",
        "distance": "360"
      },
      "number": 13,
      "x": 56.05787,
      "y": 41.51739,
      "fileLabel": "XIII_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "c14",
      "label": "XIV Cappella, L\u2019Assunzione della Vergine",
      "kind": "chapel",
      "fixed": {
        "object": "XIV CAPPELLA, L\u2019ASSUNZIONE DELLA VERGINE",
        "id": "02.21_2026",
        "chronology": "XVII secolo",
        "altitude": "785",
        "distance": "360"
      },
      "number": 14,
      "x": 44.3038,
      "y": 26.23815,
      "fileLabel": "XIV_Cappella",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "arco1",
      "label": "Primo Arco, Arco della Madonna del Rosario",
      "kind": "arch",
      "fixed": {
        "object": "PRIMO ARCO, ARCO DELLA MADONNA DEL ROSARIO",
        "id": "02.01_2026",
        "chronology": "XVII secolo",
        "altitude": "595",
        "distance": "2.080"
      },
      "number": 1,
      "x": 44.48463,
      "y": 90.93783,
      "fileLabel": "Primo_Arco",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "arco2",
      "label": "Secondo Arco, Arco di San Carlo",
      "kind": "arch",
      "fixed": {
        "object": "SECONDO ARCO, ARCO DI SAN CARLO",
        "id": "02.08_2026",
        "chronology": "XVII secolo",
        "altitude": "646",
        "distance": "1.646"
      },
      "number": 2,
      "x": 53.52622,
      "y": 65.33193,
      "fileLabel": "Secondo_Arco",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "arco3",
      "label": "Terzo Arco, Arco di Sant\u2019Ambrogio",
      "kind": "arch",
      "fixed": {
        "object": "TERZO ARCO, ARCO DI SANT\u2019AMBROGIO",
        "id": "02.17_2026",
        "chronology": "XVII secolo",
        "altitude": "724",
        "distance": "938"
      },
      "number": 3,
      "x": 42.67631,
      "y": 42.36038,
      "fileLabel": "Terzo_Arco",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "f1",
      "label": "Prima Fontana, Fontana della Samaritana",
      "kind": "fountain",
      "fixed": {
        "object": "PRIMA FONTANA, FONTANA DELLA SAMARITANA",
        "id": "02.02_2026",
        "chronology": "XVII secolo",
        "altitude": "600",
        "distance": "2.072"
      },
      "number": 1,
      "x": 42.85714,
      "y": 88.40885,
      "fileLabel": "Prima_Fontana",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "f2",
      "label": "Seconda Fontana, Arco di San Carlo",
      "kind": "fountain",
      "fixed": {
        "object": "SECONDA FONTANA, ARCO DI SAN CARLO",
        "id": "02.09_2026",
        "chronology": "XVII secolo",
        "altitude": "646",
        "distance": "1.648"
      },
      "number": 2,
      "x": 54.43038,
      "y": 63.96207,
      "fileLabel": "Seconda_Fontana",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "f3",
      "label": "Terza Fontana, Arco di Sant\u2019Ambrogio",
      "kind": "fountain",
      "fixed": {
        "object": "TERZA FONTANA, ARCO DI SANT\u2019AMBROGIO",
        "id": "02.24_2026",
        "chronology": "XVII secolo",
        "altitude": "724",
        "distance": "938"
      },
      "number": 3,
      "x": 42.49548,
      "y": 41.83351,
      "fileLabel": "Terza_Fontana",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "fm",
      "label": "Fontana del Mos\xE8",
      "kind": "fountain",
      "fixed": {
        "object": "FONTANA DEL MOS\xC8",
        "id": "02.22_2026",
        "chronology": "XIX secolo",
        "altitude": "805",
        "distance": "340"
      },
      "number": 4,
      "x": 39.60217,
      "y": 11.90727,
      "fileLabel": "Fontana_del_Mos\xE8",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "acquedotto",
      "label": "Acquedotto",
      "kind": "aqueduct",
      "fixed": {
        "object": "ACQUEDOTTO",
        "id": "02.12_2026",
        "chronology": "Probabile XVII secolo"
      },
      "fileLabel": "Acquedotto",
      "boldFields": [
        "object",
        "id"
      ]
    },
    {
      "id": "strada",
      "label": "Viale del Santuario e delle Cappelle",
      "kind": "road",
      "fixed": {
        "object": "VIALE DEL SANTUARIO E DELLE CAPPELLE",
        "id": "02.23_2026",
        "chronology": "XVII secolo"
      },
      "fileLabel": "Viale",
      "boldFields": [
        "object",
        "id"
      ]
    }
  ];

  // js/legacy.js
  async function migrateLegacy(legacy, assets2) {
    if ((legacy == null ? void 0 : legacy.version) !== 3 || !legacy.values || !legacy.meta)
      throw Error("Formato della bozza precedente non riconosciuto.");
    const id = "c" + String(legacy.meta.chapel || legacy.map).padStart(2, "0");
    if (!assets2.some((a) => a.id === id))
      throw Error("La vecchia bozza non contiene una cappella valida.");
    const out = newState(id), v = legacy.values, c = legacy.checks || {};
    const value = (id2) => String(v[id2] ?? "");
    for (const [id2, key] of [
      ["0", "id"],
      ["1", "date"],
      ["2", "time"],
      ["4", "object"],
      ["5", "chronology"],
      ["6", "author"],
      ["7", "altitude"],
      ["8", "distance"],
      ["9", "subject"],
      ["10", "height"],
      ["11", "width"],
      ["12", "depth"],
      ["13", "materials"]
    ])
      out.general[key] = value(id2);
    if (!out.general.date) out.general.date = legacy.meta.date || "";
    for (const key of ["altitude", "distance", "height", "width", "depth"])
      out.general[key] = out.general[key].replace(".", ",");
    if (legacy.meta.name) {
      out.filename = legacy.meta.name;
      out.customFilename = true;
    }
    out.history.restorations = [
      { ...historyRecord(), date: value("28"), action: value("29") }
    ].filter((row) => row.date.trim() || row.action.trim());
    out.history.maintenance = [
      { ...historyRecord(), date: value("30"), action: value("31") }
    ].filter((row) => row.date.trim() || row.action.trim());
    const condition = {
      ...conditionRecord(),
      exposure: value("32"),
      assessment: value("36"),
      methods: METHODS.filter((_, i) => c[String(33 + i)])
    };
    if (condition.exposure.trim() || condition.assessment.trim() || condition.methods.length)
      out.conditions.push(condition);
    out.diagnosis = [];
    for (let i = 0; i < 9; i++) {
      const start = 37 + i * 5, values = Array.from({ length: 5 }, (_, j) => value(String(start + j)));
      if (!values.some(Boolean)) continue;
      const row = diagnosisRecord();
      [row.area, row.element, row.pathology, row.causes] = values;
      row.risk = ["BASSO", "MEDIO", "ALTO"].find(
        (r) => values[4].toUpperCase().includes(r)
      ) || "";
      out.diagnosis.push(row);
    }
    out.priorities = [];
    for (const [risk, ids, extra] of [
      ["BASSO", [82, 83, 84, 85], null],
      ["MEDIO", [89, 88, 87, 86], "extra4"],
      ["ALTO", [93, 92, 91, 90], "extra5"]
    ]) {
      const windowIndex = ids.findIndex((id2) => c[String(id2)]);
      const anomalies = extra ? value(extra) : "";
      if (windowIndex < 0 && !anomalies) continue;
      const row = priorityRecord();
      row.risk = risk;
      row.window = WINDOWS[windowIndex] || "";
      row.anomalies = anomalies;
      out.priorities.push(row);
    }
    out.inspectionNotes = value("94");
    out.immediate.date = out.general.date;
    out.preventive.date = out.general.date;
    out.immediate.records = [];
    for (const [area, action] of [
      ["106", "107"],
      ["109", "110"]
    ])
      if (value(area) || value(action))
        out.immediate.records.push({
          id: crypto.randomUUID(),
          area: value(area),
          action: value(action)
        });
    out.immediate.notes = [value("105"), value("108")].filter(Boolean).join("\n");
    out.preventive.notes = value("157");
    const actions = [
      ["121", "122", "123", "extra0", [124, 128, 129], [125, 126, 127]],
      ["130", "132", "131", "extra1", [136, 137, 138], [133, 134, 135]],
      ["139", "141", "140", "extra2", [145, 146, 147], [142, 143, 144]],
      ["148", "150", "149", "extra3", [154, 155, 156], [151, 152, 153]]
    ];
    let target = out.diagnosis.find(
      (r) => r.area === value("117") && r.element === value("118")
    );
    for (const [
      action,
      objective,
      operator,
      description,
      roles,
      statuses
    ] of actions) {
      if (![action, objective, operator, description].some((id2) => value(id2)) && !roles.some((id2) => c[id2]) && !statuses.some((id2) => c[id2]))
        continue;
      if (!target) {
        target = diagnosisRecord();
        target.area = value("117");
        target.element = value("118");
        out.diagnosis.push(target);
      }
      const row = preventiveRecord();
      row.action = value(action);
      row.objective = value(objective);
      row.operator = value(operator);
      row.description = value(description);
      row.risk = ["BASSO", "MEDIO", "ALTO"].find(
        (r) => value("119").toUpperCase().includes(r)
      ) || "";
      row.window = WINDOWS.find((w) => value("120").toUpperCase().includes(w)) || "";
      row.role = ROLES[roles.findIndex((id2) => c[id2])] || "";
      row.status = STATUSES[statuses.findIndex((id2) => c[id2])] || "";
      target.actions.push(row);
    }
    for (const data of Object.values(legacy.photos || {})) {
      if (!data) continue;
      const image = new Image();
      image.src = data;
      await image.decode();
      out.photos.push({
        id: crypto.randomUUID(),
        data,
        width: image.naturalWidth,
        height: image.naturalHeight
      });
    }
    return applyFixed(out, assets2, { initialize: false });
  }

  // js/config.js
  var VERSION = "3.6.26";
  var PWA_URL = "https://alessandromandelli.github.io/SMV/";

  // js/pdf-layout.js
  var PAGE = Object.freeze({
    width: 792,
    height: 612,
    margin: 28.8,
    bottom: 550
  });
  var BODY_WIDTH = PAGE.width - PAGE.margin * 2;
  var TYPE = Object.freeze({
    body: 9.5,
    leading: 11.4,
    section: 10,
    title: 13
  });
  var clean = (value) => String(value ?? "").normalize("NFC").replace(/\r\n?/g, "\n").replace(/ {2,}/g, "	");
  var hasText = (value) => clean(value).trim().length > 0;
  var COLORS = Object.freeze({
    ink: "#1e3232",
    green: "#005b60",
    border: "#d9dddd",
    header: "#b9b9b9",
    alternate: "#f4f7f6",
    priority: "#e8f1f2",
    notes: "#f2f2f2"
  });
  var riskColor = (value) => ({ BASSO: "#196e33", MEDIO: "#946b00", ALTO: "#b81010" })[value] || COLORS.ink;
  var PdfReport = class {
    constructor(pdf, api, fonts, images, state2, capture = null) {
      Object.assign(this, { pdf, api, fonts, images, state: state2 });
      this.capture = capture;
      this.layoutPages = /* @__PURE__ */ new Map();
      this.tableCounter = 0;
      this.activeTable = null;
      this.tables = {};
      this.glyphWidths = /* @__PURE__ */ new Map();
      this.photoImages = /* @__PURE__ */ new Map();
      this.characters = new Map(
        Object.values(fonts).map((font) => [
          font,
          new Set(font.getCharacterSet())
        ])
      );
    }
    record(page, operation) {
      var _a;
      if (this.capture) (_a = this.layoutPages.get(page)) == null ? void 0 : _a.push({ ...operation, table: this.activeTable });
    }
    beginTable(headers, widths) {
      if (!this.capture) return;
      this.activeTable = ++this.tableCounter;
      this.tables[this.activeTable] = { headers, widths };
    }
    endTable() {
      this.activeTable = null;
    }
    color(hex) {
      const n = parseInt(hex.replace("#", ""), 16);
      return this.api.rgb(
        (n >> 16 & 255) / 255,
        (n >> 8 & 255) / 255,
        (n & 255) / 255
      );
    }
    font(char, bold = false) {
      const preferred = bold ? this.fonts.bold : this.fonts.regular;
      if (this.characters.get(preferred).has(char.codePointAt(0)))
        return preferred;
      const fallback = bold ? this.fonts.fallbackBold : this.fonts.fallback;
      if (!this.characters.get(fallback).has(char.codePointAt(0)))
        throw Error("Carattere PDF non disponibile: " + char);
      return fallback;
    }
    width(value, size = TYPE.body, bold = false) {
      return [...clean(value)].reduce(
        (total, char) => {
          if (char === "	") return (Math.floor(total / 36) + 1) * 36;
          if (char === "\n") return total;
          const font = this.font(char, bold);
          if (!this.glyphWidths.has(font)) this.glyphWidths.set(font, /* @__PURE__ */ new Map());
          const sizes = this.glyphWidths.get(font);
          if (!sizes.has(size)) sizes.set(size, /* @__PURE__ */ new Map());
          const glyphs = sizes.get(size);
          if (!glyphs.has(char)) glyphs.set(char, font.widthOfTextAtSize(char, size));
          return total + glyphs.get(char);
        },
        0
      );
    }
    photoImage(photo) {
      if (!this.photoImages.has(photo.data)) {
        const embed = photo.data.startsWith("data:image/png") ? "embedPng" : photo.data.startsWith("data:image/jpeg") ? "embedJpg" : null;
        if (!embed) throw Error("Le fotografie per il PDF devono essere JPEG o PNG.");
        this.photoImages.set(photo.data, this.pdf[embed](photo.data.split(",")[1]));
      }
      return this.photoImages.get(photo.data);
    }
    text(page, value, x, top, { size = TYPE.body, bold = false, color = COLORS.ink } = {}) {
      const valueText = clean(value);
      if (!hasText(valueText)) return;
      this.record(page, { type: "text", text: valueText, x, top, size, bold, color, width: this.width(valueText, size, bold) });
      let run2 = "", font = null, at2 = x;
      const flush = () => {
        if (!run2) return;
        if (hasText(run2))
          page.drawText(run2, {
            x: at2,
            y: PAGE.height - top - size * 0.905,
            size,
            font,
            color: this.color(color)
          });
        at2 += font.widthOfTextAtSize(run2, size);
        run2 = "";
      };
      for (const char of valueText) {
        if (char === "\n") continue;
        if (char === "	") {
          flush();
          at2 = x + (Math.floor((at2 - x) / 36) + 1) * 36;
          continue;
        }
        const next = this.font(char, bold);
        if (font && next !== font) flush();
        font = next;
        run2 += char;
      }
      flush();
    }
    wrap(value, width, size = TYPE.body, bold = false) {
      const result = [];
      for (const paragraph of clean(value).split("\n")) {
        let line = "";
        for (const token of paragraph.match(/\S+\s*|\s+/g) || [""]) {
          if (this.width(line + token, size, bold) <= width) {
            line += token;
            continue;
          }
          if (line.trim()) {
            result.push(line.trimEnd());
            line = "";
          }
          for (const char of token) {
            if (this.width(line + char, size, bold) > width && line) {
              result.push(line.trimEnd());
              line = "";
            }
            line += char;
          }
        }
        result.push(line.trimEnd());
      }
      return result;
    }
    rect(page, x, top, width, height, { fill, border, borderWidth = 0.5 } = {}) {
      this.record(page, { type: "rect", x, top, width, height, fill, border, borderWidth });
      page.drawRectangle({
        x,
        y: PAGE.height - top - height,
        width,
        height,
        ...fill ? { color: this.color(fill) } : {},
        ...border ? { borderColor: this.color(border), borderWidth } : {}
      });
    }
    image(page, image, x, top, width, height) {
      var _a;
      this.record(page, { type: "image", source: (_a = this.capture) == null ? void 0 : _a.sources.get(image), x, top, width, height });
      page.drawImage(image, { x, y: PAGE.height - top - height, width, height });
    }
    band(page, title, top, x = PAGE.margin, width = BODY_WIDTH) {
      this.rect(page, x, top, width, 18, { fill: COLORS.green });
      this.text(page, title, x + 4, top + 3.2, {
        size: TYPE.section,
        bold: true,
        color: "#ffffff"
      });
    }
    checkbox(page, x, top, label2, selected, { size = 8.2, fontSize = TYPE.body } = {}) {
      this.rect(page, x, top, size, size, {
        fill: "#ffffff",
        border: COLORS.ink,
        borderWidth: 0.65
      });
      if (selected) {
        const line = (a, b) => page.drawLine({
          start: { x: x + a[0], y: PAGE.height - top - a[1] },
          end: { x: x + b[0], y: PAGE.height - top - b[1] },
          thickness: 0.9,
          color: this.color(COLORS.green)
        });
        line([1, size * 0.52], [size * 0.4, size * 0.87]);
        line([size * 0.4, size * 0.87], [size - 1, 1]);
      }
      if (label2)
        this.text(page, label2, x + size + 4, top - 0.4, { size: fontSize });
    }
    choiceLines(options, width, size = TYPE.body) {
      const lines = [];
      let line = [], used = 0;
      for (const label2 of options) {
        const w = this.width(label2, size) + 22;
        if (line.length && used + w > width) {
          lines.push(line);
          line = [];
          used = 0;
        }
        line.push({ label: label2, offset: used });
        used += w;
      }
      if (line.length) lines.push(line);
      return lines;
    }
    choices(page, options, selected, x, top, width) {
      const lines = this.choiceLines(options, width);
      lines.forEach(
        (line, i) => line.forEach(
          (item) => this.checkbox(
            page,
            x + item.offset,
            top + i * 16,
            item.label,
            Array.isArray(selected) ? selected.includes(item.label) : selected === item.label
          )
        )
      );
      return lines.length * 16;
    }
    label(page, label2, value, x, top, width, { bold = true, boldValue = false, size = TYPE.body, valueSize = size, minHeight = 12.5 } = {}) {
      const valueX = x + this.width(label2, size, bold) + 5;
      const leading = Math.max(TYPE.leading, valueSize * 1.2);
      const valueTop = top + (size - valueSize) * 0.905;
      const lines = this.wrap(value, Math.max(25, width - (valueX - x)), valueSize, boldValue);
      this.text(page, label2, x, top, { bold, size });
      lines.forEach(
        (line, i) => this.text(page, line, valueX, valueTop + i * leading, { size: valueSize, bold: boldValue })
      );
      return Math.max(minHeight, lines.length * leading);
    }
    header(page, kind, meta) {
      const x = PAGE.margin + 92;
      this.image(page, this.images.anniversary, PAGE.margin, 31.6, 70.6, 15);
      this.image(page, this.images.logo, PAGE.margin, 62.5, 70.6, 108.5);
      this.text(
        page,
        kind === "immediate" ? "REGISTRO INTERVENTI DI MANUTENZIONE IMMEDIATA" : "PROGRAMMAZIONE AZIONI PREVENTIVE",
        x,
        29.2,
        { size: 13, bold: true, color: COLORS.green }
      );
      let y = 60.8;
      for (const [label2, value] of [
        ["ID Scheda:", this.state.general.id],
        ["Data:", hasText(this.state.general.date) ? displayDate(meta.date) : ""]
      ]) {
        const valueSize = label2 === "ID Scheda:" ? 12 : TYPE.body;
        const boldValue = label2 === "ID Scheda:" && isGeneralBold(this.state, "id");
        const valueWidth = 346.6 - this.width(label2, TYPE.body, true) - 5;
        const height = Math.max(
          14.5,
          this.wrap(value, valueWidth, valueSize, boldValue).length * Math.max(TYPE.leading, valueSize * 1.2) + 3
        );
        this.rect(page, x - 1, y - 2, 356.6, height, {
          fill: "#d9d9d9"
        });
        this.label(page, label2, value, x, y, 346.6, {
          minHeight: height,
          boldValue,
          valueSize
        });
        y += height;
      }
      y = Math.max(102.3, y + 12);
      y += this.label(
        page,
        "Oggetto:",
        this.state.general.object,
        x,
        y,
        PAGE.width - PAGE.margin - x,
        { boldValue: isGeneralBold(this.state, "object") }
      );
      y += this.label(page, "Operatori:", COMMON.company, x, y, 620);
      y += this.label(page, "Restauratore capofila:", COMMON.operator, x, y, 620);
      y += 12.5;
      y += this.label(
        page,
        "Interventi autorizzati da:",
        COMMON.authorization,
        x,
        y,
        620
      );
      return Math.max(194, y + 16);
    }
    page(kind = "inspection", meta = {}, { continuation = false } = {}) {
      const page = this.pdf.addPage([PAGE.width, PAGE.height]);
      if (this.capture) {
        this.layoutPages.set(page, []);
        for (const method of ["drawLine", "drawCircle"]) {
          const draw = page[method].bind(page);
          page[method] = (options) => {
            this.record(page, { type: method, ...options });
            return draw(options);
          };
        }
      }
      const y = !continuation && ["immediate", "preventive"].includes(kind) ? this.header(page, kind, meta) : PAGE.margin;
      return { page, y };
    }
    finish() {
      const pages = this.pdf.getPages();
      const logoTop = 563, logoHeight = 34.9;
      const footerTextTop = (size) => logoTop + logoHeight - size * 0.905;
      const footer = "Via Matteotti 8, 21030 Castello Cabiaglio (VA) \u2013 C.F./P.IVA 02507710396 \u2013 info@cromorestauri.com \u2013 PEC \u2013 cromorestauri@sicurezzapostale.it";
      pages.forEach((page, i) => {
        this.image(page, this.images.footer, PAGE.margin, logoTop, 113.5, logoHeight);
        this.text(page, "s.c.ar.l.", PAGE.margin + 120, footerTextTop(11), {
          size: 11,
          color: "#d8a30a"
        });
        let size = 7.5;
        while (this.width(footer, size) > BODY_WIDTH - 166 && size > 5.5)
          size -= 0.25;
        this.text(page, footer, PAGE.margin + 166, footerTextTop(size), { size });
        const count = `${i + 1}/${pages.length}`;
        this.text(
          page,
          count,
          PAGE.width - PAGE.margin - this.width(count, 7.5),
          586,
          { size: 7.5 }
        );
      });
    }
  };
  var Flow = class {
    constructor(report, kind = "inspection", meta = {}, region = {}) {
      Object.assign(this, {
        report,
        kind,
        meta,
        x: PAGE.margin,
        width: BODY_WIDTH
      });
      Object.assign(
        this,
        region.page ? { page: region.page, y: region.y } : report.page(kind, meta)
      );
      Object.assign(this, region);
    }
    next() {
      Object.assign(
        this,
        this.report.page(this.kind, this.meta, { continuation: true })
      );
      if (this.firstColumn) {
        this.x = PAGE.margin;
        this.width = BODY_WIDTH;
        this.firstColumn = false;
      }
    }
    freshHeight() {
      return PAGE.bottom - PAGE.margin;
    }
    ensure(height) {
      if (this.y + height > PAGE.bottom) this.next();
    }
    section(title, minFollowing = 0) {
      this.ensure(18 + (minFollowing ? 14 + minFollowing : 0));
      this.report.band(this.page, title, this.y, this.x, this.width);
      this.y += 32;
    }
    paragraphHeight(label2, value, { size = TYPE.body, labelSize = size, indent = 0, boldLabel = true, boldValue = false } = {}) {
      const start = label2 ? this.report.width(label2, labelSize, boldLabel) + 5 : 0;
      return this.report.wrap(value, this.width - indent - start, size, boldValue).length * (Math.max(size, labelSize) * 1.2) + 6;
    }
    paragraph(label2, value, {
      showEmpty = false,
      size = TYPE.body,
      labelSize = size,
      indent = 0,
      boldLabel = true,
      boldValue = false,
      color = COLORS.ink,
      keepTogether = true,
      after = 6
    } = {}) {
      if (!showEmpty && !hasText(value)) return;
      const start = label2 ? this.report.width(label2, labelSize, boldLabel) + 5 : 0;
      const leading = Math.max(size, labelSize) * 1.2;
      const lines = this.report.wrap(
        value,
        Math.max(30, this.width - indent - start),
        size,
        boldValue
      );
      const height = lines.length * leading + after;
      if (keepTogether && height <= this.freshHeight()) this.ensure(height);
      let offset = 0;
      while (offset < lines.length) {
        if (this.y + leading > PAGE.bottom) this.next();
        const count = Math.max(1, Math.floor((PAGE.bottom - this.y) / leading));
        if (label2)
          this.report.text(this.page, label2, this.x + indent, this.y, {
            size: labelSize,
            bold: boldLabel
          });
        lines.slice(offset, offset + count).forEach(
          (line, i) => this.report.text(
            this.page,
            line,
            this.x + indent + start,
            this.y + i * leading,
            { size, color, bold: boldValue }
          )
        );
        const taken = Math.min(count, lines.length - offset);
        this.y += taken * leading;
        offset += taken;
        if (offset < lines.length) this.next();
      }
      this.y += after;
    }
    box(label2, value, { fill = COLORS.notes, minHeight = 40, anchorBottom = false } = {}) {
      if (!hasText(value)) return;
      const lines = this.report.wrap(value, this.width - 16, TYPE.body);
      const total = 18 + lines.length * TYPE.leading + 8;
      if (total <= this.freshHeight())
        this.ensure(Math.max(minHeight, total));
      let offset = 0;
      while (offset < lines.length) {
        if (this.y + 40 > PAGE.bottom) this.next();
        const count = Math.max(
          1,
          Math.floor((PAGE.bottom - this.y - 26) / TYPE.leading)
        );
        const taken = Math.min(count, lines.length - offset);
        const height = Math.max(
          Math.min(minHeight, PAGE.bottom - this.y),
          26 + taken * TYPE.leading
        );
        if (anchorBottom && offset + taken === lines.length) this.y = Math.max(this.y, PAGE.bottom - height);
        this.report.rect(this.page, this.x, this.y, this.width, height, {
          fill,
          border: COLORS.green,
          borderWidth: 0.5
        });
        this.report.text(this.page, label2, this.x + 4, this.y + 4, {
          bold: true
        });
        lines.slice(offset, offset + taken).forEach(
          (line, i) => this.report.text(
            this.page,
            line,
            this.x + 4,
            this.y + 19 + i * TYPE.leading
          )
        );
        this.y += height + 12;
        offset += taken;
        if (offset < lines.length) this.next();
      }
    }
    table(headers, rows, proportions, { riskColumn = -1, rowFill = null } = {}) {
      if (!rows.length) return;
      const resolutionColumn = headers.findIndex((title) => /^risolto in data$/i.test(title));
      rows = rows.map((row) => row.map((value, i) => i === resolutionColumn && !hasText(value) ? "-" : value));
      const isBold = (value, i) => i === resolutionColumn && value !== "-";
      const total = proportions.reduce((a, b) => a + b, 0);
      const widths = proportions.map((w) => w / total * this.width);
      this.report.beginTable(headers, widths);
      const xs = [this.x];
      widths.forEach((w) => xs.push(xs.at(-1) + w));
      const headerHeight = Math.max(
        20,
        ...headers.map(
          (h, i) => this.report.wrap(h, widths[i] - 8, 9.5, true).length * 11.4 + 8
        )
      );
      const header = () => {
        this.report.rect(this.page, this.x, this.y, this.width, headerHeight, {
          fill: COLORS.header
        });
        headers.forEach(
          (h, i) => this.report.wrap(h, widths[i] - 8, 9.5, true).forEach(
            (line, j) => this.report.text(
              this.page,
              line,
              xs[i] + 4,
              this.y + 4 + j * 11.4,
              { size: 9.5, bold: true, color: "#ffffff" }
            )
          )
        );
        this.y += headerHeight;
      };
      const firstRowHeight = Math.max(...rows[0].map((value, i) => this.report.wrap(value, widths[i] - 8, TYPE.body, isBold(value, i)).length)) * TYPE.leading + 8;
      this.ensure(headerHeight + Math.min(firstRowHeight, this.freshHeight() - headerHeight));
      header();
      const next = () => {
        this.next();
        header();
      };
      rows.forEach((row, index) => {
        const cells = row.map(
          (value, i) => this.report.wrap(value, widths[i] - 8, TYPE.body, isBold(value, i))
        );
        const lineCount = Math.max(...cells.map((c) => c.length));
        const whole = lineCount * TYPE.leading + 8;
        const fullCapacity = this.freshHeight() - headerHeight;
        if (this.y + whole > PAGE.bottom && whole <= fullCapacity) next();
        let offset = 0;
        while (offset < lineCount) {
          if (this.y + TYPE.leading + 8 > PAGE.bottom) next();
          const count = Math.min(
            lineCount - offset,
            Math.max(1, Math.floor((PAGE.bottom - this.y - 8) / TYPE.leading))
          );
          const height = count * TYPE.leading + 8;
          cells.forEach((lines, i) => {
            this.report.rect(this.page, xs[i], this.y, widths[i], height, {
              fill: rowFill || (index % 2 ? COLORS.alternate : "#ffffff"),
              border: COLORS.border
            });
            const fragment = offset > 0 && lines.length <= offset ? lines : lines.slice(offset, offset + count);
            fragment.slice(0, count).forEach(
              (line, j) => this.report.text(
                this.page,
                line,
                i === resolutionColumn && row[i] === "-" ? xs[i] + (widths[i] - this.report.width(line)) / 2 : xs[i] + 4,
                this.y + (i === resolutionColumn && row[i] === "-" ? (height - TYPE.body) / 2 : 4) + j * TYPE.leading,
                {
                  color: i === riskColumn ? riskColor(row[i]) : COLORS.ink,
                  bold: isBold(row[i], i)
                }
              )
            );
          });
          this.y += height;
          offset += count;
          if (offset < lineCount) next();
        }
      });
      this.report.endTable();
      this.y += 12;
    }
  };

  // js/pdf.js
  var files = /* @__PURE__ */ new Map();
  async function resource(path) {
    if (!files.has(path))
      files.set(
        path,
        fetch(path).then((response) => {
          if (!response.ok) throw Error("Risorsa PDF non disponibile: " + path);
          return response.arrayBuffer();
        }).catch((error) => {
          files.delete(path);
          throw error;
        })
      );
    return new Uint8Array(await files.get(path));
  }
  var dependencies;
  function loadScript(src, globalName) {
    if (window[globalName]) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = src;
      script.onload = () => window[globalName] ? resolve() : reject(Error("Libreria PDF non inizializzata."));
      script.onerror = () => {
        script.remove();
        reject(
          Error(
            "Caricamento PDF non riuscito. Apri il sito GitHub Pages con connessione e riprova."
          )
        );
      };
      document.head.append(script);
    });
  }
  async function libraries() {
    if (!dependencies)
      dependencies = Promise.all([
        loadScript("./vendor/pdf-lib.min.js", "PDFLib"),
        loadScript("./vendor/fontkit.umd.min.js", "fontkit")
      ]).catch((error) => {
        dependencies = null;
        throw error;
      });
    await dependencies;
  }
  var HISTORY_TITLE = "3. STORICO MANUTENTIVO";
  var CONDITION_TITLE = "4. STATO CONSERVATIVO ATTUALE";
  var DIAGNOSIS_TITLE = "5. DIAGNOSTICA DEL DEGRADO E PRIORIT\xC0 DI INTERVENTO";
  var PHOTO_TITLE = "6. ATLANTE FOTOGRAFICO";
  var IMMEDIATE_TITLE = "INTERVENTI ESEGUITI";
  var PREVENTIVE_TITLE = "AZIONI PREVENTIVE";
  var actionHasContent = (action) => Object.entries(action).some(([key, value]) => key !== "id" && hasText(value));
  function identification(report, state2, assets2) {
    const { page } = report.page("first");
    const left = PAGE.margin, columnWidth = 371.2, textX = left + 92;
    const logoTop = PAGE.margin + 25.95;
    report.image(page, report.images.anniversary, left, PAGE.margin + 1.95, 70.6, 15);
    report.image(page, report.images.logo, left, logoTop, 70.6, 108.5);
    report.text(page, "SCHEDA DI ISPEZIONE PERIODICA", textX, PAGE.margin, {
      size: 13,
      bold: true,
      color: COLORS.green
    });
    let headerY = PAGE.margin + 26.6;
    for (const [label2, value] of [
      ["ID Scheda:", state2.general.id],
      ["Data:", displayDate(state2.general.date)],
      ["Ora:", state2.general.time]
    ]) {
      const valueSize = label2 === "ID Scheda:" ? 12 : TYPE.body;
      const boldValue = label2 === "ID Scheda:" && isGeneralBold(state2, "id");
      const valueWidth = 266.2 - report.width(label2, TYPE.body, true) - 5;
      const height = Math.max(
        14.5,
        report.wrap(value, valueWidth, valueSize, boldValue).length * Math.max(TYPE.leading, valueSize * 1.2) + 3
      );
      report.rect(page, textX - 1, headerY - 2, 271.2, height, {
        fill: "#d9d9d9"
      });
      report.label(page, label2, value, textX, headerY, 266.2, {
        minHeight: height,
        boldValue,
        valueSize
      });
      headerY += height;
    }
    headerY = Math.max(PAGE.margin + 66.2, headerY + 8);
    report.text(page, "Operatore: " + COMMON.operator, textX, headerY, {
      bold: true
    });
    headerY += 15;
    const address = `${COMMON.company} \u2013 ${COMMON.address}`;
    const addressLines = report.wrap(address, columnWidth - 92, 8);
    addressLines.forEach(
      (line, i) => report.text(page, line, textX, headerY + i * 10, { size: 8 })
    );
    headerY += addressLines.length * 10 + 1;
    for (const info of [COMMON.email, "PEC \u2013 " + COMMON.pec]) {
      report.text(page, info, textX, headerY, { size: 8 });
      headerY += 11.2;
    }
    const top = Math.max(logoTop + 108.5 + 16, headerY + 20);
    report.band(page, "1. IDENTIFICAZIONE DEL BENE", top, left, columnWidth);
    const flow = new Flow(
      report,
      "inspection",
      {},
      { page, x: left, width: columnWidth, y: top + 30, firstColumn: true }
    );
    const fields = [
      ["Oggetto:", state2.general.object, "object"],
      ["Cronologia:", state2.general.chronology],
      ["Autore:", state2.general.author]
    ];
    fields.forEach(
      ([label2, value, key]) => flow.paragraph(label2, value, { showEmpty: true, boldValue: isGeneralBold(state2, key) })
    );
    const measureRow = (label2, value, x2, width) => report.label(flow.page, label2, value, x2, flow.y, width, {
      minHeight: 17.4
    });
    flow.ensure(18);
    measureRow("Quota s.l.m.:", measureText(state2.general.altitude), flow.x, 125);
    measureRow(
      "Distanza Santuario:",
      measureText(state2.general.distance),
      flow.x + 131,
      flow.width - 131
    );
    flow.y += 17.4;
    flow.paragraph("Complesso:", state2.general.complex, { showEmpty: true });
    flow.paragraph("Ente Proprietario:", state2.general.owner, { showEmpty: true });
    flow.y = Math.max(flow.firstColumn ? top + 150.5 : flow.y + 8, flow.y + 12);
    flow.section("2. SOGGETTO E DATI TECNICO-DIMENSIONALI", 18);
    flow.paragraph("Soggetto:", state2.general.subject, {
      showEmpty: true
    });
    flow.ensure(18);
    const dimensions = [
      ["Dimensioni: H:", state2.general.height],
      ["L:", state2.general.width],
      ["P:", state2.general.depth]
    ];
    const widths = [150, 90, flow.width - 240];
    let x = flow.x, max = 17.4;
    dimensions.forEach(([label2, value], i) => {
      max = Math.max(
        max,
        report.label(flow.page, label2, measureText(value), x, flow.y, widths[i], {
          minHeight: 17.4
        })
      );
      x += widths[i];
    });
    flow.y += max;
    flow.paragraph("Materie e Tecniche:", state2.general.materials, {
      showEmpty: true
    });
    const frame = { x: 428.8, top: 28.8, width: 334.4, height: 523.2 };
    report.rect(page, frame.x, frame.top, frame.width, frame.height, {
      fill: "#f8faf9",
      border: COLORS.green,
      borderWidth: 0.75
    });
    const mapTitle = "LOCALIZZAZIONE BENE";
    report.text(
      page,
      mapTitle,
      frame.x + (frame.width - report.width(mapTitle, 11, true)) / 2,
      PAGE.margin + 4.2,
      { size: 11, bold: true, color: COLORS.green }
    );
    const map = {
      x: frame.x + (frame.width - DOCUMENT_MAP_WIDTH) / 2,
      top: PAGE.margin + 24.45,
      width: DOCUMENT_MAP_WIDTH,
      height: DOCUMENT_MAP_WIDTH * ROAD_SIZE.height / ROAD_SIZE.width
    };
    report.image(page, report.images.map, map.x, map.top, map.width, map.height);
    if (state2.assetId === "strada")
      for (let i = 1; i < ROAD_POINTS.length; i++) {
        const point = ([x2, y]) => ({
          x: map.x + x2 / ROAD_SIZE.width * map.width,
          y: PAGE.height - map.top - y / ROAD_SIZE.height * map.height
        });
        page.drawLine({
          start: point(ROAD_POINTS[i - 1]),
          end: point(ROAD_POINTS[i]),
          thickness: 2.1,
          color: report.color("#d90d14"),
          lineCap: 1,
          opacity: 0.9
        });
      }
    const markerSize = 17.4 * map.width / ROAD_SIZE.width;
    mapAssets(assets2, state2.assetId).forEach(
      (asset2) => report.checkbox(
        page,
        map.x + asset2.x / 100 * map.width - markerSize / 2,
        map.top + asset2.y / 100 * map.height - markerSize / 2,
        "",
        asset2.id === state2.assetId,
        { size: markerSize }
      )
    );
  }
  function historyAndCondition(flow, state2) {
    flow.section(HISTORY_TITLE, 18);
    for (const [key, title] of [
      ["restorations", "Interventi di RESTAURO precedenti"],
      ["maintenance", "Interventi di MANUTENZIONE precedenti"]
    ]) {
      const rows = state2.history[key].filter(
        (r) => [r.date, r.action].some(hasText)
      );
      for (const [index, row] of rows.entries()) {
        const titleHeight = index === 0 ? 18 : 0;
        const height = titleHeight + (hasText(row.date) ? flow.paragraphHeight("Data:", row.date) : 0) + (hasText(row.action) ? TYPE.leading + flow.paragraphHeight("", row.action) : 0) + TYPE.leading;
        const minimum = titleHeight + (hasText(row.date) ? flow.paragraphHeight("Data:", row.date) : 0) + (hasText(row.action) ? TYPE.leading * 2 : 0) + TYPE.leading;
        flow.ensure(height <= flow.freshHeight() ? height : minimum);
        if (index === 0) {
          flow.report.text(flow.page, title, flow.x, flow.y, { bold: true });
          flow.y += titleHeight;
        }
        flow.paragraph("Data:", row.date);
        if (hasText(row.action)) {
          flow.paragraph("Azione:", "", { showEmpty: true, after: 0 });
          flow.paragraph("", row.action, { keepTogether: false });
        }
        flow.y += TYPE.leading;
      }
    }
    flow.section(CONDITION_TITLE, 18);
    for (const row of state2.conditions.filter(
      (r) => [r.exposure, r.assessment].some(hasText) || r.methods.length
    )) {
      const height = (row.date ? flow.paragraphHeight("Data del rilievo:", displayDate(row.date)) : 0) + flow.paragraphHeight("Esposizione:", row.exposure) + flow.paragraphHeight("Valutazione Sintetica:", row.assessment) + (row.methods.length ? 22 : 0);
      flow.ensure(Math.min(height, flow.freshHeight()));
      flow.paragraph("Data del rilievo:", displayDate(row.date));
      flow.paragraph("Esposizione:", row.exposure, {});
      if (row.methods.length) {
        flow.ensure(22);
        flow.report.text(flow.page, "Metodologia Ispezione:", flow.x, flow.y, {
          bold: true
        });
        flow.report.choices(
          flow.page,
          METHODS,
          row.methods,
          flow.x + 124,
          flow.y,
          flow.width - 124
        );
        flow.y += 22;
      }
      flow.paragraph("Valutazione Sintetica:", row.assessment, {});
      flow.y += 6;
    }
  }
  function diagnostics(flow, state2) {
    const rows = state2.diagnosis.filter(diagnosisHasContent).map((r) => [
      r.reference,
      r.area,
      r.element,
      r.pathology,
      r.causes,
      r.risk,
      displayDate(r.detectedDate),
      displayDate(r.resolvedDate)
    ]);
    const weights = [50, 115, 115, 210, 190, 105, 100, 100];
    const total = weights.reduce((a, b) => a + b, 0);
    const firstHeight = rows.length ? Math.max(
      ...rows[0].map(
        (value, i) => flow.report.wrap(value, weights[i] / total * flow.width - 8).length
      )
    ) * TYPE.leading + 8 : 0;
    flow.section(
      DIAGNOSIS_TITLE,
      rows.length ? 32 + Math.min(firstHeight, flow.freshHeight() - 64) : 0
    );
    flow.table(
      [
        "ID",
        "Macro-Area",
        "Elemento",
        "Patologia Riscontrata",
        "Cause Principali",
        "Livello di Rischio",
        "Data del rilievo",
        "Risolto in data"
      ],
      rows,
      weights,
      { riskColumn: 5 }
    );
  }
  function priorities(flow, state2) {
    var _a;
    for (const row of state2.priorities.filter(
      (r) => [r.risk, r.window, r.anomalies].some(hasText)
    )) {
      const r = flow.report, choiceX = flow.x + 180;
      const options = windowsForRisk(row.risk);
      const choiceHeight = hasText(row.window) ? r.choiceLines(options, flow.width - 188).length * 16 : 0;
      const anomalyTop = hasText(row.window) ? 44 + choiceHeight + 4 : 46;
      const anomalyLines = hasText(row.anomalies) ? r.wrap(row.anomalies, flow.width - 16) : [];
      const total = Math.max(
        64,
        anomalyTop + anomalyLines.length * TYPE.leading + 22
      );
      if (total <= flow.freshHeight()) flow.ensure(total);
      let offset = 0, first = true;
      while (first || offset < anomalyLines.length) {
        first = false;
        if (flow.y + anomalyTop + 20 > PAGE.bottom) flow.next();
        const take = Math.max(
          1,
          Math.floor((PAGE.bottom - flow.y - anomalyTop - 22) / TYPE.leading)
        );
        const count = Math.min(take, anomalyLines.length - offset);
        const height = Math.max(64, anomalyTop + count * TYPE.leading + 22);
        r.rect(flow.page, flow.x, flow.y, flow.width, height, {
          fill: COLORS.priority,
          border: COLORS.green,
          borderWidth: 0.6
        });
        r.text(
          flow.page,
          "INDICE DI PRIORIT\xC0 E TEMPISTICHE DI INTERVENTO" + (row.diagnosisId ? " \xB7 PRIORIT\xC0 " + (((_a = state2.diagnosis.find((source) => source.id === row.diagnosisId)) == null ? void 0 : _a.reference) || "") : ""),
          flow.x + 4,
          flow.y + 4,
          { bold: true }
        );
        if (hasText(row.risk)) {
          r.text(flow.page, "Grado d'Urgenza:", flow.x + 4, flow.y + 28, {
            bold: true
          });
          r.text(flow.page, row.risk, flow.x + 104, flow.y + 28, {
            color: riskColor(row.risk)
          });
        }
        if (hasText(row.window)) {
          if (hasText(row.risk))
            r.text(flow.page, ">>>", flow.x + 150, flow.y + 28, { bold: true });
          r.text(
            flow.page,
            "Finestra d'Intervento Programmata:",
            choiceX,
            flow.y + 28,
            { bold: true }
          );
          r.choices(
            flow.page,
            options,
            row.window,
            choiceX,
            flow.y + 44,
            flow.width - 188
          );
        }
        if (anomalyLines.length) {
          r.text(flow.page, "Anomalie attese:", flow.x + 8, flow.y + anomalyTop, {
            bold: true
          });
          anomalyLines.slice(offset, offset + count).forEach(
            (line, i) => r.text(
              flow.page,
              line,
              flow.x + 8,
              flow.y + anomalyTop + 14 + i * TYPE.leading
            )
          );
        }
        flow.y += height + 12;
        offset += count;
        if (offset < anomalyLines.length) flow.next();
      }
    }
  }
  async function photographs(flow, state2) {
    var _a;
    const photos = allPhotos(state2);
    if (!photos.length) flow.section(PHOTO_TITLE);
    flow.box("Note aggiuntive:", state2.inspectionNotes, { minHeight: 60, anchorBottom: true });
    if (!photos.length) return;
    flow.next();
    flow.section(PHOTO_TITLE);
    const r = flow.report, gap = 12, width = (BODY_WIDTH - gap) / 2;
    const dated = surveyEntries(state2).length > 1;
    const groups = dated ? [...new Set(photos.map((p) => p.surveyDate || ""))].map((date) => ({ date, photos: photos.filter((p) => (p.surveyDate || "") === date) })) : [{ date: "", photos }];
    let pageIndex = 0;
    for (const group of groups) {
      const top = dated ? 82 : 65;
      const height = (PAGE.bottom - top - gap) / 2;
      const slots = [];
      for (const photo of group.photos) {
        const lines = ((_a = photo.caption) == null ? void 0 : _a.trim()) ? r.wrap(photo.caption, width) : [];
        const limit = Math.max(1, Math.floor((height - 65) / TYPE.leading));
        slots.push({ photo, lines: lines.slice(0, limit), first: true });
        const continuation = Math.floor((height - 25) / TYPE.leading);
        for (let i = limit; i < lines.length; i += continuation)
          slots.push({ photo, lines: lines.slice(i, i + continuation), first: false });
      }
      for (let offset = 0; offset < slots.length; offset += 4) {
        if (pageIndex++) {
          flow.next();
          flow.section(PHOTO_TITLE);
        }
        if (dated) r.text(flow.page, "Sopralluogo del " + displayDate(group.date), PAGE.margin, 57, { bold: true });
        for (const [slot, item] of slots.slice(offset, offset + 4).entries()) {
          const { photo, lines, first } = item;
          const x = PAGE.margin + slot % 2 * (width + gap), y = top + Math.floor(slot / 2) * (height + gap);
          let textTop = y;
          if (first) {
            const image = await r.photoImage(photo);
            const imageHeight = height - (lines.length + 1) * TYPE.leading - 8;
            const scale = Math.min(width / image.width, imageHeight / image.height);
            r.image(
              flow.page,
              image,
              x + (width - image.width * scale) / 2,
              y + (imageHeight - image.height * scale) / 2,
              image.width * scale,
              image.height * scale
            );
            textTop = y + imageHeight + 5;
          }
          r.text(flow.page, (first ? "Inserita il " : "Didascalia (segue) \xB7 ") + displayDate(photo.insertedDate || photo.surveyDate), x, textTop);
          lines.forEach((line, i) => r.text(flow.page, line, x, textTop + (i + 1) * TYPE.leading));
        }
      }
    }
  }
  function immediate(report, state2) {
    const rows = maintenanceEntries(state2).filter(
      (r) => [r.area, r.action, r.date].some(hasText)
    );
    const flow = new Flow(report, "immediate", {
      date: state2.immediate.date
    });
    const dated = surveyEntries(state2).length > 1;
    flow.section(IMMEDIATE_TITLE, rows.length ? 20 : 0);
    rows.forEach((row) => {
      const headers = ["ID", "Macro-Area", "Elemento", "Patologia", "Cause principali", "Eseguito in data"];
      const values = [
        row.reference,
        row.area,
        row.element,
        row.pathology,
        row.causes,
        displayDate(row.date || state2.immediate.executedDate)
      ];
      const weights = [700, 2700, 2700, 3860, 3100, 1900];
      const total = weights.reduce((sum, width) => sum + width, 0);
      const widths = weights.map((width) => width / total * flow.width - 8);
      const tableHeight = Math.max(20, ...headers.map((text, i) => report.wrap(text, widths[i], 9.5, true).length * 11.4 + 8)) + Math.max(...values.map((text, i) => report.wrap(text, widths[i]).length)) * TYPE.leading + 20;
      const height = tableHeight + (dated ? flow.paragraphHeight("Sopralluogo:", displayDate(row.surveyDate)) : 0) + (hasText(row.action) ? flow.paragraphHeight("Azioni condotte in loco:", row.action) : 0) + 12;
      const keepTogether = height <= flow.freshHeight();
      flow.ensure(keepTogether ? height : 18);
      if (dated) flow.paragraph("Sopralluogo:", displayDate(row.surveyDate), { keepTogether });
      flow.table(headers, [values], weights);
      flow.paragraph("Azioni condotte in loco:", row.action, { keepTogether });
      flow.y += 12;
    });
    flow.box("Note aggiuntive:", state2.immediate.notes, {
      minHeight: 80,
      anchorBottom: true
    });
  }
  function actionPackage(flow, action) {
    const r = flow.report;
    const entries = [
      ["Descrizione:", action.description, 0],
      ["Azione:", action.action, 1],
      ["Obiettivo:", action.objective, 1],
      ["Operatore:", action.operator, 1]
    ].filter(([, value]) => hasText(value));
    const height = entries.reduce(
      (h, [label2, value, level]) => h + flow.paragraphHeight(label2, value, { indent: level ? 72 : 36 }),
      0
    ) + (hasText(action.risk) || hasText(action.window) ? 40 : 0) + (action.role ? 56 : action.status ? 24 : 0);
    flow.ensure(Math.min(height, flow.freshHeight()));
    if (hasText(action.risk) || hasText(action.window)) {
      const options = windowsForRisk(action.risk);
      const choiceHeight = hasText(action.window) ? r.choiceLines(options, flow.width - 188).length * 16 : 0;
      flow.ensure(24 + choiceHeight);
      if (hasText(action.risk)) {
        r.text(flow.page, "Grado d'Urgenza:", flow.x + 4, flow.y, { bold: true });
        r.text(flow.page, action.risk, flow.x + 104, flow.y, {
          color: riskColor(action.risk)
        });
      }
      if (hasText(action.window)) {
        if (hasText(action.risk))
          r.text(flow.page, ">>>", flow.x + 150, flow.y, { bold: true });
        r.text(flow.page, "Finestra d'Intervento:", flow.x + 180, flow.y, {
          bold: true
        });
        r.choices(
          flow.page,
          options,
          action.window,
          flow.x + 180,
          flow.y + 16,
          flow.width - 188
        );
      }
      flow.y += 24 + choiceHeight;
    }
    entries.forEach(([label2, value, level]) => {
      const indent = level ? 72 : 36;
      const h = flow.paragraphHeight(label2, value, { indent, labelSize: 10 });
      flow.ensure(Math.min(h, flow.freshHeight()));
      flow.page.drawCircle({
        x: flow.x + (level ? 56 : 20),
        y: PAGE.height - flow.y - 5,
        size: level ? 1.8 : 1.9,
        borderColor: r.color(COLORS.ink),
        borderWidth: 0.6,
        ...!level ? { color: r.color(COLORS.ink) } : {}
      });
      flow.paragraph(label2, value, {
        indent,
        labelSize: 10
      });
    });
    if (action.role || action.status) {
      flow.ensure(action.role ? 56 : 24);
      if (action.role)
        ROLES.forEach(
          (label2, i) => r.checkbox(
            flow.page,
            flow.x + 72,
            flow.y + i * 16,
            label2,
            label2 === action.role,
            { fontSize: 10 }
          )
        );
      if (action.status) {
        r.text(flow.page, "Stato:", flow.x + 312.5, flow.y, {
          bold: true,
          size: 10
        });
        STATUSES.forEach(
          (label2, i) => r.checkbox(
            flow.page,
            flow.x + [355.1, 440.3, 539.7][i],
            flow.y,
            label2,
            label2 === action.status,
            { fontSize: 10 }
          )
        );
      }
      flow.y += action.role ? 56 : 24;
    }
    flow.y += 12;
  }
  function preventive(report, state2) {
    const rows = preventiveGroups(state2);
    const flow = new Flow(report, "preventive", { date: state2.preventive.date });
    flow.section(PREVENTIVE_TITLE, rows.length ? 40 : 0);
    rows.forEach((row, index) => {
      const actions = row.actions.filter(actionHasContent);
      const headers = ["ID", "Macro-Area", "Elemento", "Patologia Riscontrata", "Cause Principali", "Data del rilievo", "Risolto in data"];
      const values = [row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row.detectedDate), displayDate(row.resolvedDate)];
      const weights = [650, 2200, 2200, 3300, 2600, 1800, 1800];
      const sum = weights.reduce((total, width) => total + width, 0);
      const contextHeight = Math.max(
        ...values.map(
          (value, i) => report.wrap(value, weights[i] / sum * flow.width - 8).length
        )
      ) * TYPE.leading + 40;
      const actionHeight = actions.reduce(
        (total, a) => total + ["description", "action", "objective", "operator"].reduce(
          (n, key) => n + (hasText(a[key]) ? flow.paragraphHeight(key + ":", a[key], { indent: 72 }) : 0),
          0
        ) + (a.risk || a.window ? 40 : 0) + (a.role ? 56 : a.status ? 24 : 0) + 12,
        0
      );
      const height = contextHeight + actionHeight;
      if (index)
        flow.ensure(
          height <= flow.freshHeight() ? height : Math.min(contextHeight + 40, flow.freshHeight())
        );
      flow.paragraph("Azioni preventive programmate il", displayDate(row.programmedDate));
      if (values.some(hasText))
        flow.table(headers, [values], weights, { rowFill: row.resolvedDate ? "#e4f3e6" : null });
      actions.forEach((action) => actionPackage(flow, action));
      flow.y += 8;
    });
    flow.box("Note aggiuntive:", state2.preventive.notes, {
      minHeight: 80,
      anchorBottom: true
    });
  }
  async function makePdf(state2, assets2, { layout = false, includePdf = false } = {}) {
    await libraries();
    const api = window.PDFLib, pdf = await api.PDFDocument.create();
    pdf.registerFontkit(window.fontkit);
    const sources = /* @__PURE__ */ new WeakMap();
    if (layout) for (const method of ["embedPng", "embedJpg"]) {
      const embed = pdf[method].bind(pdf);
      pdf[method] = async (data) => {
        const image = await embed(data);
        sources.set(image, { data, extension: method === "embedPng" ? "png" : "jpg" });
        return image;
      };
    }
    const fontPaths = {
      regular: "source-arial.ttf",
      bold: "source-arial-bold.ttf",
      fallback: "sans-regular.ttf",
      fallbackBold: "sans-bold.ttf"
    };
    const fonts = Object.fromEntries(
      await Promise.all(
        Object.entries(fontPaths).map(async ([key, file]) => [
          key,
          await pdf.embedFont(await resource("./assets/" + file), {
            subset: true
          })
        ])
      )
    );
    const imagePaths = {
      anniversary: "branding/anniversary.png",
      logo: "branding/logo.jpg",
      footer: "branding/footer.jpg",
      map: "map.jpg"
    };
    const images = Object.fromEntries(
      await Promise.all(
        Object.entries(imagePaths).map(async ([key, file]) => [
          key,
          file.endsWith(".png") ? await pdf.embedPng(await resource("./assets/" + file)) : await pdf.embedJpg(await resource("./assets/" + file))
        ])
      )
    );
    const report = new PdfReport(pdf, api, fonts, images, state2, layout ? { sources } : null);
    identification(report, state2, assets2);
    const inspection = new Flow(report);
    historyAndCondition(inspection, state2);
    diagnostics(inspection, state2);
    priorities(inspection, state2);
    await photographs(inspection, state2);
    immediate(report, state2);
    preventive(report, state2);
    report.finish();
    const documentLayout = layout ? { pages: [...report.layoutPages.values()], tables: report.tables } : null;
    if (layout && !includePdf) return documentLayout;
    pdf.setTitle(baseName(state2, assets2));
    pdf.setAuthor(COMMON.company);
    pdf.setCreator("Schede Restauro " + VERSION);
    const blob = new Blob([await pdf.save()], { type: "application/pdf" });
    return layout ? { layout: documentLayout, pdf: blob } : blob;
  }

  // js/zip.js
  var loading;
  async function zipLibrary() {
    if (window.JSZip) return window.JSZip;
    if (!loading) loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "./vendor/jszip.min.js";
      script.async = true;
      const fail = () => {
        script.remove();
        loading = null;
        reject(Error("Libreria ZIP non disponibile. Riapri la PWA con connessione e riprova."));
      };
      script.onload = () => window.JSZip ? resolve(window.JSZip) : fail();
      script.onerror = fail;
      document.head.append(script);
    });
    return loading;
  }

  // js/docx.js
  var WIDTH = 14688;
  var XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  var NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  var esc = (value) => String(value ?? "").normalize("NFC").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
  var filled = (value) => String(value ?? "").trim().length > 0;
  var any = (row, keys) => keys.some((key) => filled(row[key]));
  var actionFilled = (action) => Object.entries(action).some(([key, value]) => key !== "id" && filled(value));
  var riskColor2 = (risk) => ({ ALTO: "FF0000", MEDIO: "AA8000", BASSO: "138138" })[risk] || "1E3232";
  function run(value, { bold = false, size = 19, color = "1E3232", font = "Arial", position } = {}) {
    const text = String(value ?? "").normalize("NFC").replace(/\r\n?/g, "\n").replace(/ {2,}/g, "	").split(/(\n|\t)/).map(
      (part) => part === "\n" ? "<w:br/>" : part === "	" ? "<w:tab/>" : `<w:t xml:space="preserve">${esc(part)}</w:t>`
    ).join("");
    return `<w:r><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:eastAsia="${font}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/><w:color w:val="${color}"/>${bold ? "<w:b/>" : ""}${position === void 0 ? "" : `<w:position w:val="${position}"/>`}</w:rPr>${text}</w:r>`;
  }
  function para(content2 = "", { keep = false, keepLines = false, after = 90, before = 0, align = "left", shade, bullet = -1, style, separator = false, line, exactLine = false, indent = 0, tabs = [] } = {}) {
    const imageHeight = content2.match(/<wp:extent[^>]*cy="(\d+)"/);
    const spacing = imageHeight ? `w:line="${Math.ceil(Number(imageHeight[1]) / 635 + 40)}" w:lineRule="atLeast"` : line ? `w:line="${Math.round(line * 20)}" w:lineRule="${exactLine ? "exact" : "atLeast"}"` : 'w:line="228" w:lineRule="auto"';
    const stops = tabs.length ? `<w:tabs>${tabs.map((tab) => `<w:tab w:val="${tab.align}" w:pos="${tab.position}"/>`).join("")}</w:tabs>` : "";
    return `<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ""}${keep ? "<w:keepNext/>" : ""}${keepLines ? "<w:keepLines/>" : ""}${indent ? `<w:ind w:left="${indent}"/>` : ""}${stops}<w:widowControl/><w:spacing w:before="${before}" w:after="${after}" ${spacing}/><w:jc w:val="${align}"/>${separator ? '<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="0" w:color="FFFFFF"/></w:pBdr>' : ""}${shade ? `<w:shd w:fill="${shade}"/>` : ""}${bullet >= 0 ? `<w:numPr><w:ilvl w:val="${bullet}"/><w:numId w:val="1"/></w:numPr>` : ""}</w:pPr>${content2}</w:p>`;
  }
  var blank = () => para("", { after: 0 });
  var pageBreak = () => '<w:p><w:pPr><w:pageBreakBefore/><w:keepNext/><w:spacing w:before="0" w:after="0" w:line="1" w:lineRule="exact"/></w:pPr></w:p>';
  function label(title, value, { always = false, boldValue = false, valueSize = 19, ...options } = {}) {
    return always || filled(value) ? para(run(title, { bold: true }) + run(" " + (value ?? ""), { bold: boldValue, size: valueSize }), options) : "";
  }
  var band = (title, keep = true) => para(run(title, { bold: true, size: 20, color: "FFFFFF" }), { before: 100, after: 0, shade: "005B60", keep, separator: true, line: 18 }) + `<w:p><w:pPr>${keep ? "<w:keepNext/>" : ""}<w:spacing w:before="0" w:after="0" w:line="120" w:lineRule="exact"/></w:pPr></w:p>`;
  var choices = (options, selected) => options.map((option) => run((Array.isArray(selected) ? selected.includes(option) : selected === option) ? "\u2611 " : "\u2610 ", { font: "DejaVu Sans" }) + run(option)).join(run("	"));
  function scaled(weights, total = WIDTH) {
    const sum = weights.reduce((a, b) => a + b, 0);
    const widths = weights.map((weight) => Math.round(weight / sum * total));
    widths[widths.length - 1] += total - widths.reduce((a, b) => a + b, 0);
    return widths;
  }
  function table(rows, widths, { border = true, headers = false, stripe = headers, keepRows = true, padding = 70, shade, borderColor = "D9DDDD", minHeight = 0, bottom = false } = {}) {
    const borders = ["top", "left", "bottom", "right", "insideH", "insideV"].map(
      (side) => `<w:${side} w:val="${border ? "single" : "nil"}" w:sz="4" w:color="${borderColor}"/>`
    ).join("");
    const position = bottom ? '<w:tblpPr w:horzAnchor="margin" w:vertAnchor="margin" w:tblpX="0" w:tblpYSpec="bottom" w:topFromText="120" w:bottomFromText="0" w:leftFromText="0" w:rightFromText="0"/><w:tblOverlap w:val="never"/>' : "";
    const body = rows.map((row, index) => {
      let column = 0;
      const cells = row.map((value) => {
        var _a;
        const cell = typeof value === "string" ? { content: value } : value;
        const span = cell.span || 1, width = widths.slice(column, column + span).reduce((a, b) => a + b, 0);
        column += span;
        const fill = cell.shade || shade || (headers && index === 0 ? "B9B9B9" : stripe ? index % 2 === 0 ? "F4F7F6" : "FFFFFF" : "");
        const bottomMargin = cell.paddingBottom === void 0 ? "" : `<w:tcMar><w:bottom w:w="${cell.paddingBottom}" w:type="dxa"/></w:tcMar>`;
        return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${span > 1 ? `<w:gridSpan w:val="${span}"/>` : ""}${bottomMargin}<w:vAlign w:val="${cell.verticalAlign || (cell.center ? "center" : "top")}"/>${fill ? `<w:shd w:fill="${fill}"/>` : ""}</w:tcPr>${cell.content || blank()}${((_a = cell.content) == null ? void 0 : _a.endsWith("</w:tbl>")) ? '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="2" w:lineRule="exact"/></w:pPr></w:p>' : ""}</w:tc>`;
      }).join("");
      return `<w:tr><w:trPr>${keepRows ? "<w:cantSplit/>" : ""}${headers && index === 0 ? "<w:tblHeader/>" : ""}${minHeight ? `<w:trHeight w:val="${minHeight}" w:hRule="atLeast"/>` : ""}</w:trPr>${cells}</w:tr>`;
    }).join("");
    return `<w:tbl><w:tblPr>${position}<w:tblW w:w="${widths.reduce((a, b) => a + b, 0)}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders>${borders}</w:tblBorders><w:tblCellMar>${["top", "left", "bottom", "right"].map((side) => `<w:${side} w:w="${padding}" w:type="dxa"/>`).join("")}</w:tblCellMar></w:tblPr><w:tblGrid>${widths.map((width) => `<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid>${body}</w:tbl>`;
  }
  function dataTable(headers, rows, weights, { rowFill = "" } = {}) {
    if (!rows.length) return "";
    return table([
      headers.map((text) => para(run(text, { bold: true, color: "FFFFFF" }), { after: 0 })),
      ...rows.map((row) => row.map((text, index) => {
        const resolution = /^risolto in data$/i.test(headers[index]);
        const empty = resolution && !filled(text);
        return { content: para(run(empty ? "-" : text, {
          bold: resolution && !empty,
          color: /livello di rischio/i.test(headers[index]) ? riskColor2(text) : "1E3232"
        }), { after: 0, align: empty ? "center" : "left" }), shade: rowFill, center: empty };
      }))
    ], scaled(weights), { headers: true }) + blank();
  }
  function note(value, height = 1200) {
    return filled(value) ? table([[para(run("Note aggiuntive:", { bold: true }), { keep: true, after: 70, align: "left" }) + para(run(value), { after: 0, align: "left" })]], [WIDTH], { shade: "F2F2F2", borderColor: "005B60", minHeight: height, bottom: true, keepRows: false }) + blank() : "";
  }
  async function bytes(path) {
    const response = await fetch(path);
    if (!response.ok) throw Error("Risorsa Word non disponibile: " + path);
    return new Uint8Array(await response.arrayBuffer());
  }
  async function mapImage(state2, assets2) {
    var _a;
    const blob = new Blob([await bytes("./assets/map.jpg")], { type: "image/jpeg" });
    let image, url;
    try {
      if (typeof createImageBitmap === "function") image = await createImageBitmap(blob);
      else {
        url = URL.createObjectURL(blob);
        image = new Image();
        image.src = url;
        await image.decode();
      }
      const canvas = document.createElement("canvas");
      canvas.width = ROAD_SIZE.width;
      canvas.height = ROAD_SIZE.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw Error("Impossibile preparare la planimetria Word.");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      if (state2.assetId === "strada") {
        ctx.strokeStyle = "#d90d14";
        ctx.lineWidth = 5.4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ROAD_POINTS.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.stroke();
      }
      for (const asset2 of mapAssets(assets2, state2.assetId)) {
        const x = asset2.x / 100 * canvas.width - 8.7, y = asset2.y / 100 * canvas.height - 8.7;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#1e3232";
        ctx.lineWidth = 1.7;
        ctx.fillRect(x, y, 17.4, 17.4);
        ctx.strokeRect(x, y, 17.4, 17.4);
        if (asset2.id === state2.assetId) {
          ctx.strokeStyle = "#005b60";
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(x + 3, y + 8);
          ctx.lineTo(x + 7, y + 15);
          ctx.lineTo(x + 15, y + 3);
          ctx.stroke();
        }
      }
      return canvas.toDataURL("image/png").split(",")[1];
    } finally {
      (_a = image == null ? void 0 : image.close) == null ? void 0 : _a.call(image);
      if (url) URL.revokeObjectURL(url);
    }
  }
  async function makeDocx(state2, assets2) {
    var _a;
    const Zip = await zipLibrary(), zip = new Zip(), rels = [], media = [], imageIds = /* @__PURE__ */ new Map();
    let drawingId = 0;
    function addImage(data, extension, base64 = false) {
      if (imageIds.has(data)) return imageIds.get(data);
      const id = "image" + (media.length + 1), name = id + "." + extension;
      zip.file("word/media/" + name, data, { base64 });
      rels.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`);
      media.push(id);
      imageIds.set(data, id);
      return id;
    }
    function image(id, width, height, description) {
      const cx = Math.round(width * 12700), cy = Math.round(height * 12700);
      return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${++drawingId}" name="${id}" descr="${esc(description)}"/><wp:cNvGraphicFramePr/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${media.indexOf(id) + 1}" name="${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    }
    const anniversary = addImage(await bytes("./assets/branding/anniversary.png"), "png");
    const logo = addImage(await bytes("./assets/branding/logo.jpg"), "jpg");
    const footerLogo = addImage(await bytes("./assets/branding/footer.jpg"), "jpg");
    const map = addImage(await mapImage(state2, assets2), "png", true);
    const branding = () => para(image(anniversary, 70.6, 15, "Anniversario"), { after: 140 }) + para(image(logo, 70.6, 108.5, "Logo"), { after: 0 });
    const g = state2.general;
    function heading(title, date, first = false) {
      let metadata = para(run(title, { bold: true, size: 26, color: "005B60" }), { after: 210, style: "Title" });
      metadata += label("ID Scheda:", g.id, { always: true, shade: "D9D9D9", after: 0, boldValue: isGeneralBold(state2, "id"), valueSize: 24 });
      metadata += label("Data:", filled(g.date) ? displayDate(date) : "", { always: true, shade: "D9D9D9", after: first ? 0 : 180 });
      if (first) {
        metadata += label("Ora:", g.time, { always: true, shade: "D9D9D9", after: 160 });
        metadata += para(run("Operatore: " + COMMON.operator, { bold: true }), { after: 90 });
        for (const text of [COMMON.company + " \u2013 " + COMMON.address, COMMON.email, "PEC \u2013 " + COMMON.pec]) metadata += para(run(text, { size: 16 }), { after: 20 });
      } else {
        for (const [title2, value, key] of [["Oggetto:", g.object, "object"], ["Operatori:", COMMON.company], ["Restauratore capofila:", COMMON.operator], ["Interventi autorizzati da:", COMMON.authorization]]) metadata += label(title2, value, { always: true, boldValue: isGeneralBold(state2, key) });
      }
      return table([[branding(), metadata]], [1600, first ? 5824 : WIDTH - 1600], { border: false, padding: 0, keepRows: false }) + blank();
    }
    let left = heading("SCHEDA DI ISPEZIONE PERIODICA", g.date, true) + band("1. IDENTIFICAZIONE DEL BENE");
    for (const [title, value, key] of [["Oggetto:", g.object, "object"], ["Cronologia:", g.chronology], ["Autore:", g.author], ["Quota s.l.m.:", measureText(g.altitude)], ["Distanza Santuario:", measureText(g.distance)], ["Complesso:", g.complex], ["Ente Proprietario:", g.owner]]) left += label(title, value, { always: true, boldValue: isGeneralBold(state2, key) });
    left += band("2. SOGGETTO E DATI TECNICO-DIMENSIONALI") + label("Soggetto:", g.subject, { always: true });
    left += label("Dimensioni:", `H: ${measureText(g.height)}		L: ${measureText(g.width)}		P: ${measureText(g.depth)}`, { always: true });
    left += label("Materie e Tecniche:", g.materials, { always: true });
    const right = table([[para(run("LOCALIZZAZIONE BENE", { bold: true, size: 22, color: "005B60" }), { align: "center", after: 120 }) + para(image(map, DOCUMENT_MAP_WIDTH, DOCUMENT_MAP_WIDTH * ROAD_SIZE.height / ROAD_SIZE.width, "Planimetria del bene selezionato"), { align: "center", after: 0 })]], [6688], { borderColor: "005B60", shade: "F8FAF9", padding: 80, minHeight: 1e4 });
    let body = table([[left, "", right]], [7424, 576, 6688], { border: false, padding: 0, keepRows: false });
    body += pageBreak() + band("3. STORICO MANUTENTIVO");
    for (const [key, title] of [["restorations", "Interventi di RESTAURO precedenti"], ["maintenance", "Interventi di MANUTENZIONE precedenti"]]) {
      const rows = state2.history[key].filter((row) => any(row, ["date", "action"]));
      if (rows.length) body += para(run(title, { bold: true }), { keep: true });
      for (const row of rows) {
        const action = filled(row.action) ? para(run("Azione:", { bold: true }), { keep: true }) + para(run(row.action), { align: "left", keepLines: true }) : "";
        body += table([[label("Data:", row.date, { keep: filled(row.action) }) + action]], [WIDTH], { border: false, padding: 0, keepRows: false }) + blank();
      }
    }
    body += band("4. STATO CONSERVATIVO ATTUALE");
    for (const row of state2.conditions.filter((row2) => any(row2, ["exposure", "assessment"]) || row2.methods.length)) {
      body += label("Data del rilievo:", displayDate(row.date), { keep: true });
      body += label("Esposizione:", row.exposure);
      if (row.methods.length) body += para(run("Metodologia Ispezione: ", { bold: true }) + choices(METHODS, row.methods));
      body += label("Valutazione Sintetica:", row.assessment) + blank();
    }
    body += band("5. DIAGNOSTICA DEL DEGRADO E PRIORIT\xC0 DI INTERVENTO");
    body += dataTable(["ID", "Macro-Area", "Elemento", "Patologia Riscontrata", "Cause Principali", "Livello di Rischio", "Data del rilievo", "Risolto in data"], state2.diagnosis.filter(diagnosisHasContent).map((row) => [row.reference, row.area, row.element, row.pathology, row.causes, row.risk, displayDate(row.detectedDate), displayDate(row.resolvedDate)]), [700, 1700, 1700, 3100, 2700, 1500, 1500, 1500]);
    function timing(risk, window2, title) {
      if (!risk && !window2) return "";
      return table([[para(run("Grado d'Urgenza: ", { bold: true }) + run(risk, { color: riskColor2(risk) })), label(title, "", { always: true, after: 50 }) + para(choices(windowsForRisk(risk), window2))]], [3300, WIDTH - 3300], { border: false, padding: 0 });
    }
    for (const row of state2.priorities.filter((row2) => any(row2, ["risk", "window", "anomalies"]))) {
      const reference = (_a = state2.diagnosis.find((source) => source.id === row.diagnosisId)) == null ? void 0 : _a.reference;
      const title = "INDICE DI PRIORIT\xC0 E TEMPISTICHE DI INTERVENTO" + (reference ? " \xB7 PRIORIT\xC0 " + reference : "");
      const content2 = para(run(title, { bold: true }), { keep: true }) + timing(row.risk, row.window, "Finestra d'Intervento Programmata:") + label("Anomalie attese:", row.anomalies);
      body += table([[content2]], [WIDTH], { borderColor: "005B60", shade: "E8F1F2" }) + blank();
    }
    const visits = surveyEntries(state2);
    const photos = allPhotos(state2);
    if (!photos.length) body += band("6. ATLANTE FOTOGRAFICO", false);
    body += note(state2.inspectionNotes);
    for (let offset = 0; offset < photos.length; offset += 4) {
      body += pageBreak();
      const rows = [[{ content: band("6. ATLANTE FOTOGRAFICO"), span: 2, shade: "FFFFFF" }]];
      const cells = [];
      for (const photo of photos.slice(offset, offset + 4)) {
        const extension = photo.data.startsWith("data:image/png") ? "png" : "jpg";
        const id = addImage(photo.data.split(",")[1], extension, true);
        const scale = Math.min(345 / photo.width, 185 / photo.height);
        const dates = run("Inserita il ", { bold: true }) + run(displayDate(photo.insertedDate || photo.surveyDate)) + (visits.length > 1 ? run("	Sopralluogo del ", { bold: true }) + run(displayDate(photo.surveyDate)) : "");
        cells.push(para(image(id, photo.width * scale, photo.height * scale, "Fotografia del bene"), { align: "center", after: 40 }) + para(dates, { after: 40 }) + (filled(photo.caption) ? para(run(photo.caption), { after: 80 }) : ""));
      }
      while (cells.length % 2) cells.push(blank());
      for (let index = 0; index < cells.length; index += 2) rows.push(cells.slice(index, index + 2));
      body += table(rows, [WIDTH / 2, WIDTH / 2], { border: false, headers: true, stripe: false, padding: 90 });
    }
    const sectionProperties = () => `<w:sectPr><w:footerReference w:type="default" r:id="footerDefault"/><w:type w:val="nextPage"/><w:pgSz w:w="15840" w:h="12240" w:orient="landscape"/><w:pgMar w:top="576" w:right="576" w:bottom="1120" w:left="576" w:header="180" w:footer="179"/></w:sectPr>`;
    const sectionBreak = () => `<w:p><w:pPr>${sectionProperties()}</w:pPr></w:p>`;
    body += sectionBreak() + heading("REGISTRO INTERVENTI DI MANUTENZIONE IMMEDIATA", state2.immediate.date) + band("INTERVENTI ESEGUITI");
    for (const row of maintenanceEntries(state2)) {
      let content2 = "";
      if (visits.length > 1) content2 += label("Sopralluogo:", displayDate(row.surveyDate), { keep: true });
      content2 += dataTable(
        ["ID", "Macro-Area", "Elemento", "Patologia", "Cause principali", "Eseguito in data"],
        [[row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row.date || state2.immediate.executedDate)]],
        [700, 2700, 2700, 3860, 3100, 1900]
      );
      content2 += label("Azioni condotte in loco:", row.action);
      body += table([[content2]], [WIDTH], { border: false, padding: 0 }) + blank();
    }
    body += note(state2.immediate.notes, 1600);
    body += sectionBreak() + heading("PROGRAMMAZIONE AZIONI PREVENTIVE", state2.preventive.date) + band("AZIONI PREVENTIVE");
    for (const row of preventiveGroups(state2)) {
      let context = label("Azioni preventive programmate il", displayDate(row.programmedDate), { keep: true });
      const headers = ["ID", "Macro-Area", "Elemento", "Patologia Riscontrata", "Cause Principali", "Data del rilievo", "Risolto in data"];
      const values = [row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row.detectedDate), displayDate(row.resolvedDate)];
      const weights = [650, 2200, 2200, 3300, 2600, 1800, 1800];
      context += dataTable(headers, [values], weights, { rowFill: row.resolvedDate ? "E4F3E6" : "" });
      for (const [index, action] of row.actions.filter(actionFilled).entries()) {
        let content2 = (index === 0 ? context : "") + timing(action.risk, action.window, "Finestra d'Intervento:");
        for (const [title, key, level] of [["Descrizione:", "description", 0], ["Azione:", "action", 1], ["Obiettivo:", "objective", 1], ["Operatore:", "operator", 1]]) if (filled(action[key])) content2 += para(run(title, { bold: true }) + run(" " + action[key]), { bullet: level });
        if (action.role || action.status) {
          const roles = action.role ? ROLES.map((role) => para(choices([role], action.role), { after: 30, indent: 1e3 })).join("") : "";
          const status = action.status ? para(run("Stato: ", { bold: true }) + choices(STATUSES, action.status)) : "";
          content2 += table([[roles, status]], [6200, WIDTH - 6200], { border: false, padding: 0 });
        }
        body += table([[content2]], [WIDTH], { border: false, padding: 0 }) + blank();
      }
    }
    body += note(state2.preventive.notes, 1600) + sectionProperties();
    const number = '<w:fldSimple w:instr="PAGE">' + run("1", { size: 15 }) + "</w:fldSimple>" + run("/", { size: 15 }) + '<w:fldSimple w:instr="NUMPAGES">' + run("1", { size: 15 }) + "</w:fldSimple>";
    const contacts = "Via Matteotti 8, 21030 Castello Cabiaglio (VA) \u2013 C.F./P.IVA 02507710396 \u2013 info@cromorestauri.com \u2013 PEC \u2013 cromorestauri@sicurezzapostale.it";
    const footerLine = para(run("s.c.ar.l.", { size: 22, color: "D8A30A", position: -4 }) + run("	" + contacts + "	", { size: 15, position: -4 }) + number, {
      style: "Footer",
      after: 0,
      line: 13.2,
      exactLine: true,
      tabs: [{ align: "left", position: 920 }, { align: "right", position: WIDTH - 2400 }]
    });
    const footer = table([[
      { content: para(image(footerLogo, 113.5, 34.9, "Cr\xF2mo"), { style: "Footer", after: 0 }), verticalAlign: "bottom" },
      { content: footerLine, verticalAlign: "bottom", paddingBottom: 157 }
    ]], [2400, WIDTH - 2400], { border: false, padding: 0 });
    const relXml = (entries) => XML + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + entries.join("") + "</Relationships>";
    zip.file("word/document.xml", XML + `<w:document ${NS}><w:body>${body}</w:body></w:document>`);
    const footerStyle = '<w:style w:type="paragraph" w:styleId="Footer"><w:name w:val="footer"/><w:basedOn w:val="Normal"/><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="15"/><w:szCs w:val="15"/></w:rPr></w:style>';
    zip.file("word/styles.xml", XML + `<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="19"/><w:color w:val="1E3232"/><w:lang w:val="it-IT"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="90" w:line="228" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="005B60"/></w:rPr></w:style>${footerStyle}</w:styles>`);
    zip.file("word/numbering.xml", XML + `<w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="multilevel"/>${[0, 1].map((level) => `<w:lvl w:ilvl="${level}"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="${level ? "\u25CB" : "\u2022"}"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="${(level + 1) * 500}"/></w:tabs><w:ind w:left="${(level + 1) * 500}" w:hanging="240"/></w:pPr></w:lvl>`).join("")}</w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`);
    zip.file("word/settings.xml", XML + `<w:settings ${NS}><w:updateFields w:val="true"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`);
    zip.file("word/footerDefault.xml", XML + `<w:ftr ${NS}>${footer}</w:ftr>`);
    zip.file("word/_rels/footerDefault.xml.rels", relXml(rels.filter((rel) => rel.includes('Id="' + footerLogo + '"'))));
    const type = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/";
    zip.file("word/_rels/document.xml.rels", relXml([...rels, ...["styles", "numbering", "settings"].map((name) => `<Relationship Id="${name}" Type="${type + name}" Target="${name}.xml"/>`), `<Relationship Id="footerDefault" Type="${type}footer" Target="footerDefault.xml"/>`]));
    zip.file("_rels/.rels", relXml([`<Relationship Id="document" Type="${type}officeDocument" Target="word/document.xml"/>`, '<Relationship Id="core" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>']));
    zip.file("docProps/core.xml", XML + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>' + esc(baseName(state2, assets2)) + "</dc:title><dc:creator>" + esc(COMMON.company) + "</dc:creator><dc:description>Schede Restauro " + VERSION + "</dc:description></cp:coreProperties>");
    const overrides = { "word/document.xml": "document.main", "word/styles.xml": "styles", "word/numbering.xml": "numbering", "word/settings.xml": "settings", "word/footerDefault.xml": "footer" };
    zip.file("[Content_Types].xml", XML + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/>' + Object.entries(overrides).map(([path, value]) => `<Override PartName="/${path}" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${value}+xml"/>`).join("") + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
    return new Blob([await zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } })], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  }

  // js/documents.js
  async function buildExportFiles(state2, assets2, formats) {
    const files2 = /* @__PURE__ */ new Map();
    if (formats.includes("pdf")) {
      files2.set("pdf", await makePdf(state2, assets2));
    }
    if (formats.includes("docx")) {
      files2.set("docx", await makeDocx(state2, assets2));
    }
    if (formats.includes("json"))
      files2.set("json", new Blob([JSON.stringify(state2, null, 2)], { type: "application/json" }));
    return formats.map((extension) => ({ extension, blob: files2.get(extension) }));
  }

  // js/history-view.js
  var escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  var content = (value) => escape(value || "\u2014");
  var labels = {
    date: "Data",
    exposure: "Esposizione",
    assessment: "Valutazione sintetica",
    action: "Azione",
    area: "Macro-Area",
    element: "Elemento",
    pathology: "Patologia",
    causes: "Cause principali",
    risk: "Grado d\u2019urgenza",
    resolvedDate: "Risolto in data",
    resolvedAction: "Azioni condotte in loco",
    reference: "ID",
    detectedDate: "Data del rilievo",
    description: "Descrizione",
    objective: "Obiettivo",
    operator: "Operatore",
    role: "Qualifica",
    status: "Stato",
    window: "Finestra d\u2019intervento",
    anomalies: "Anomalie attese",
    id: "ID scheda",
    time: "Ora",
    object: "Oggetto",
    chronology: "Cronologia",
    author: "Autore",
    altitude: "Quota s.l.m.",
    distance: "Distanza dal Santuario",
    subject: "Soggetto",
    height: "Altezza H",
    width: "Larghezza L",
    depth: "Profondit\xE0 P",
    materials: "Materie e tecniche",
    complex: "Complesso",
    owner: "Ente proprietario"
  };
  var measures = /* @__PURE__ */ new Set(["altitude", "distance", "height", "width", "depth"]);
  function field(key, value) {
    if (key === "date" || key.endsWith("Date")) value = displayDate(value);
    if (measures.has(key) && value) {
      try {
        value = measureText(value);
      } catch {
      }
    }
    return `<p><strong>${labels[key] || key}:</strong> ${content(value)}</p>`;
  }
  function card(row, keys = Object.keys(row).filter((key) => !["id", "diagnosisId"].includes(key) && typeof row[key] === "string" && row[key].trim())) {
    var _a;
    const methods = ((_a = row.methods) == null ? void 0 : _a.length) ? `<p><strong>Metodologia ispezione:</strong> ${content(row.methods.join(", "))}</p>` : "";
    return `<div class="history-record">${keys.map((key) => field(key, row[key])).join("")}${methods}</div>`;
  }
  var note2 = (value) => value ? `<p class="history-note"><strong>Note aggiuntive:</strong> ${escape(value)}</p>` : "";
  var records = (rows) => rows.length ? rows.map((row) => card(row)).join("") : "<p>Nessuna voce compilata.</p>";
  function intervention(row, fallbackDate) {
    const headers = ["ID", "Macro-Area", "Elemento", "Patologia", "Cause principali", "Eseguito in data"];
    const values = [row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row.date || fallbackDate)];
    const columns = [5, 18, 18, 26, 21, 12].map((width) => `<col style="width:${width}%">`).join("");
    return `<div class="history-record"><div class="table-wrap"><table class="context-table"><colgroup>${columns}</colgroup><thead><tr>${headers.map((label2) => `<th scope="col">${label2}</th>`).join("")}</tr></thead><tbody><tr>${values.map((value) => `<td>${content(value)}</td>`).join("")}</tr></tbody></table></div>${field("resolvedAction", row.action)}</div>`;
  }
  function priorities2(data) {
    const sources = new Map(data.diagnosis.map((row) => [row.id, row.reference]));
    return data.priorities.map((row, index) => {
      const reference = sources.get(row.diagnosisId);
      const title = reference ? "Priorit\xE0 " + reference : "Priorit\xE0 preesistente \xB7 " + (index + 1);
      return `<h4>${content(title)}</h4>${card(row)}`;
    }).join("") || "<p>Nessuna voce compilata.</p>";
  }
  function historyPage(data, section, images = /* @__PURE__ */ new Map(), previousVisits = []) {
    switch (section) {
      case "context":
        return Object.entries(data.general).map(([key, value]) => field(key, value)).join("");
      case "history":
        return `<h3>Interventi di restauro precedenti</h3>${records(data.history.restorations)}<h3>Interventi di manutenzione precedenti</h3>${records(data.history.maintenance)}`;
      case "conditions":
        return records(data.conditions);
      case "diagnosis":
        return data.diagnosis.map((row) => card(row, ["reference", "area", "element", "pathology", "causes", "risk", "detectedDate", "resolvedDate"])).join("") + `<h3>Indice di priorit\xE0</h3>${priorities2(data)}${note2(data.inspectionNotes)}`;
      case "photos": {
        const photos = photosForSurvey(data, images);
        return photos.length ? `<div class="photo-grid">${photos.map((photo) => `<article><img loading="lazy" src="${escape(photo.data)}" alt="Fotografia del sopralluogo"><p>Inserita il ${content(displayDate(photo.insertedDate || photo.surveyDate))}</p><p>${content(photo.caption)}</p></article>`).join("")}</div>` : "<p>Nessuna fotografia inserita.</p>";
      }
      case "immediate": {
        const references = new Map(data.diagnosis.map((row) => [row.id, row.reference]));
        const rows = immediateRows(data).map((row) => ({ ...row, reference: references.get(row.id) || "" }));
        return (rows.length ? rows.map((row) => intervention(row, data.immediate.executedDate)).join("") : records([])) + note2(data.immediate.notes);
      }
      case "preventive":
        return preventiveRows(data, previousVisits).filter((row) => row.actions.length).map((row) => `<h3>${content(row.reference)} \xB7 ${content(row.area)} \xB7 ${content(row.pathology)}</h3>${row.element ? field("element", row.element) : ""}${row.causes ? field("causes", row.causes) : ""}${row.detectedDate ? field("detectedDate", row.detectedDate) : ""}${row.resolvedDate ? `<p><strong>RISOLTO IN DATA ${content(displayDate(row.resolvedDate))}</strong></p>` : ""}${records(row.actions)}`).join("") + note2(data.preventive.notes);
      default:
        return "";
    }
  }
  function historyHtml(state2, section) {
    const visits = state2.surveys.filter((visit) => visit.id !== state2.survey.id);
    if (!visits.length) return "<p>Nessun sopralluogo precedente per questa scheda.</p>";
    const images = section === "photos" ? photoIndex(state2) : /* @__PURE__ */ new Map();
    return visits.map((visit, index) => `<details class="visit-history"><summary>Sopralluogo del ${content(displayDate(visit.date))}</summary><div class="historic-page">${historyPage(visit.data, section, images, visits.slice(0, index))}</div></details>`).join("");
  }

  // js/photos.js
  var MAX_PHOTO_BYTES = 2e6;
  var MAX_COMPRESSED_SIDE = 2400;
  var JPEG_QUALITIES = [0.9, 0.8, 0.7, 0.6];
  function dataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || Error("Fotografia non leggibile."));
      reader.readAsDataURL(blob);
    });
  }
  function imageType(bytes2) {
    if (bytes2[0] === 255 && bytes2[1] === 216 && bytes2[2] === 255) return "image/jpeg";
    if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => bytes2[i] === value)) return "image/png";
    return "";
  }
  function jpegOrientation(bytes2) {
    const view = new DataView(bytes2.buffer, bytes2.byteOffset, bytes2.byteLength);
    try {
      for (let at2 = 2; at2 + 4 <= bytes2.length; ) {
        if (bytes2[at2] !== 255 || [218, 217].includes(bytes2[at2 + 1])) break;
        const length = view.getUint16(at2 + 2);
        const end = at2 + 2 + length;
        if (length < 2 || end > bytes2.length) return 0;
        if (bytes2[at2 + 1] === 225 && view.getUint32(at2 + 4) === 1165519206 && view.getUint16(at2 + 8) === 0) {
          const tiff = at2 + 10;
          const little = view.getUint16(tiff) === 18761;
          if (!little && view.getUint16(tiff) !== 19789 || view.getUint16(tiff + 2, little) !== 42) return 0;
          const directory = tiff + view.getUint32(tiff + 4, little);
          if (directory < tiff || directory + 2 > end) return 0;
          const count = view.getUint16(directory, little);
          for (let i = 0; i < count; i++) {
            const entry = directory + 2 + i * 12;
            if (entry + 12 > end) return 0;
            if (view.getUint16(entry, little) === 274)
              return view.getUint16(entry + 2, little) === 3 && view.getUint32(entry + 4, little) === 1 ? view.getUint16(entry + 8, little) : 0;
          }
        }
        at2 = end;
      }
      return 1;
    } catch {
      return 0;
    }
  }
  function encodeJpeg(canvas, quality) {
    return new Promise((resolve, reject) => canvas.toBlob((blob) => {
      if ((blob == null ? void 0 : blob.type) === "image/jpeg") resolve(blob);
      else reject(Error("Impossibile comprimere la fotografia."));
    }, "image/jpeg", quality));
  }
  async function readPhoto(file, surveyDate) {
    const url = URL.createObjectURL(file);
    const image = new Image();
    let canvas;
    try {
      image.src = url;
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight) throw Error("Immagine non leggibile.");
      const photo = { id: uid(), surveyDate, insertedDate: localDate(), caption: "" };
      const small = file.size <= MAX_PHOTO_BYTES;
      const bytes2 = new Uint8Array(await (small ? file : file.slice(0, 12)).arrayBuffer());
      const type = imageType(bytes2);
      if (small && (type === "image/png" || type === "image/jpeg" && jpegOrientation(bytes2) === 1)) {
        return {
          ...photo,
          data: await dataUrl(new Blob([bytes2], { type })),
          width: image.naturalWidth,
          height: image.naturalHeight
        };
      }
      canvas = document.createElement("canvas");
      let scale = small && type ? 1 : Math.min(1, MAX_COMPRESSED_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
      for (; ; ) {
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) throw Error("Immagine non elaborabile.");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        for (const quality of JPEG_QUALITIES) {
          const blob = await encodeJpeg(canvas, quality);
          if (blob.size <= MAX_PHOTO_BYTES)
            return { ...photo, data: await dataUrl(blob), width: canvas.width, height: canvas.height };
        }
        if (canvas.width === 1 && canvas.height === 1) throw Error("Fotografia non comprimibile entro 2 MB.");
        scale *= 0.8;
      }
    } finally {
      URL.revokeObjectURL(url);
      image.src = "";
      if (canvas) canvas.width = canvas.height = 0;
    }
  }

  // js/dialogs.js
  function initDialogs(canClose = () => true) {
    const close = (dialog) => {
      if ((dialog == null ? void 0 : dialog.open) && canClose(dialog)) dialog.close();
    };
    for (const button of document.querySelectorAll("[data-close]"))
      button.onclick = () => close(document.getElementById(button.dataset.close));
    for (const dialog of document.querySelectorAll("dialog")) {
      let startedOutside = false;
      const outside = (event) => {
        const box = dialog.getBoundingClientRect();
        return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
      };
      dialog.addEventListener("pointerdown", (event) => {
        startedOutside = event.target === dialog && outside(event);
      });
      dialog.addEventListener("pointercancel", () => {
        startedOutside = false;
      });
      dialog.addEventListener("click", (event) => {
        if (startedOutside && event.target === dialog && outside(event)) close(dialog);
        startedOutside = false;
      });
      dialog.addEventListener("cancel", (event) => {
        if (!canClose(dialog)) event.preventDefault();
      });
      dialog.addEventListener("close", () => {
        startedOutside = false;
      });
    }
  }

  // js/corrections.js
  var dataVersions = (state2) => [state2, ...state2.surveys.map((visit) => visit.data)];
  var at = (data, keys) => keys.reduce((value, key) => value == null ? void 0 : value[key], data);
  function fieldTargets(state2, keys, correction) {
    var _a;
    const property = keys.at(-1);
    const current = at(state2, keys.slice(0, -1));
    if (!current || !Object.hasOwn(current, property)) throw Error("Campo non valido.");
    const targets = [{ row: current, current: true }];
    if (keys[0] === "diagnosis" && keys[2] === "actions")
      targets[0].parent = state2.diagnosis[Number(keys[1])];
    if (!correction) return targets;
    for (const visit of state2.surveys) {
      const data = visit.data;
      let row, parent;
      if (keys[0] === "general") row = data.general;
      else if (keys[0] === "photos")
        row = data.photoDetails.find((photo) => photo.id === current.id);
      else if (keys[0] === "diagnosis" && keys[2] === "actions") {
        parent = data.diagnosis.find((record) => record.id === targets[0].parent.id);
        row = parent == null ? void 0 : parent.actions.find((action) => action.id === current.id);
      } else {
        const index = keys.findIndex((key) => /^\d+$/.test(key));
        if (index >= 0)
          row = (_a = at(data, keys.slice(0, index))) == null ? void 0 : _a.find((record) => record.id === current.id);
      }
      if (row) targets.push({ row, parent, current: false });
    }
    if (keys[0] === "photos") {
      for (const photo of state2.photoArchive)
        if (photo.id === current.id) targets.push({ row: photo, current: false });
    }
    return targets;
  }
  function editField(state2, path, value, { correction = false } = {}) {
    var _a;
    const keys = path.split(".");
    if (keys.some((key) => ["__proto__", "prototype", "constructor"].includes(key)))
      throw Error("Campo non valido.");
    if (inheritedRiskSource(state2, path)) return;
    const property = keys.at(-1);
    const diagnosis = keys[0] === "diagnosis" && keys.length === 3;
    for (const target of fieldTargets(state2, keys, correction)) {
      const { row, current } = target;
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
      state2.customFilename = false;
      state2.filename = "";
    }
    if (keys[0] === "general" && ["complex", "owner"].includes(property) && state2.fixedCommon)
      state2.fixedCommon[property] = value;
    if (keys[0] === "general" && Object.hasOwn(((_a = state2.assetSnapshot) == null ? void 0 : _a.fixed) || {}, property))
      state2.assetSnapshot.fixed[property] = value;
    if (path === "general.date" && !state2.updateBaseline && !state2.surveys.some((visit) => visit.id !== state2.survey.id)) state2.survey.date = value;
    if (correction && diagnosis && property === "resolvedDate" && !value) pruneBaseline(state2);
    let linksChanged = false;
    if (keys[0] === "diagnosis") {
      linksChanged = syncDiagnosticLinks(state2);
      if (correction && diagnosis && property === "risk") {
        const id = state2.diagnosis[Number(keys[1])].id;
        for (const visit of state2.surveys)
          syncDiagnosticLinks(visit.data, { createPriorities: false, diagnosisId: id });
      }
    }
    return linksChanged;
  }
  function pruneBaseline(state2) {
    if (!state2.updateBaseline) return;
    const present = {
      conditions: state2.conditions,
      diagnosis: state2.diagnosis,
      restorations: state2.history.restorations,
      maintenance: state2.history.maintenance,
      priorities: state2.priorities,
      immediate: state2.immediate.records,
      resolved: state2.diagnosis.filter((row) => row.resolvedDate),
      actions: state2.diagnosis.flatMap((row) => row.actions)
    };
    state2.updateBaseline = Object.fromEntries(Object.entries(present).map(([key, rows]) => {
      const ids = new Set(rows.map((row) => row.id));
      return [key, (state2.updateBaseline[key] || []).filter((id) => ids.has(id))];
    }));
  }
  function removeId(rows, id) {
    for (let index = rows.length - 1; index >= 0; index--)
      if (rows[index].id === id) rows.splice(index, 1);
  }
  function purgeRecord(state2, { action, key, index, row }) {
    var _a, _b;
    let i = Number(index);
    if (action === "remove-photo") {
      const photo = state2.photos[i];
      if (!photo) return false;
      removeId(state2.photos, photo.id);
      removeId(state2.photoArchive, photo.id);
      for (const visit of state2.surveys) {
        visit.data.photoIds = visit.data.photoIds.filter((id) => id !== photo.id);
        removeId(visit.data.photoDetails, photo.id);
      }
      return true;
    }
    if (action === "remove-preventive") {
      const diagnosis = state2.diagnosis[Number(row)];
      const id = (_a = diagnosis == null ? void 0 : diagnosis.actions[i]) == null ? void 0 : _a.id;
      if (!id) return false;
      for (const data of dataVersions(state2)) {
        const parent = data.diagnosis.find((record) => record.id === diagnosis.id);
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
        "remove-immediate": ["immediate", "records"]
      };
      const path = paths[action];
      const current = path && ((_b = at(state2, path)) == null ? void 0 : _b[i]);
      const id = current == null ? void 0 : current.id;
      if (!id) return false;
      for (const data of dataVersions(state2)) {
        if (action === "remove-priority" && current.diagnosisId) {
          const source = data.diagnosis.find((record) => record.id === current.diagnosisId);
          if (source) source.priorityExcluded = true;
          data.priorities = data.priorities.filter((priority) => priority.diagnosisId !== current.diagnosisId);
        }
        if (action === "remove-diagnosis")
          data.priorities = data.priorities.filter((priority) => priority.diagnosisId !== id);
        removeId(at(data, path), id);
      }
    }
    pruneBaseline(state2);
    return true;
  }

  // js/export.js
  function isAppleMobile(nav = navigator) {
    return /iPhone|iPad|iPod/.test(nav.userAgent) || nav.platform === "MacIntel" && nav.maxTouchPoints > 1;
  }
  async function makeArchive(files2, name) {
    const Zip = await zipLibrary();
    const zip = new Zip();
    for (const file of files2) {
      zip.file(`${name}.${file.extension}`, new Uint8Array(await file.blob.arrayBuffer()));
    }
    return new Blob(
      [await zip.generateAsync({ type: "uint8array", compression: "STORE" })],
      { type: "application/zip" }
    );
  }
  var ExportFiles = class {
    constructor(root, notify2) {
      this.root = root;
      this.notify = notify2;
      this.generation = 0;
      this.urls = [];
      this.links = Object.fromEntries(["docx", "pdf", "json"].map((extension) => [extension, root.querySelector(`[data-format="${extension}"]`)]));
      this.zipLink = root.querySelector("#savePackage");
      this.shareButton = root.querySelector("#sharePdf");
      this.shareButton.onclick = () => this.sharePdf();
    }
    clear() {
      this.generation++;
      this.root.hidden = true;
      this.pdfFile = null;
      this.downloadLinks = [];
      for (const link of [...Object.values(this.links), this.zipLink]) {
        link.hidden = true;
        link.removeAttribute("href");
        link.removeAttribute("download");
      }
      this.shareButton.hidden = true;
      for (const url of this.urls) setTimeout(() => URL.revokeObjectURL(url), 6e4);
      this.urls = [];
    }
    link(element, blob, name) {
      const url = URL.createObjectURL(blob);
      this.urls.push(url);
      element.href = url;
      element.download = name;
      element.hidden = false;
    }
    async prepare(files2, name) {
      this.clear();
      if (!files2.length) return false;
      const generation = this.generation;
      const apple = isAppleMobile();
      const archive = files2.length > 1 ? await makeArchive(files2, name) : null;
      if (generation !== this.generation) return false;
      if (archive) {
        this.link(this.zipLink, archive, `${name}.zip`);
        this.downloadLinks = [this.zipLink];
      } else {
        for (const file of files2) this.link(this.links[file.extension], file.blob, `${name}.${file.extension}`);
        this.downloadLinks = files2.map((file) => this.links[file.extension]);
      }
      const pdf = files2.find((file) => file.extension === "pdf");
      if (apple && files2.length === 1 && pdf) {
        this.pdfFile = new File([pdf.blob], `${name}.pdf`, { type: "application/pdf" });
        try {
          this.shareButton.hidden = !(typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [this.pdfFile] }));
        } catch {
          this.shareButton.hidden = true;
        }
      }
      this.root.hidden = false;
      return true;
    }
    download() {
      if (!this.root.hidden) for (const link of this.downloadLinks) link.click();
    }
    async sharePdf() {
      if (!this.pdfFile || this.shareButton.disabled) return;
      this.shareButton.disabled = true;
      try {
        await navigator.share({ files: [this.pdfFile] });
      } catch (error) {
        if (error.name !== "AbortError") this.notify("Condivisione non disponibile. Usa Salva PDF.");
      } finally {
        this.shareButton.disabled = false;
      }
    }
  };

  // js/home-title.js
  function initHomeTitle() {
    const branding = document.querySelector(".home-branding");
    const title = document.getElementById("homeTitle");
    const subtitle = document.getElementById("homeSubtitle");
    if (!branding || !title || !subtitle) return;
    function fit() {
      const targetWidth = subtitle.getBoundingClientRect().width;
      const titleWidth = title.getBoundingClientRect().width;
      if (!targetWidth || !titleWidth || Math.abs(targetWidth - titleWidth) < 0.05)
        return;
      const size = parseFloat(getComputedStyle(title).fontSize);
      if (Number.isFinite(size))
        title.style.fontSize = `${size * targetWidth / titleWidth}px`;
    }
    fit();
    window.addEventListener("resize", fit, { passive: true });
    if (typeof ResizeObserver !== "undefined")
      new ResizeObserver(fit).observe(branding);
    if (document.fonts) {
      document.fonts.ready.then(fit).catch(() => {
      });
      document.fonts.addEventListener("loadingdone", fit);
    }
  }

  // js/updates.js
  var TIMEOUT = 45e3;
  var TIMEOUT_MESSAGE = "Il controllo sta impiegando troppo tempo. Riprova tra poco.";
  var returnKey = () => "schede-restauro:ritorno-aggiornamento:" + new URL("./", location.href).href;
  function within(promise, milliseconds) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error(TIMEOUT_MESSAGE)), milliseconds);
      Promise.resolve(promise).then(resolve, reject).finally(() => clearTimeout(timer));
    });
  }
  function activated(worker, milliseconds) {
    return new Promise((resolve, reject) => {
      const finish = (error) => {
        clearTimeout(timer);
        worker.removeEventListener("statechange", check);
        if (error) reject(error);
        else resolve();
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
      const finish = (error) => {
        clearTimeout(timer);
        service.removeEventListener("controllerchange", check);
        if (error) reject(error);
        else resolve();
      };
      const check = () => {
        if (service.controller === worker) finish();
      };
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
        if (error) reject(error);
        else resolve(version);
      };
      const timer = setTimeout(() => finish(Error("Non \xE8 stato possibile verificare la versione. Riprova tra poco.")), milliseconds);
      channel.port1.onmessage = (event) => {
        var _a, _b;
        const version = (_a = event.data) == null ? void 0 : _a.version;
        if (((_b = event.data) == null ? void 0 : _b.type) !== "APP_VERSION" || typeof version !== "string" || !/^\d+\.\d+(?:\.\d+)?$/.test(version))
          finish(Error("Risposta di aggiornamento non valida. Riprova tra poco."));
        else finish(null, version.replace(/\.0$/, ""));
      };
      try {
        worker.postMessage({ type: "GET_APP_VERSION" }, [channel.port2]);
      } catch (error) {
        finish(error);
      }
    });
  }
  async function checkForUpdates(onProgress = () => {
  }, timeout = TIMEOUT) {
    if (!/^https?:$/.test(location.protocol))
      throw Error("Per cercare gli aggiornamenti apri l\u2019app dal suo indirizzo online.");
    if (navigator.onLine === false)
      throw Error("Connessione assente. Riprova quando sei online.");
    if (!("serviceWorker" in navigator) || !isSecureContext)
      throw Error("La ricerca degli aggiornamenti non \xE8 disponibile in questo browser.");
    const deadline = Date.now() + timeout;
    const remaining = () => Math.max(0, deadline - Date.now());
    const registration = await within(navigator.serviceWorker.register("./sw.js", {
      scope: "./",
      updateViaCache: "none"
    }), remaining());
    let candidate = registration.installing || registration.waiting;
    const found = () => {
      candidate = registration.installing || registration.waiting || candidate;
      if (candidate) onProgress("Aggiornamento in corso\u2026");
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
      const version = await workerVersion(worker, Math.min(4e3, remaining()));
      return { version, available: version !== VERSION };
    } finally {
      registration.removeEventListener("updatefound", found);
    }
  }
  function rememberUpdateView(view, version) {
    sessionStorage.setItem(returnKey(), JSON.stringify({ view, version, time: Date.now() }));
  }
  function takeUpdateView() {
    try {
      const key = returnKey(), raw = sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (saved.version !== VERSION || !["home", "editor"].includes(saved.view) || !Number.isFinite(saved.time) || Math.abs(Date.now() - saved.time) > 6e5) return null;
      return saved.view;
    } catch {
      return null;
    }
  }

  // js/app.js
  var $ = (id) => document.getElementById(id);
  var exportFiles = new ExportFiles($("exportReady"), notify);
  var updateView = takeUpdateView();
  var unlockedPages = /* @__PURE__ */ new Set();
  var escape2 = (value) => String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
  var assets = [];
  var state = null;
  var draftAvailable = false;
  var storageReady = false;
  var saveTimer;
  var saveChain = Promise.resolve();
  var revision = 0;
  var savedRevision = 0;
  var toastTimer;
  var busy = false;
  var pendingImport = null;
  function notify(message) {
    $("toast").textContent = message;
    $("toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").hidden = true, 6500);
  }
  function showMessage(title, message) {
    $("dialogTitle").textContent = title;
    $("dialogMessage").textContent = message;
    $("messageDialog").showModal();
  }
  function get(path) {
    return path.split(".").reduce((o, k) => o == null ? void 0 : o[k], state) ?? "";
  }
  function pageUnlocked() {
    return !!state && unlockedPages.has(SECTION_DEFINITIONS[state.section].key);
  }
  function fieldIsLocked(path) {
    return !!inheritedRiskSource(state, path) || !pageUnlocked() && lockedPath(state, path);
  }
  function removalIsLocked(data) {
    return !pageUnlocked() && lockedRemoval(state, data);
  }
  function syncPageLock() {
    const unlocked = pageUnlocked();
    const label2 = (unlocked ? "Blocca la pagina" : "Sblocca la pagina") + (state ? ": " + SECTION_DEFINITIONS[state.section].label : "");
    $("pageLockButton").setAttribute("aria-pressed", String(unlocked));
    $("pageLockButton").setAttribute("aria-label", label2);
    $("pageLockButton").title = label2;
    $("pageLockShackle").setAttribute("d", unlocked ? "M8 11V7a4 4 0 0 1 7.5-2" : "M8 11V7a4 4 0 0 1 8 0v4");
  }
  function set(path, value) {
    if (fieldIsLocked(path)) return;
    return editField(state, path, value, { correction: pageUnlocked() });
  }
  function asset() {
    return assets.find((a) => a.id === (state == null ? void 0 : state.assetId));
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
    state.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    revision++;
    draftAvailable = true;
    $("resumeButton").disabled = false;
    $("saveStatus").textContent = "Salvataggio\u2026";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 250);
    syncFilename();
  }
  function persist() {
    clearTimeout(saveTimer);
    if (!state) return saveChain;
    const copy = structuredClone(state), version = revision;
    saveChain = saveChain.catch(() => {
    }).then(async () => {
      try {
        if (!storageReady) throw Error("Archivio non disponibile");
        await saveDraft(copy);
        savedRevision = version;
        if (version === revision) $("saveStatus").textContent = "Bozza salvata";
        return true;
      } catch {
        $("saveStatus").textContent = "Bozza non salvata";
        notify(
          "Salvataggio locale non riuscito. Mantieni aperta la scheda e salvala prima di uscire."
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
  function field2(label2, path, {
    type = "text",
    wide = false,
    multiline = false,
    fixed = false,
    value,
    unit = false
  } = {}) {
    const val = value ?? get(path);
    const bold = path.startsWith("general.") && isGeneralBold(state, path.split(".")[1]);
    fixed = fixed || fieldIsLocked(path);
    const read = fixed ? ' readonly aria-readonly="true"' : "";
    const common = `data-path="${escape2(path)}"${bold ? ' class="field-value-bold"' : ""}${read}${unit ? ' data-measure="true" inputmode="decimal"' : ""}`;
    const control = multiline ? `<textarea ${common} rows="3">${escape2(val)}</textarea>` : `<input type="${type}" ${common} value="${escape2(val)}"${unit ? ' placeholder="m"' : ""}>`;
    return `<label class="field${wide ? " wide" : ""}"><span>${escape2(label2)}${fixed ? ' <span aria-label="non modificabile">\u{1F512}</span>' : ""}${unit ? " <small>(m)</small>" : ""}</span>${control}</label>`;
  }
  function band2(title) {
    return `<h2 class="section-heading">${escape2(title)}</h2>`;
  }
  function removeButton(action, index, extra = "") {
    return `<button type="button" class="remove" data-action="${action}" data-index="${index}" ${extra}>Rimuovi</button>`;
  }
  function addButton(label2, action, extra = "") {
    return `<button class="add-button" type="button" data-action="${action}" ${extra}>\uFF0B ${escape2(label2)}</button>`;
  }
  function riskField(label2, path) {
    const value = get(path);
    const source = inheritedRiskSource(state, path);
    const title = source ? ` title="Ereditato dal livello di rischio di ${escape2(source.reference)}"` : "";
    return `<label class="field"><span>${escape2(label2)}</span><select ${fieldIsLocked(path) ? 'disabled aria-readonly="true"' : ""}${title} data-path="${path}" class="risk-${String(value).toLowerCase().replace("basso", "low").replace("medio", "medium").replace("alto", "high")}"><option value="">\u2014</option>${RISKS.map((r) => `<option${r === value ? " selected" : ""}>${r}</option>`).join("")}</select></label>`;
  }
  function choices2(label2, path, values, multiple = false) {
    const value = get(path);
    const disabled = fieldIsLocked(path) ? " disabled" : "";
    return `<fieldset class="choice-group"><legend>${escape2(label2)}</legend><div class="choices">${values.map((v, i) => `<label><input${disabled} type="${multiple ? "checkbox" : "radio"}" name="${path}" value="${escape2(v)}" data-path="${path}"${multiple ? ' data-multiple="true"' : ""}${multiple ? Array.isArray(value) && value.includes(v) ? " checked" : "" : value === v ? " checked" : ""}>${escape2(v)}</label>`).join("")}</div></fieldset>`;
  }
  function mapHtml() {
    const locked = !pageUnlocked();
    const checks = mapAssets(assets, state.assetId).map((item) => `<button type="button" class="map-check${item.id === state.assetId ? " selected" : ""}" role="checkbox" aria-checked="${item.id === state.assetId}" aria-disabled="${locked}" ${locked ? "disabled" : ""} data-map-asset="${item.id}" aria-label="${escape2(item.label)}" title="${escape2(item.label)}" style="left:${item.x}%;top:${item.y}%">${item.id === state.assetId ? "\u2713" : ""}</button>`).join("");
    const road = state.assetId === "strada" ? `<svg class="map-road" viewBox="0 0 ${ROAD_SIZE.width} ${ROAD_SIZE.height}" aria-label="Viale del Santuario e delle Cappelle selezionato"><polyline points="${ROAD_SVG_POINTS}" /></svg>` : "";
    return `<aside class="map-panel"><h2>LOCALIZZAZIONE BENE</h2><div class="map-frame"><img src="./assets/map.jpg" alt="Planimetria del percorso del Sacro Monte di Varese">${road}${checks}</div></aside>`;
  }
  function firstSection() {
    const general = (label2, key, options = {}) => field2(label2, "general." + key, options);
    return `<div class="first-layout"><div><div class="fields">${field2("ID scheda", "general.id", { wide: true })}${field2("Data", "general.date", { type: "date" })}${field2("Ora", "general.time", { type: "time" })}</div>
  ${band2("1. IDENTIFICAZIONE DEL BENE")}<div class="fields">${general("Oggetto", "object", { wide: true })}${general("Cronologia", "chronology")}${general("Autore", "author")}${general("Quota s.l.m.", "altitude", { unit: true })}${general("Distanza dal Santuario", "distance", { unit: true })}${general("Complesso", "complex", { wide: true })}${general("Ente proprietario", "owner", { wide: true })}</div>
  ${band2("2. SOGGETTO E DATI TECNICO-DIMENSIONALI")}<div class="fields">${general("Soggetto", "subject", { wide: true, multiline: true })}</div><div class="fields three wide-note">${general("Altezza H", "height", { unit: true })}${general("Larghezza L", "width", { unit: true })}${general("Profondit\xE0 P", "depth", { unit: true })}</div><div class="wide-note">${general("Materie e Tecniche", "materials", { multiline: true })}</div></div>${mapHtml()}</div>`;
  }
  function historyCards(key, title) {
    return `${band2(title)}${state.history[key].map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>${escape2(title)} \xB7 ${i + 1}</h3>${removeButton("remove-history", i, `data-key="${key}"`)}</div><div class="fields">${field2("Data", `history.${key}.${i}.date`)}${field2("Azione", `history.${key}.${i}.action`, { multiline: true, wide: true })}</div></article>`).join("")}<div class="repeat-actions">${addButton("Aggiungi intervento", "add-history", `data-key="${key}"`)}</div>`;
  }
  function historySection() {
    return `${band2("3. STORICO MANUTENTIVO")}${historyCards("restorations", "Interventi di RESTAURO precedenti")}${historyCards("maintenance", "Interventi di MANUTENZIONE precedenti")}`;
  }
  function conditionsSection() {
    return `${band2("4. STATO CONSERVATIVO ATTUALE")}${state.conditions.map((r, i) => `<article class="repeat-card condition-card"><div class="card-top"><h3>Stato conservativo \xB7 ${i + 1}</h3>${removeButton("remove-condition", i)}</div>${field2("Data del rilievo", `conditions.${i}.date`, { type: "date" })}${field2("Esposizione", `conditions.${i}.exposure`)}${choices2("Metodologia Ispezione", `conditions.${i}.methods`, METHODS, true)}${field2("Valutazione sintetica", `conditions.${i}.assessment`, { multiline: true })}</article>`).join("")}<div class="repeat-actions">${addButton("Aggiungi stato conservativo", "add-condition")}</div>`;
  }
  var diagnosisHeaders = [
    "ID",
    "Macro-Area",
    "Elemento",
    "Patologia riscontrata",
    "Cause principali",
    "Livello di rischio",
    "Data del rilievo",
    "Risolto in data"
  ];
  function diagnosisRow(row, index) {
    const path = `diagnosis.${index}`;
    return `<tr role="row">
    <td role="cell" class="diagnosis-id"><span class="diagnosis-id-label">ID</span><div class="diagnosis-id-controls"><strong class="degradation-reference">${escape2(row.reference)}</strong><button type="button" class="remove diagnosis-remove" data-action="remove-diagnosis" data-index="${index}" aria-label="Rimuovi riga ${escape2(row.reference)}" title="Rimuovi riga ${escape2(row.reference)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button></div></td>
    ${["area", "element", "pathology", "causes"].map(
      (key, column) => `<td role="cell">${field2(diagnosisHeaders[column + 1], path + "." + key, { multiline: true })}</td>`
    ).join("")}
    <td role="cell">${riskField("Livello di rischio", path + ".risk")}</td>
    <td role="cell">${field2("Data del rilievo", path + ".detectedDate", { type: "date" })}</td>
    <td role="cell">${field2("Risolto in data", path + ".resolvedDate", { type: "date" })}</td>
  </tr>`;
  }
  function diagnosisSection() {
    const table2 = `<div class="table-wrap"><table class="diagnosis-table" role="table"><thead role="rowgroup"><tr role="row">${diagnosisHeaders.map((header) => `<th role="columnheader" scope="col">${header}</th>`).join("")}</tr></thead><tbody role="rowgroup">${state.diagnosis.map(diagnosisRow).join("")}</tbody></table></div>`;
    return band2("5. DIAGNOSTICA DEL DEGRADO E PRIORIT\xC0 DI INTERVENTO") + table2 + `<div class="repeat-actions">${addButton("Aggiungi riga", "add-diagnosis")}</div>` + band2("INDICE DI PRIORIT\xC0 E TEMPISTICHE DI INTERVENTO") + `<div id="priorityCards">${priorityCards()}</div><div class="wide-note">${field2("Note aggiuntive", "inspectionNotes", { multiline: true })}</div>`;
  }
  function priorityCards() {
    const sources = new Map(state.diagnosis.map((row) => [row.id, row]));
    return state.priorities.map((priority, index) => {
      const source = sources.get(priority.diagnosisId);
      const title = source ? "Priorit\xE0 " + source.reference : "Priorit\xE0 preesistente \xB7 " + (index + 1);
      const disabled = removalIsLocked({ action: "remove-priority", index: String(index) }) ? "disabled" : "";
      return `<article class="repeat-card priority-card"><div class="card-top"><h3>${escape2(title)}</h3>${removeButton("remove-priority", index, disabled)}</div>${riskField("Grado d\u2019urgenza", `priorities.${index}.risk`)}${choices2("Finestra d\u2019intervento programmata", `priorities.${index}.window`, windowsForRisk(priority.risk))}${field2("Anomalie attese", `priorities.${index}.anomalies`, { multiline: true })}</article>`;
    }).join("");
  }
  function refreshPriorities() {
    const container = $("priorityCards");
    if (container) container.innerHTML = priorityCards();
  }
  function photosSection() {
    return `${band2("6. ATLANTE FOTOGRAFICO")}<div class="photo-actions"><button type="button" data-action="camera" class="primary">Scatta foto</button><button type="button" data-action="photos">Carica foto</button></div><div class="photo-grid">${state.photos.map((p, i) => `<article class="photo-card"><img src="${escape2(p.data)}" alt="Fotografia ${i + 1}"><div><span>Foto ${i + 1} \xB7 Inserita il ${escape2(displayDate(p.insertedDate || p.surveyDate))}</span>${removeButton("remove-photo", i)}</div>${field2("Didascalia", `photos.${i}.caption`, { multiline: true })}</article>`).join("")}</div>${!state.photos.length ? '<p class="empty">Aggiungi le fotografie del sopralluogo.</p>' : ""}`;
  }
  function immediateSection() {
    const derived = state.diagnosis.map((row, index) => row.resolvedDate ? `<article class="repeat-card immediate-card">${diagnosticContextTable([row], "Eseguito in data", "resolvedDate")}${field2("Azioni condotte in loco", `diagnosis.${index}.resolvedAction`, { wide: true, multiline: true, value: row.resolvedAction })}</article>` : "").join("");
    const previous = state.immediate.records.map(
      (row, index) => `<article class="repeat-card immediate-card"><div class="card-top"><h3>Intervento preesistente \xB7 ${index + 1}</h3>${removeButton("remove-immediate", index)}</div>${diagnosticContextTable([{ ...row, date: state.immediate.executedDate }], "Eseguito in data", "date", () => field2("Macro-Area", `immediate.records.${index}.area`))}${field2("Azioni condotte in loco", `immediate.records.${index}.action`, { wide: true, multiline: true })}</article>`
    ).join("");
    return band2("INTERVENTI ESEGUITI") + derived + previous + (!derived && !previous ? '<p class="empty">Compila Risolto in data nella diagnostica per generare un intervento eseguito.</p>' : "") + `<div class="wide-note">${field2("Note aggiuntive", "immediate.notes", { multiline: true })}</div>`;
  }
  function diagnosticContextTable(rows, dateLabel, dateKey, areaControl = null) {
    if (!rows.length) return "";
    const headers = ["ID", "Macro-Area", "Elemento", dateKey === "detectedDate" ? "Patologia riscontrata" : "Patologia", "Cause principali", dateLabel];
    const preventive2 = dateKey === "detectedDate";
    if (preventive2) headers.push("Risolto in data");
    const columns = (preventive2 ? [5, 15, 16, 23, 19, 11, 11] : [5, 18, 18, 26, 21, 12]).map((width) => `<col style="width:${width}%">`).join("");
    const body = rows.map((row) => {
      const values = [row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row[dateKey])];
      if (preventive2) values.push(displayDate(row.resolvedDate));
      return `<tr${preventive2 && row.resolvedDate ? ' class="resolved-row"' : ""}>${values.map((value, index) => `<td>${index === 1 && areaControl ? areaControl(row) : escape2(value)}</td>`).join("")}</tr>`;
    }).join("");
    return `<div class="table-wrap"><table class="context-table${preventive2 ? " preventive-table" : ""}"><colgroup>${columns}</colgroup><thead><tr>${headers.map((header) => `<th scope="col">${escape2(header)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
  }
  function preventiveContext(row) {
    const context = [
      `<strong>${escape2(row.reference)}</strong>`,
      escape2(row.area || "Macro-Area non compilata"),
      escape2(row.element),
      escape2(row.pathology)
    ].filter(Boolean).join(" \xB7 ");
    const status = row.resolvedDate ? ` \xB7 <strong class="resolved-status">RISOLTO IN DATA ${escape2(displayDate(row.resolvedDate))}</strong>` : "";
    return `<div class="record-context${row.resolvedDate ? " resolved" : ""}">${context}${status}</div>`;
  }
  function preventiveAction(row, action, index) {
    const path = `diagnosis.${row.index}.actions.${index}`;
    return `<article class="repeat-card">
    <div class="card-top"><h3>Azione preventiva ${escape2(row.reference)} \xB7 ${index + 1}</h3>${removeButton("remove-preventive", index, `data-row="${row.index}"`)}</div>
    ${riskField("Grado d\u2019urgenza", path + ".risk")}
    ${choices2("Finestra d\u2019intervento", path + ".window", windowsForRisk(action.risk))}
    <div class="fields">
      ${field2("Descrizione", path + ".description", { wide: true, multiline: true })}
      ${field2("Azione", path + ".action", { wide: true, multiline: true })}
      ${field2("Obiettivo", path + ".objective", { wide: true, multiline: true })}
      ${field2("Operatore", path + ".operator", { wide: true })}
    </div>
    ${choices2("Qualifica operatore", path + ".role", ROLES)}
    ${choices2("Stato", path + ".status", STATUSES)}
  </article>`;
  }
  function preventiveRow(row) {
    const actions = row.actions.map((action, index) => preventiveAction(row, action, index)).join("");
    if (row.resolvedDate) return "";
    return preventiveContext(row) + actions + addButton("Aggiungi azione per " + row.reference, "add-preventive", `data-row="${row.index}"`);
  }
  function preventiveSection() {
    const rows = preventiveRows(state);
    const table2 = diagnosticContextTable(rows, "Data del rilievo", "detectedDate");
    return band2("AZIONI PREVENTIVE") + table2 + rows.map(preventiveRow).join("") + (!rows.length ? '<p class="empty">Nessuna azione preventiva da programmare.</p>' : "") + `<div class="wide-note">${field2("Note aggiuntive", "preventive.notes", { multiline: true })}</div>`;
  }
  var sectionRenderers = {
    context: firstSection,
    history: historySection,
    conditions: conditionsSection,
    diagnosis: diagnosisSection,
    photos: photosSection,
    immediate: immediateSection,
    preventive: preventiveSection
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
    for (const button of $("sectionContent").querySelectorAll('[data-action^="remove-"]')) {
      if (removalIsLocked(button.dataset)) {
        button.disabled = true;
        if (button.dataset.action === "remove-photo")
          button.title = "Fotografia di un sopralluogo precedente: sblocca la pagina per rimuoverla";
      }
    }
    syncFilename();
    $("sectionCounter").textContent = `Sezione ${state.section + 1} di ${SECTIONS.length}`;
    $("previous").textContent = state.section ? "\u2190 " + SECTIONS[state.section - 1] : "Home";
    $("next").textContent = state.section === SECTIONS.length - 1 ? "Salva scheda" : SECTIONS[state.section + 1] + " \u2192";
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
    if (!el.matches("[data-path]") || el.readOnly || ["radio", "checkbox"].includes(el.type))
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
        el.checked ? [.../* @__PURE__ */ new Set([...list, el.value])] : list.filter((v) => v !== el.value)
      );
    } else if (el.type === "radio") {
      if (el.checked) linksChanged = set(el.dataset.path, el.value);
    } else linksChanged = set(el.dataset.path, el.value);
    if (el.tagName === "SELECT") {
      el.className = "risk-" + ({ BASSO: "low", MEDIO: "medium", ALTO: "high" }[el.value] || "");
    }
    changed();
    if (el.dataset.path.endsWith(".risk")) {
      render();
    } else if (linksChanged) refreshPriorities();
  });
  $("sectionContent").addEventListener("click", (event) => {
    var _a, _b;
    const marker = event.target.closest("[data-map-asset]");
    if (marker) {
      if (busy || !pageUnlocked()) return;
      const selected = assets.find((item) => item.id === marker.dataset.mapAsset);
      if (!selected || selected.kind !== ((_a = asset()) == null ? void 0 : _a.kind) || selected.id === state.assetId) return;
      state.assetId = selected.id;
      state.customFilename = false;
      state.filename = "";
      state.assetSnapshot = structuredClone(selected);
      for (const [key2, value] of Object.entries(selected.fixed))
        editField(state, "general." + key2, String(value), { correction: true });
      for (const visit of state.surveys) visit.data.assetId = selected.id;
      changed();
      render();
      return;
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
      if (!confirm(
        action === "remove-priority" ? pageUnlocked() ? "Eliminare definitivamente questa priorit\xE0 da tutti i sopralluoghi? Il rilievo diagnostico e le azioni collegate vengono conservati." : "Rimuovere questa priorit\xE0? Il rilievo diagnostico e le azioni collegate vengono conservati." : pageUnlocked() ? removesDiagnosis ? "Eliminare definitivamente questa riga e le azioni collegate da tutti i sopralluoghi?" : "Eliminare definitivamente questo elemento da tutti i sopralluoghi?" : removesDiagnosis ? "Eliminare il rilievo diagnostico, la priorit\xE0 e le azioni collegate?" : "Rimuovere questo elemento e i dati contenuti?"
      ))
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
        if ((_b = state.priorities[i]) == null ? void 0 : _b.diagnosisId) {
          const source = state.diagnosis.find((record) => record.id === state.priorities[i].diagnosisId);
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
  $("next").onclick = () => state.section === SECTIONS.length - 1 ? exportFinal() : navigate(1);
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
  var updateButtons = [$("homeUpdateButton"), $("updateButton")];
  async function searchForUpdates() {
    if (busy) return;
    $("options").open = $("homeOptions").open = false;
    const view = $("editor").hidden ? "home" : "editor";
    const controls = [...$("sectionContent").querySelectorAll("button, input, select, textarea")].map((element) => ({ element, disabled: element.disabled }));
    const progress = (message) => {
      for (const button of updateButtons) button.textContent = message;
      notify(message);
    };
    let reloading = false;
    setBusy(true);
    for (const { element } of controls) element.disabled = true;
    for (const button of updateButtons) button.setAttribute("aria-busy", "true");
    try {
      progress("Ricerca in corso\u2026");
      if (state && !await persist())
        throw Error("Bozza non salvata. Salva la scheda prima di applicare un aggiornamento.");
      const update = await checkForUpdates(progress);
      if (!update.available) {
        notify("L\u2019app \xE8 gi\xE0 aggiornata alla V." + VERSION + ".");
        return;
      }
      progress("Aggiornamento in corso\u2026");
      if (state && !await persist())
        throw Error("Bozza non salvata. L\u2019aggiornamento non \xE8 stato applicato; la scheda resta aperta.");
      try {
        rememberUpdateView(view, update.version);
      } catch {
        throw Error("Non \xE8 possibile preparare la riapertura della scheda. Riprova senza chiudere l\u2019app.");
      }
      location.reload();
      reloading = true;
    } catch (error) {
      const networkError = ["TypeError", "NetworkError", "SecurityError", "InvalidStateError"].includes(error.name);
      notify(networkError ? navigator.onLine === false ? "Connessione assente. Riprova quando sei online." : "Impossibile cercare gli aggiornamenti. Controlla la connessione e riprova." : error.message || "Impossibile cercare gli aggiornamenti. Riprova tra poco.");
    } finally {
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
  $("newDialog").addEventListener("click", (event) => {
    const button = event.target.closest("[data-kind]");
    if (!button || busy) return;
    const kind = button.dataset.kind;
    const items = assets.filter((item) => item.kind === kind);
    $("assetSelect").replaceChildren(...items.map((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      return option;
    }));
    for (const category of $("newDialog").querySelectorAll("[data-kind]"))
      category.setAttribute("aria-pressed", String(category === button));
    if (kind === "road" || kind === "aqueduct") createSheet(items[0].id);
    else $("assetDialog").showModal();
  });
  $("newForm").onsubmit = (event) => {
    event.preventDefault();
    return createSheet();
  };
  async function createSheet(assetId = $("assetSelect").value) {
    if (busy || !assets.some((item) => item.id === assetId)) return;
    if (draftAvailable && !confirm(
      "Creare una nuova scheda sostituendo la bozza corrente? Salva prima la scheda se vuoi conservarla."
    ))
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
    } finally {
      setBusy(false);
    }
  }
  $("resumeButton").onclick = () => {
    if (!busy && state) show("editor");
  };
  $("resetButton").onclick = async () => {
    if (busy) {
      notify("Attendi il completamento del salvataggio.");
      return;
    }
    if (!confirm(
      "Cancellare tutti i dati e le fotografie della bozza? I file gi\xE0 esportati resteranno disponibili."
    ))
      return;
    setBusy(true);
    try {
      clearTimeout(saveTimer);
      await saveChain;
      if (storageReady) await removeDraft();
      try {
        localStorage.removeItem("restauro-v3-fallback");
      } catch {
      }
      state = null;
      draftAvailable = false;
      revision = savedRevision = 0;
      $("resumeButton").disabled = true;
      show("home");
      notify("Bozza cancellata.");
    } catch (error) {
      notify("Reset non riuscito: " + error.message);
    } finally {
      setBusy(false);
    }
  };
  $("newDialog").addEventListener("close", () => {
    if ($("assetDialog").open) $("assetDialog").close();
  });
  var transactionalDialogs = /* @__PURE__ */ new Set(["newDialog", "assetDialog", "surveyDialog", "saveDialog"]);
  initDialogs((dialog) => !busy || !transactionalDialogs.has(dialog.id));
  document.addEventListener("click", (e) => {
    for (const id of ["options", "homeOptions"])
      if (!e.target.closest("#" + id)) $(id).open = false;
  });
  async function insertPhotos(files2) {
    if (busy || !state || !files2.length) return;
    const target = state;
    let failures = 0, added = 0;
    setBusy(true);
    try {
      for (const file of files2) {
        try {
          const photo = await readPhoto(file, target.survey.date);
          if (state !== target) return;
          target.photos.push(photo);
          added++;
        } catch {
          failures++;
        }
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
        assets
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
  $("surveyDialog").addEventListener("close", () => {
    pendingImport = null;
  });
  $("surveyForm").onsubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const source = pendingImport || state;
      parseState(source, assets);
      if (pendingImport && draftAvailable && !confirm("Sostituire la bozza corrente con la scheda importata?")) return;
      const next = structuredClone(source);
      beginSurvey(next, $("surveyDate").value);
      clearTimeout(saveTimer);
      await saveChain;
      state = next;
      unlockedPages.clear();
      $("surveyDialog").close();
      pendingImport = null;
      changed();
      show("editor");
      await persist();
    } catch (error) {
      $("surveyError").textContent = error.message;
      $("surveyError").hidden = false;
    } finally {
      setBusy(false);
    }
  };
  $("pageLockButton").onclick = () => {
    if (!state || busy) return;
    const key = SECTION_DEFINITIONS[state.section].key;
    const expanded = [...$("sectionContent").querySelectorAll("details")].map((detail) => detail.open);
    if (unlockedPages.has(key)) unlockedPages.delete(key);
    else unlockedPages.add(key);
    render();
    [...$("sectionContent").querySelectorAll("details")].forEach((detail, index) => {
      detail.open = expanded[index] || false;
    });
    notify(pageUnlocked() ? "Pagina sbloccata: le correzioni sostituiscono i dati anche nello storico." : "Blocchi della pagina ripristinati.");
  };
  $("surveyHistoryButton").onclick = () => {
    if (!state || busy) return;
    const section = SECTION_DEFINITIONS[state.section];
    $("surveyHistoryTitle").textContent = "Storico \xB7 " + section.label;
    $("surveyHistoryContent").innerHTML = historyHtml(state, section.key);
    $("surveyHistoryDialog").showModal();
  };
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
  var formatInputs = [...document.querySelectorAll('#saveForm input[name="format"]')];
  var jsonFormat = formatInputs.find((input) => input.value === "json");
  function enforceJson() {
    jsonFormat.checked = true;
    jsonFormat.disabled = true;
  }
  $("saveForm").addEventListener("change", () => {
    enforceJson();
    $("confirmSave").disabled = busy;
  });
  $("saveForm").onsubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    enforceJson();
    const selected = formatInputs.filter((input) => input.checked).map((input) => input.value);
    if (!selected.length) return;
    $("saveError").hidden = true;
    setBusy(true);
    $("closeSave").disabled = true;
    $("confirmSave").disabled = true;
    $("confirmSave").textContent = "Generazione\u2026";
    formatInputs.forEach((input) => input.disabled = true);
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
      const files2 = await buildExportFiles(snapshot, assets, selected);
      if (version !== revision) throw Error("La scheda \xE8 stata modificata. Premi nuovamente Salva.");
      if (await exportFiles.prepare(files2, baseName(snapshot, assets))) {
        if (version !== revision) {
          exportFiles.clear();
          throw Error("La scheda \xE8 stata modificata. Premi nuovamente Salva.");
        }
        $("saveDialog").close();
        exportFiles.download();
      }
    } catch (error) {
      $("saveError").textContent = error.message;
      $("saveError").hidden = false;
    } finally {
      setBusy(false);
      formatInputs.forEach((input) => input.disabled = input === jsonFormat);
      $("closeSave").disabled = false;
      $("confirmSave").textContent = "Salva";
      $("confirmSave").disabled = !formatInputs.some((input) => input.checked);
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
    const startRevision = revision;
    let storageFailed = false;
    try {
      await openStorage();
      storageReady = true;
      const saved = await loadDraft();
      let recovered = null;
      if (saved) recovered = parseState(saved, assets, { allowIncomplete: true });
      else {
        const legacy = await loadLegacyDraft();
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
})();
