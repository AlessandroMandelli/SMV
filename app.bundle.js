/* Schede Restauro 2.7 — generato dai sorgenti modulari in js/. */
(() => {
  // app/js/model.js
  var APP_ID = "schede-restauro";
  var SCHEMA_VERSION = 1;
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
  var SECTIONS = [
    "Identificazione e dati del bene",
    "Storico e stato conservativo",
    "Diagnostica e priorit\xE0",
    "Atlante fotografico",
    "Manutenzione immediata",
    "Azioni preventive"
  ];
  var RISKS = ["BASSO", "MEDIO", "ALTO"];
  var WINDOWS = [
    "PROSECUZIONE MONITORAGGIO",
    "IMMEDIATO",
    "ENTRO 6 MESI",
    "ENTRO 12 MESI"
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
    exposure: "",
    methods: [],
    assessment: ""
  });
  var diagnosisRecord = () => ({
    id: uid(),
    area: "",
    element: "",
    pathology: "",
    causes: "",
    risk: "",
    resolvedDate: "",
    actions: []
  });
  var priorityRecord = () => ({
    id: uid(),
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
  function newState(assetId) {
    const date = localDate();
    return {
      app: APP_ID,
      schemaVersion: SCHEMA_VERSION,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      assetId,
      filename: "",
      customFilename: false,
      section: 0,
      general: {
        id: "",
        date,
        time: localTime(),
        object: "",
        chronology: "",
        author: "",
        altitude: "",
        distance: "",
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
  function baseName(state2, assets2) {
    if (state2.customFilename && state2.filename.trim())
      return safeFilename(state2.filename);
    const asset2 = assets2.find((a) => a.id === state2.assetId);
    const name = (asset2 == null ? void 0 : asset2.kind) === "arch" ? `Arco_${String(asset2.number).padStart(2, "0")}` : `Cappella_${String((asset2 == null ? void 0 : asset2.number) || "").padStart(2, "0")}`;
    const date = state2.general.date || localDate(new Date(state2.createdAt));
    return `Sacro_Monte_Varese_${name}_${date.replaceAll("-", "_")}_${localTime(new Date(state2.createdAt)).replace(":", "_")}`;
  }
  function safeFilename(name) {
    return name.trim().replace(/\.(pdf|json|zip)$/i, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/[. ]+$/, "").slice(0, 160) || "Scheda_Restauro";
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
  var displayDate = (value) => value ? value.split("-").reverse().join("/") : "";
  function displayMonth(value) {
    if (!value) return "";
    const [y, m] = value.split("-");
    return `${["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"][Number(m) - 1]} ${y}`;
  }
  function applyFixed(state2, assets2) {
    const selected = assets2.find((a) => a.id === state2.assetId);
    const fixed = (selected == null ? void 0 : selected.fixed) || {};
    state2.fixedCommon = { ...COMMON };
    state2.assetSnapshot = selected ? structuredClone(selected) : null;
    for (const key of Object.keys(state2.general))
      if (Object.hasOwn(fixed, key)) state2.general[key] = String(fixed[key]);
    return state2;
  }
  function parseState(input, assets2, { allowIncomplete = false } = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (!input || input.app !== APP_ID || input.schemaVersion !== SCHEMA_VERSION)
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
    const records = (values, factory, keys) => arr(values).map((value) => {
      if (!value || typeof value !== "object")
        throw Error("Riga JSON non valida.");
      const row = factory();
      for (const k of keys) row[k] = text(value[k]);
      return row;
    });
    out.createdAt = text(input.createdAt);
    if (!Number.isFinite(Date.parse(out.createdAt)))
      throw Error("Data di creazione non valida.");
    out.filename = safeFilename(text(input.filename));
    out.customFilename = input.customFilename === true;
    out.section = Number.isInteger(input.section) ? Math.max(0, Math.min(5, input.section)) : 0;
    for (const key of Object.keys(out.general))
      out.general[key] = text((_a = input.general) == null ? void 0 : _a[key]);
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
      (_b = input.history) == null ? void 0 : _b.restorations,
      historyRecord,
      ["date", "action"]
    );
    out.history.maintenance = records((_c = input.history) == null ? void 0 : _c.maintenance, historyRecord, [
      "date",
      "action"
    ]);
    for (const row of [...out.history.restorations, ...out.history.maintenance])
      row.date = date(row.date, true);
    out.conditions = records(input.conditions, conditionRecord, [
      "exposure",
      "assessment"
    ]);
    out.conditions.forEach((r, i) => {
      r.methods = arr(input.conditions[i].methods).map((m) => choice(m, METHODS)).filter(Boolean);
    });
    out.diagnosis = records(input.diagnosis, diagnosisRecord, [
      "area",
      "element",
      "pathology",
      "causes",
      "risk",
      "resolvedDate"
    ]);
    out.diagnosis.forEach((r, i) => {
      r.risk = choice(r.risk, RISKS);
      r.resolvedDate = date(r.resolvedDate);
      r.actions = records(input.diagnosis[i].actions, preventiveRecord, [
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
        a.window = choice(a.window, WINDOWS);
        a.role = choice(a.role, ROLES);
        a.status = choice(a.status, STATUSES);
      }
    });
    out.priorities = records(input.priorities, priorityRecord, [
      "risk",
      "window",
      "anomalies"
    ]);
    for (const r of out.priorities) {
      r.risk = choice(r.risk, RISKS);
      r.window = choice(r.window, WINDOWS);
    }
    out.inspectionNotes = text(input.inspectionNotes);
    out.photos = arr(input.photos).map((p) => {
      if (!p || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\s]+$/.test(
        p.data || ""
      ))
        throw Error("Fotografia JSON non valida.");
      if (!Number.isFinite(p.width) || !Number.isFinite(p.height) || p.width <= 0 || p.height <= 0)
        throw Error("Dimensioni fotografia non valide.");
      return { id: uid(), data: p.data, width: p.width, height: p.height };
    });
    out.immediate.date = date((_d = input.immediate) == null ? void 0 : _d.date);
    out.immediate.executedDate = date((_e = input.immediate) == null ? void 0 : _e.executedDate);
    out.immediate.records = records((_f = input.immediate) == null ? void 0 : _f.records, immediateRecord, [
      "area",
      "action"
    ]);
    out.immediate.notes = text((_g = input.immediate) == null ? void 0 : _g.notes);
    out.preventive.date = date((_h = input.preventive) == null ? void 0 : _h.date);
    out.preventive.notes = text((_i = input.preventive) == null ? void 0 : _i.notes);
    return applyFixed(out, assets2);
  }

  // app/js/storage.js
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

  // app/js/catalog.js
  var ASSETS = [
    {
      "id": "c01",
      "label": "Cappella 01",
      "kind": "chapel",
      "number": 1,
      "x": 65.51257300698458,
      "y": 79.1408729024962,
      "fixed": {}
    },
    {
      "id": "c02",
      "label": "Cappella 02",
      "kind": "chapel",
      "number": 2,
      "x": 72.68714390278781,
      "y": 69.50845361383881,
      "fixed": {}
    },
    {
      "id": "c03",
      "label": "Cappella 03",
      "kind": "chapel",
      "number": 3,
      "x": 78.68463005404021,
      "y": 60.845571227075844,
      "fixed": {}
    },
    {
      "id": "c04",
      "label": "Cappella 04",
      "kind": "chapel",
      "number": 4,
      "x": 88.3815522827854,
      "y": 66.21562970230353,
      "fixed": {}
    },
    {
      "id": "c05",
      "label": "Cappella 05",
      "kind": "chapel",
      "number": 5,
      "x": 86.92432910720737,
      "y": 50.96699295669386,
      "fixed": {}
    },
    {
      "id": "c06",
      "label": "Cappella 06",
      "kind": "chapel",
      "number": 6,
      "x": 68.98771958544076,
      "y": 59.72233225538498,
      "fixed": {}
    },
    {
      "id": "c07",
      "label": "Cappella 07",
      "kind": "chapel",
      "number": 7,
      "x": 48.97731420851397,
      "y": 57.92204874108611,
      "fixed": {}
    },
    {
      "id": "c08",
      "label": "Cappella 08",
      "kind": "chapel",
      "number": 8,
      "x": 50.01412393500121,
      "y": 48.058701858339056,
      "fixed": {}
    },
    {
      "id": "c09",
      "label": "Cappella 09",
      "kind": "chapel",
      "number": 9,
      "x": 49.033186660796005,
      "y": 42.16553012363638,
      "fixed": {}
    },
    {
      "id": "c10",
      "label": "Cappella 10",
      "kind": "chapel",
      "number": 10,
      "x": 48.80892068205082,
      "y": 34.7950461509754,
      "fixed": {}
    },
    {
      "id": "c11",
      "label": "Cappella 11",
      "kind": "chapel",
      "number": 11,
      "x": 57.385030463481456,
      "y": 44.62740080792859,
      "fixed": {}
    },
    {
      "id": "c12",
      "label": "Cappella 12",
      "kind": "chapel",
      "number": 12,
      "x": 61.644755163174366,
      "y": 49.08969698965409,
      "fixed": {}
    },
    {
      "id": "c13",
      "label": "Cappella 13",
      "kind": "chapel",
      "number": 13,
      "x": 62.79388604136561,
      "y": 41.08840822959816,
      "fixed": {}
    },
    {
      "id": "c14",
      "label": "Cappella 14",
      "kind": "chapel",
      "number": 14,
      "x": 59.1507222611091,
      "y": 30.825184153545816,
      "fixed": {}
    },
    {
      "id": "arco1",
      "label": "Primo Arco, Arco della Madonna del Rosario",
      "kind": "arch",
      "number": 1,
      "x": 59.4,
      "y": 83,
      "fixed": {}
    },
    {
      "id": "arco2",
      "label": "Secondo Arco, Arco di San Carlo",
      "kind": "arch",
      "number": 2,
      "x": 79.7,
      "y": 53.7,
      "fixed": {}
    },
    {
      "id": "arco3",
      "label": "Terzo Arco, Arco di Sant\u2019Ambrogio",
      "kind": "arch",
      "number": 3,
      "x": 52.9,
      "y": 39.5,
      "fixed": {}
    }
  ];

  // app/js/legacy.js
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
    return applyFixed(out, assets2);
  }

  // app/js/pdf.js
  var WIDTH = 792;
  var HEIGHT = 612;
  var BOTTOM = 550;
  var SECTION_BAR = { x: 32.82, width: 723, height: 18, textX: 36.78 };
  var SECTION_TITLES = {
    3: { index: 1, textX: 32.82, baseline: 40.14 },
    4: { index: 1, textX: 36.78, baseline: 236.48 },
    5: { index: 1, textX: 36.78, baseline: 358.72 },
    6: { index: 2, textX: 36.78, baseline: 240.02 }
  };
  var ATLAS_TOP = 227.8;
  var IMMEDIATE_NOTES = [27, 456, 727, 100];
  var PREVENTIVE_NOTES = [31, 466, 727, 87];
  var files = /* @__PURE__ */ new Map();
  var normalize = (value) => String(value ?? "").normalize("NFC").replace(/\r\n?/g, "\n").replace(/\t/g, "    ");
  var hasText = (value) => normalize(value).trim().length > 0;
  var diagnosisHasContent = (row) => [
    row.area,
    row.element,
    row.pathology,
    row.causes,
    row.risk,
    row.resolvedDate
  ].some(hasText);
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
  var TemplateReport = class {
    constructor(pdf, templates, fonts, api) {
      this.pdf = pdf;
      this.templates = templates;
      this.fonts = fonts;
      this.api = api;
      this.overflow = [];
      this.used = /* @__PURE__ */ new Map();
      this.coverage = new Map(
        Object.values(fonts).map((font) => [
          font,
          new Set(font.getCharacterSet())
        ])
      );
    }
    page(index) {
      const page = this.pdf.addPage([WIDTH, HEIGHT]);
      page.drawPage(this.templates[index]);
      this.used.set(page, [540, 365.5, 0, 218, 216][index]);
      return page;
    }
    slice(page, index, x, top, width, height, destX = x, destTop = top) {
      const { pushGraphicsState, popGraphicsState, rectangle, clip, endPath } = this.api;
      page.pushOperators(
        pushGraphicsState(),
        rectangle(destX, HEIGHT - destTop - height, width, height),
        clip(),
        endPath()
      );
      page.drawPage(this.templates[index], { x: destX - x, y: top - destTop });
      page.pushOperators(popGraphicsState());
      if (destTop < BOTTOM) this.mark(page, destTop + height);
    }
    clear(page, x, top, width, height, color = this.api.rgb(1, 1, 1)) {
      page.drawRectangle({ x, y: HEIGHT - top - height, width, height, color });
    }
    mark(page, bottom) {
      this.used.set(page, Math.max(this.used.get(page) || 0, bottom));
    }
    hideUnless(page, visible, rect, color) {
      if (!visible) this.clear(page, ...rect, color);
    }
    sectionHeading(page, section, top) {
      const source = SECTION_TITLES[section];
      const { x, width, height, textX } = SECTION_BAR;
      this.clear(page, x, top, width, height, this.api.rgb(0, 0.357, 0.376));
      this.slice(
        page,
        source.index,
        source.textX - 0.5,
        source.baseline - 10,
        width - 8,
        13,
        textX - 0.5,
        top + 1.34
      );
      this.mark(page, top + height);
    }
    appendHeading(section) {
      let page = this.pdf.getPages().at(-1);
      let top = (this.used.get(page) ?? BOTTOM) + 14;
      if (top + SECTION_BAR.height > BOTTOM) {
        page = this.continuation(SECTION_TITLES[section].index);
        top = 30;
      }
      this.sectionHeading(page, section, top);
      return page;
    }
    continuation(index, heading) {
      const page = this.pdf.addPage([WIDTH, HEIGHT]);
      this.used.set(page, 0);
      this.slice(page, index, 0, 560, WIDTH, 52);
      if (index === 3 || index === 4) {
        this.slice(page, index, 0, 0, WIDTH, index === 3 ? 218 : 215);
        if (this.state) {
          const date = index === 3 ? this.state.immediate.date : this.state.preventive.date;
          sharedFields(this, page, this.state, date, false);
          if (index === 3) {
            this.hideUnless(
              page,
              hasText(this.state.immediate.executedDate),
              [121, 164.9, 620, 12.5]
            );
            this.fit(
              page,
              "Eseguiti in data",
              displayDate(this.state.immediate.executedDate),
              201,
              165.4,
              520,
              13
            );
          }
        }
      }
      if (heading)
        this.slice(
          page,
          index,
          ...heading.rect,
          heading.rect[0],
          heading.top ?? 30
        );
      return page;
    }
    font(char, bold = false) {
      const primary = bold ? this.fonts.bold : this.fonts.regular;
      if (this.coverage.get(primary).has(char.codePointAt(0))) return primary;
      const fallback = bold ? this.fonts.fallbackBold : this.fonts.fallback;
      if (!this.coverage.get(fallback).has(char.codePointAt(0)))
        throw Error("Carattere non disponibile nel font del PDF: " + char);
      return fallback;
    }
    width(text, size = 9.5, bold = false) {
      return [...normalize(text)].reduce(
        (sum, c) => sum + this.font(c, bold).widthOfTextAtSize(c, size),
        0
      );
    }
    text(page, text, x, baseline, size = 9.5, { bold = false, color = this.api.rgb(0, 0, 0) } = {}) {
      let run = "", font = null, position = x;
      const flush = () => {
        if (!run) return;
        page.drawText(run, {
          x: position,
          y: HEIGHT - baseline,
          size,
          font,
          color
        });
        position += font.widthOfTextAtSize(run, size);
        run = "";
      };
      for (const char of normalize(text)) {
        if (char === "\n") continue;
        const next = this.font(char, bold);
        if (font && next !== font) flush();
        font = next;
        run += char;
      }
      flush();
      if (hasText(text)) this.mark(page, baseline + size * 0.3);
    }
    lines(text, width, size = 9.5) {
      const lines = [];
      for (const paragraph of normalize(text).split("\n")) {
        let line = "";
        for (const token of paragraph.match(/\S+\s*|\s+/g) || [""]) {
          if (this.width(line + token, size) <= width) {
            line += token;
            continue;
          }
          if (line.trim()) {
            lines.push(line.trimEnd());
            line = "";
          }
          for (const char of token) {
            if (this.width(line + char, size) > width && line) {
              lines.push(line.trimEnd());
              line = "";
            }
            line += char;
          }
        }
        lines.push(line.trimEnd());
      }
      return lines;
    }
    fit(page, label, value, x, top, width, height, { color, bold = false, queue = true } = {}) {
      if (!hasText(value)) return;
      let size = 9.5, lines;
      for (; size >= 8; size -= 0.25) {
        lines = this.lines(value, width, size);
        if (lines.length * size * 1.18 <= height + 0.1) break;
      }
      size = Math.max(8, size);
      lines = this.lines(value, width, size);
      const capacity = Math.max(1, Math.floor(height / (size * 1.18)));
      if (lines.length > capacity) {
        const take = Math.max(0, capacity - 1);
        const visible = lines.slice(0, take);
        visible.push(capacity === 1 ? "(segue)" : "(segue nella continuazione)");
        visible.forEach(
          (line, i) => this.text(page, line, x, top + 8.6 + i * size * 1.18, size, {
            color,
            bold
          })
        );
        if (queue)
          this.overflow.push({ label, text: lines.slice(take).join("\n") });
      } else
        lines.forEach(
          (line, i) => this.text(page, line, x, top + 8.6 + i * size * 1.18, size, {
            color,
            bold
          })
        );
    }
    check(page, x, top, size = 8) {
      this.mark(page, top + size);
      const c = this.api.rgb(0, 0.22, 0.42);
      page.drawLine({
        start: { x: x + 1, y: HEIGHT - top - size * 0.5 },
        end: { x: x + size * 0.4, y: HEIGHT - top - size * 0.88 },
        thickness: 1,
        color: c
      });
      page.drawLine({
        start: { x: x + size * 0.4, y: HEIGHT - top - size * 0.88 },
        end: { x: x + size * 0.95, y: HEIGHT - top - size * 0.08 },
        thickness: 1,
        color: c
      });
    }
    risk(page, value, x, top, width = 65) {
      const color = {
        BASSO: this.api.rgb(0.1, 0.43, 0.2),
        MEDIO: this.api.rgb(0.58, 0.42, 0),
        ALTO: this.api.rgb(0.72, 0.06, 0.06)
      }[value];
      this.fit(page, "Grado d\u2019urgenza", value, x, top, width, 14, { color });
    }
    flushOverflow(index) {
      if (!this.overflow.length) return;
      const pending = this.overflow.splice(0);
      let page = this.continuation(index), y = index >= 3 ? 225 : 32;
      for (const item of pending) {
        if (y + 45 > BOTTOM) {
          page = this.continuation(index);
          y = index >= 3 ? 225 : 32;
        }
        this.text(page, item.label + " \u2014 continuazione", 34, y + 10, 9.5, {
          bold: true
        });
        y += 24;
        for (const line of this.lines(item.text, 710, 9.5)) {
          if (y + 13 > BOTTOM) {
            page = this.continuation(index);
            y = index >= 3 ? 225 : 32;
            this.text(page, item.label + " \u2014 continuazione", 34, y + 10, 9.5, {
              bold: true
            });
            y += 24;
          }
          this.text(page, line, 34, y + 9.5);
          y += 12;
        }
        y += 16;
      }
    }
  };
  function diagnostics(report, page, rows, titleTop) {
    const xs = [32.82, 151.88, 270.92, 418.72, 574.6, 666.76, 747.18];
    const headers = [32.58, 380.86, 714.84, 20.7];
    const entries = rows.filter(diagnosisHasContent);
    report.sectionHeading(page, 5, titleTop);
    if (!entries.length) return;
    const headerTop = titleTop + 32;
    report.slice(page, 1, ...headers, headers[0], headerTop);
    let current = page, y = headerTop + 20.94, bottom = BOTTOM, parity = 0;
    function next() {
      current = report.continuation(1);
      report.sectionHeading(current, 5, 31);
      report.slice(current, 1, ...headers, 32.58, 62);
      y = 82.7;
      bottom = 550;
    }
    for (const row of entries) {
      const values = [
        row.area,
        row.element,
        row.pathology,
        row.causes,
        row.risk,
        displayDate(row.resolvedDate)
      ];
      const wrapped = values.map(
        (v, i) => report.lines(v, xs[i + 1] - xs[i] - 9)
      );
      let offset = 0, total = Math.max(...wrapped.map((l) => l.length), 1);
      while (offset < total) {
        const desired = Math.max(17.14, (total - offset) * 11.4 + 6);
        if (y + desired > bottom && desired < 450) {
          next();
        }
        if (y + 18 > bottom) next();
        const count = Math.min(
          total - offset,
          Math.max(1, Math.floor((bottom - y - 6) / 11.4))
        ), height = Math.max(17.14, count * 11.4 + 6);
        for (let c = 0; c < 6; c++) {
          current.drawRectangle({
            x: xs[c],
            y: HEIGHT - y - height,
            width: xs[c + 1] - xs[c],
            height,
            borderWidth: 0.48,
            borderColor: report.api.rgb(0.867, 0.867, 0.867),
            color: parity % 2 ? report.api.rgb(0.957, 0.969, 0.965) : report.api.rgb(1, 1, 1)
          });
          const lines = offset > 0 && wrapped[c].length <= offset ? wrapped[c] : wrapped[c].slice(offset, offset + count);
          lines.forEach((line, j) => {
            if (c === 4)
              report.risk(
                current,
                line,
                xs[c] + 4,
                y + 3 + j * 11.4,
                xs[c + 1] - xs[c] - 8
              );
            else report.text(current, line, xs[c] + 4, y + 12 + j * 11.4);
          });
        }
        y += height;
        report.mark(current, y);
        offset += count;
        if (offset < total) next();
      }
      parity++;
    }
  }
  function history(report, page, state2) {
    let cursor = 28.5 + SECTION_BAR.height;
    report.sectionHeading(page, 3, 28.5);
    for (const [key, top] of [
      ["restorations", 63.3],
      ["maintenance", 147.9]
    ]) {
      let fields = function(target, row, offset = 0, height = 38) {
        report.hideUnless(target, hasText(row.date), [
          35,
          dateTop + offset - 0.5,
          30,
          12
        ]);
        report.hideUnless(target, hasText(row.action), [
          35,
          actionTop + offset - 0.5,
          39,
          12
        ]);
        report.fit(
          target,
          "Data intervento precedente",
          displayMonth(row.date),
          66,
          dateTop + offset,
          650,
          14
        );
        report.fit(
          target,
          "Azione precedente",
          row.action,
          74,
          actionTop + offset,
          665,
          height
        );
      };
      const rows = state2.history[key].filter(
        (row) => [row.date, row.action].some(hasText)
      );
      const first = rows[0];
      const dateTop = key === "restorations" ? 80.2 : 162.5, actionTop = key === "restorations" ? 97.2 : 177.1;
      if (first) {
        const start = cursor + 14;
        const end = hasText(first.action) ? actionTop + 38 : dateTop + 14;
        report.slice(page, 1, 35, top - 1, 710, end - top + 1, 35, start);
        fields(page, first, start - top + 1);
        cursor = start + end - top + 1;
      }
      for (const row of rows.slice(1)) {
        const continuation = report.continuation(1);
        report.sectionHeading(continuation, 3, 29);
        report.slice(continuation, 1, 35, top - 3, 705, 69, 35, 65);
        fields(continuation, row, 68 - top, 400);
      }
    }
    const conditions = state2.conditions.filter(
      (condition) => [condition.exposure, condition.assessment].some(hasText) || condition.methods.length
    );
    const conditionTitleTop = cursor + 14;
    report.sectionHeading(page, 4, conditionTitleTop);
    cursor = conditionTitleTop + SECTION_BAR.height;
    conditions.forEach((condition, i) => {
      let target = page, offset = 0;
      if (i) {
        target = report.continuation(1);
        report.sectionHeading(target, 4, 30);
        report.slice(target, 1, 28, 245, 724, 88, 28, 52);
        offset = 193;
      } else {
        const start = cursor + 14;
        const end = hasText(condition.assessment) ? 332 : condition.methods.length ? 292 : 276;
        report.slice(page, 1, 35, 260.8, 710, end - 260.8, 35, start);
        offset = 260.8 - start;
        cursor = start + end - 260.8;
      }
      report.hideUnless(target, hasText(condition.exposure), [
        35,
        260.8 - offset,
        66,
        12
      ]);
      report.hideUnless(target, condition.methods.length > 0, [
        35,
        277.5 - offset,
        710,
        14
      ]);
      report.hideUnless(target, hasText(condition.assessment), [
        35,
        296.3 - offset,
        107,
        12
      ]);
      report.fit(
        target,
        "Esposizione",
        condition.exposure,
        101,
        261.4 - offset,
        638,
        15
      );
      for (const [j, x] of [156.6, 256, 369.6].entries())
        if (condition.methods.includes(METHODS[j]))
          report.check(target, x, 280 - offset);
      report.fit(
        target,
        "Valutazione sintetica",
        condition.assessment,
        141,
        296.9 - offset,
        598,
        i ? 350 : 35
      );
    });
    return cursor + 14;
  }
  function priority(report, page, row, dy = 0) {
    const filled = row && [row.risk, row.window, row.anomalies].some(hasText);
    if (!filled) {
      report.clear(page, 31, 28 - dy, 727, 115);
      return;
    }
    const background = report.api.rgb(0.91, 0.945, 0.949);
    report.mark(page, 141.5 - dy);
    report.hideUnless(
      page,
      hasText(row.risk),
      [36.5, 58 - dy, 91, 13.5],
      background
    );
    report.hideUnless(
      page,
      hasText(row.risk) && hasText(row.window),
      [178.5, 58 - dy, 22, 13.5],
      background
    );
    report.hideUnless(
      page,
      hasText(row.window),
      [206.8, 58 - dy, 500, 26.5],
      background
    );
    report.hideUnless(
      page,
      hasText(row.anomalies),
      [206.8, 85.8 - dy, 78, 12],
      background
    );
    report.risk(page, row.risk, 129, 58.7 - dy, 48);
    for (const [i, x] of [207.6, 392.2, 477.5, 576.8].entries())
      if (row.window === WINDOWS[i]) report.check(page, x, 74 - dy);
    report.fit(page, "Anomalie attese", row.anomalies, 285, 86.4 - dy, 452, 56);
  }
  async function inspectionEnd(report, state2) {
    const priorities = state2.priorities.filter(
      (row) => [row.risk, row.window, row.anomalies].some(hasText)
    );
    if (!priorities.length && !hasText(state2.inspectionNotes) && !state2.photos.length) {
      report.appendHeading(6);
      return;
    }
    const page = report.page(2);
    priority(report, page, priorities[0]);
    report.hideUnless(page, hasText(state2.inspectionNotes), [31, 155, 727, 60]);
    if (hasText(state2.inspectionNotes)) report.mark(page, 214.5);
    report.fit(
      page,
      "Note aggiuntive",
      state2.inspectionNotes,
      118,
      160.1,
      620,
      55
    );
    if (!state2.photos.length) report.clear(page, 31, 227, 729, 324);
    for (const row of priorities.slice(1)) {
      const continuation = report.continuation(2);
      report.slice(continuation, 2, 32.7, 28.4, 724.5, 114);
      priority(report, continuation, row);
    }
    if (state2.photos.length) {
      report.clear(page, 31, 227, 729, 23);
      report.sectionHeading(page, 6, ATLAS_TOP);
      await photographs(report, page, state2.photos);
    }
    report.flushOverflow(2);
    if (!state2.photos.length) report.appendHeading(6);
  }
  async function photographs(report, page, photos) {
    report.clear(page, 31, 261.5, 729, 289.5);
    if (!photos.length) return;
    const gap = 12, width = (712 - gap) / 2;
    let target = page;
    for (let i = 0; i < photos.length; i++) {
      const slot = i % 4;
      if (i > 0 && slot === 0) {
        target = report.continuation(2);
        report.sectionHeading(target, 6, 30);
      }
      const startTop = i < 4 ? 263 : 65, height = (540 - startTop - gap) / 2, top = startTop + Math.floor(slot / 2) * (height + gap), x = 35 + slot % 2 * (width + gap);
      const photo = photos[i], encoded = photo.data.split(",")[1];
      let bitmap;
      if (photo.data.startsWith("data:image/png"))
        bitmap = await report.pdf.embedPng(encoded);
      else if (photo.data.startsWith("data:image/jpeg"))
        bitmap = await report.pdf.embedJpg(encoded);
      else throw Error("Per il PDF usa fotografie JPEG o PNG.");
      const scale = Math.min(width / bitmap.width, height / bitmap.height), w = bitmap.width * scale, h = bitmap.height * scale;
      target.drawImage(bitmap, {
        x: x + (width - w) / 2,
        y: HEIGHT - top - (height + h) / 2,
        width: w,
        height: h
      });
    }
  }
  function sharedFields(report, page, state2, date, queue = true) {
    report.fit(page, "ID Scheda", state2.general.id, 178, 60.9, 300, 12, {
      queue
    });
    report.fit(page, "Data", displayDate(date), 152, 75.5, 320, 12, { queue });
    report.fit(page, "Oggetto", state2.general.object, 165, 102.6, 568, 12, {
      queue
    });
  }
  function immediate(report, state2) {
    let page = report.page(3);
    sharedFields(report, page, state2, state2.immediate.date);
    report.hideUnless(
      page,
      hasText(state2.immediate.executedDate),
      [121, 164.9, 620, 12.5]
    );
    report.fit(
      page,
      "Eseguiti in data",
      displayDate(state2.immediate.executedDate),
      201,
      165.4,
      520,
      13
    );
    const rows = state2.immediate.records.filter(
      (row) => [row.area, row.action].some(hasText)
    );
    report.clear(page, ...IMMEDIATE_NOTES);
    function fields(target, row) {
      report.hideUnless(target, hasText(row.area), [28, 236.8, 64, 12]);
      report.hideUnless(target, hasText(row.action), [28, 253.7, 115, 12]);
      report.fit(target, "Macro-Area", row.area, 91, 237.4, 646, 13);
      report.fit(
        target,
        "Azioni condotte in loco",
        row.action,
        143,
        254.4,
        594,
        192
      );
    }
    if (!rows.length) fields(page, { area: "", action: "" });
    rows.forEach((row, i) => {
      if (i) {
        page = report.continuation(3);
        report.slice(page, 3, 28, 232, 736, 36);
        report.hideUnless(
          page,
          hasText(state2.immediate.executedDate),
          [121, 164.9, 620, 12.5]
        );
      }
      fields(page, row);
    });
    if (hasText(state2.immediate.notes)) report.slice(page, 3, ...IMMEDIATE_NOTES);
    report.fit(
      page,
      "Note aggiuntive",
      state2.immediate.notes,
      114,
      461.2,
      624,
      77
    );
  }
  function preventiveFields(report, page, action) {
    report.clear(page, 28, 294.8, 721, 164);
    if (!action) return;
    if (hasText(action.risk)) {
      report.slice(page, 4, 35, 295.5, 84, 11.8);
      report.risk(page, action.risk, 122, 296, 57);
    }
    if (hasText(action.window)) {
      report.slice(page, 4, 213, 295.5, 101.5, 11.8);
      report.fit(page, "Finestra d\u2019intervento", action.window, 318, 296, 420, 14);
    }
    if (hasText(action.risk) && hasText(action.window))
      report.slice(page, 4, 184.5, 295.5, 20, 11.8);
    const fields = [
      ["Descrizione", action.description, 317, 335.45, 128, 324.5],
      ["Azione", action.action, 335.45, 346.95, 141, 336.02],
      ["Obiettivo", action.objective, 346.95, 358.45, 151, 347.54],
      ["Operatore", action.operator, 358.45, 369.7, 156, 359]
    ];
    const heights = fields.map(([, value, top, bottom, x]) => {
      const lines = hasText(value) ? report.lines(value, 740 - x).length : 0;
      return Math.max(bottom - top, lines > 1 ? lines * 11.3 : 0);
    });
    const extra = heights.reduce(
      (sum, height, i) => sum + height - (fields[i][3] - fields[i][2]),
      0
    );
    let shift = 0;
    fields.forEach(([label, value, top, bottom, x, fieldTop], i) => {
      if (hasText(value)) {
        report.slice(page, 4, 28, top, 720, bottom - top, 28, top + shift);
        report.fit(
          page,
          label,
          value,
          x,
          fieldTop + shift,
          740 - x,
          extra < 38 ? heights[i] : bottom - top
        );
      }
      if (extra < 38) shift += heights[i] - (bottom - top);
    });
    if (ROLES.includes(action.role)) {
      report.slice(page, 4, 82, 369.7, 211.5, 48, 82, 369.7 + shift);
      report.check(
        page,
        101,
        [376, 392, 408][ROLES.indexOf(action.role)] + shift,
        9
      );
    }
    if (STATUSES.includes(action.status)) {
      report.slice(page, 4, 340.5, 369.7, 284.5, 16.1, 340.5, 369.7 + shift);
      report.check(
        page,
        [383.8, 469.1, 568.4][STATUSES.indexOf(action.status)],
        376 + shift,
        9
      );
    }
  }
  function preventive(report, state2) {
    const actionHasContent = (action) => Object.entries(action).some(
      ([key, value]) => key !== "id" && hasText(value)
    );
    const records = state2.diagnosis.filter(
      (row) => [row.area, row.element, row.pathology].some(hasText) || row.actions.some(actionHasContent)
    );
    if (!records.length)
      records.push({ area: "", element: "", pathology: "", actions: [] });
    let last;
    for (const row of records) {
      const compiledActions = row.actions.filter(actionHasContent);
      const actions = compiledActions.length ? compiledActions : [null];
      for (const action of actions) {
        const page = report.page(4);
        last = page;
        sharedFields(report, page, state2, state2.preventive.date);
        report.clear(page, ...PREVENTIVE_NOTES);
        const hasContext = [row.area, row.element, row.pathology].some(hasText);
        const tableTop = hasContext ? 242.96 : 223;
        report.clear(page, 31, tableTop, 727, 281 - tableTop);
        if (hasContext) report.slice(page, 4, 32.58, 242.96, 723.54, 18.3);
        report.fit(page, "Macro-Area", row.area, 38.2, 245.5, 211, 14);
        report.fit(page, "Elemento", row.element, 260, 245.5, 211, 14);
        report.fit(
          page,
          "Patologia riscontrata",
          row.pathology,
          483,
          245.5,
          258,
          14
        );
        preventiveFields(report, page, action);
        report.flushOverflow(4);
      }
    }
    if (hasText(state2.preventive.notes))
      report.slice(last, 4, ...PREVENTIVE_NOTES);
    report.fit(
      last,
      "Note aggiuntive",
      state2.preventive.notes,
      118,
      470.9,
      620,
      70
    );
  }
  async function makePdf(state2, assets2) {
    await libraries();
    const api = window.PDFLib;
    const [template, regular, bold, fallback, fallbackBold] = await Promise.all(
      [
        "./assets/pdf-template.pdf",
        "./assets/source-arial.ttf",
        "./assets/source-arial-bold.ttf",
        "./assets/sans-regular.ttf",
        "./assets/sans-bold.ttf"
      ].map(resource)
    );
    const source = await api.PDFDocument.load(template), pdf = await api.PDFDocument.create();
    pdf.registerFontkit(window.fontkit);
    const templates = await pdf.embedPages(source.getPages());
    const fonts = {
      regular: await pdf.embedFont(regular, { subset: true }),
      bold: await pdf.embedFont(bold, { subset: true }),
      fallback: await pdf.embedFont(fallback, { subset: true }),
      fallbackBold: await pdf.embedFont(fallbackBold, { subset: true })
    };
    const report = new TemplateReport(pdf, templates, fonts, api), g = state2.general;
    report.state = state2;
    const page1 = report.page(0);
    for (const [label, value, x, top, w, h] of [
      ["ID Scheda", g.id, 178, 86.6, 215, 12],
      ["Data", displayDate(g.date), 153, 101.2, 240, 12],
      ["Ora", g.time, 148, 115.8, 245, 12],
      ["Oggetto", g.object, 75, 259.6, 322, 14],
      ["Cronologia", g.chronology, 89, 276.5, 308, 14],
      ["Autore", g.author, 69, 293.4, 328, 14],
      ["Quota s.l.m.", measureText(g.altitude), 96, 310.4, 46, 14],
      ["Distanza Santuario", measureText(g.distance), 254, 310.4, 143, 14],
      ["Soggetto", g.subject, 82, 406.8, 315, 14],
      ["Altezza H", measureText(g.height), 108, 423.8, 49, 14],
      ["Larghezza L", measureText(g.width), 194, 423.8, 48, 14],
      ["Profondit\xE0 P", measureText(g.depth), 279, 423.8, 118, 14],
      ["Materie e Tecniche", g.materials, 126, 440.7, 271, 89]
    ])
      report.fit(page1, label, value, x, top, w, h);
    const map = { x: 466.5, y: 63.1, w: 254.1, h: 462.9 };
    for (const asset2 of assets2) {
      const x = map.x + asset2.x / 100 * map.w - 4, y = map.y + asset2.y / 100 * map.h - 4;
      page1.drawRectangle({
        x,
        y: HEIGHT - y - 8,
        width: 8,
        height: 8,
        borderWidth: 0.6,
        borderColor: api.rgb(0, 0.22, 0.42),
        color: api.rgb(1, 1, 1)
      });
      if (asset2.id === state2.assetId) report.check(page1, x, y, 8);
    }
    report.flushOverflow(0);
    const page2 = report.continuation(1);
    const diagnosisTop = history(report, page2, state2);
    diagnostics(report, page2, state2.diagnosis, diagnosisTop);
    report.flushOverflow(1);
    await inspectionEnd(report, state2);
    immediate(report, state2);
    report.flushOverflow(3);
    preventive(report, state2);
    report.flushOverflow(4);
    pdf.setTitle(baseName(state2, assets2));
    pdf.setAuthor("Cr\xF2mo s.c.ar.l.");
    pdf.setCreator("Schede Restauro 2.7");
    return new Blob([await pdf.save()], { type: "application/pdf" });
  }

  // app/js/export.js
  function isAppleMobile(nav = navigator) {
    return /iPhone|iPad|iPod/.test(nav.userAgent) || nav.platform === "MacIntel" && nav.maxTouchPoints > 1;
  }
  var zipLibrary;
  async function makeArchive(pdf, json, name) {
    if (!window.JSZip) {
      if (!zipLibrary)
        zipLibrary = new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "./vendor/jszip.min.js";
          script.async = true;
          const fail = () => {
            script.remove();
            zipLibrary = null;
            reject(Error("Pacchetto ZIP non disponibile."));
          };
          script.onload = () => window.JSZip ? resolve() : fail();
          script.onerror = fail;
          document.head.append(script);
        });
      await zipLibrary;
    }
    const zip = new window.JSZip();
    const [pdfBytes, jsonBytes] = await Promise.all([
      pdf.arrayBuffer(),
      json.arrayBuffer()
    ]);
    zip.file(name + ".pdf", new Uint8Array(pdfBytes));
    zip.file(name + ".json", new Uint8Array(jsonBytes));
    const bytes = await zip.generateAsync({
      type: "uint8array",
      compression: "STORE"
    });
    return new Blob([bytes], { type: "application/zip" });
  }
  var ExportFiles = class {
    constructor(root, notify2) {
      this.root = root;
      this.notify = notify2;
      this.generation = 0;
      this.urls = [];
      this.pdfLink = root.querySelector("#savePdf");
      this.jsonLink = root.querySelector("#saveJson");
      this.zipLink = root.querySelector("#savePackage");
      this.shareButton = root.querySelector("#sharePdf");
      this.help = root.querySelector("#exportHelp");
      this.shareButton.onclick = () => this.sharePdf();
    }
    clear() {
      this.generation++;
      this.root.hidden = true;
      this.pdfFile = null;
      for (const link of [this.pdfLink, this.jsonLink, this.zipLink]) {
        link.removeAttribute("href");
        link.removeAttribute("download");
      }
      for (const url of this.urls)
        setTimeout(() => URL.revokeObjectURL(url), 6e4);
      this.urls = [];
    }
    link(element, blob, name) {
      const url = URL.createObjectURL(blob);
      this.urls.push(url);
      element.href = url;
      element.download = name;
    }
    async prepare(pdf, json, name) {
      this.clear();
      const generation = this.generation;
      this.apple = isAppleMobile();
      let archive;
      if (this.apple) {
        try {
          archive = await makeArchive(pdf, json, name);
        } catch {
        }
      }
      if (generation !== this.generation) return false;
      this.link(this.pdfLink, pdf, name + ".pdf");
      this.link(this.jsonLink, json, name + ".json");
      if (archive) this.link(this.zipLink, archive, name + ".zip");
      this.zipLink.hidden = !archive;
      this.pdfFile = new File([pdf], name + ".pdf", { type: "application/pdf" });
      let canShare = false;
      try {
        canShare = this.apple && typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [this.pdfFile] });
      } catch {
      }
      this.shareButton.hidden = !canShare;
      this.help.textContent = this.apple ? archive ? "Lo ZIP contiene PDF e JSON: toccalo nell\u2019app File per estrarli. Puoi anche salvare i file separatamente." : "Salva PDF e JSON separatamente con i pulsanti qui sotto." : "Puoi salvare nuovamente PDF e JSON con questi pulsanti.";
      if (canShare)
        this.help.textContent += " Per il PDF puoi usare Condividi PDF \u2192 Salva su File.";
      this.root.hidden = false;
      return true;
    }
    download() {
      if (this.root.hidden) return;
      if (this.apple) {
        (this.zipLink.hidden ? this.pdfLink : this.zipLink).click();
      } else {
        this.pdfLink.click();
        this.jsonLink.click();
      }
    }
    async sharePdf() {
      if (!this.pdfFile || this.shareButton.disabled) return;
      this.shareButton.disabled = true;
      try {
        await navigator.share({ files: [this.pdfFile] });
      } catch (error) {
        if (error.name !== "AbortError")
          this.notify("Condivisione non disponibile. Usa il pulsante Salva PDF.");
      } finally {
        this.shareButton.disabled = false;
      }
    }
  };

  // app/js/home-title.js
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

  // app/js/app.js
  var $ = (id) => document.getElementById(id);
  var exportFiles = new ExportFiles($("exportReady"), notify);
  var escape = (value) => String(value ?? "").replace(
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
  var measureKeys = /* @__PURE__ */ new Set([
    "altitude",
    "distance",
    "height",
    "width",
    "depth"
  ]);
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
  function set(path, value) {
    const keys = path.split(".");
    if (keys.some((k) => ["__proto__", "prototype", "constructor"].includes(k)))
      throw Error("Campo non valido.");
    let target = state;
    for (const k of keys.slice(0, -1)) target = target[k];
    target[keys.at(-1)] = value;
  }
  function asset() {
    return assets.find((a) => a.id === (state == null ? void 0 : state.assetId));
  }
  function currentName() {
    return baseName(state, assets);
  }
  function syncFilename() {
    if (!state) return;
    if (document.activeElement !== $("filename"))
      $("filename").value = currentName();
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
      } catch {
        $("saveStatus").textContent = "Bozza non salvata";
        notify(
          "Salvataggio locale non riuscito. Mantieni aperta la scheda e salva PDF e JSON prima di uscire."
        );
      }
    });
    return saveChain;
  }
  function show(view) {
    for (const name of ["home", "editor"]) $(name).hidden = name !== view;
    $("options").open = false;
    window.scrollTo(0, 0);
    if (view === "editor") render();
  }
  function field(label, path, {
    type = "text",
    wide = false,
    multiline = false,
    fixed = false,
    value,
    unit = false
  } = {}) {
    const val = value ?? get(path);
    const read = fixed ? ' readonly aria-readonly="true"' : "";
    const common = `data-path="${escape(path)}"${read}${unit ? ' data-measure="true" inputmode="decimal"' : ""}`;
    const control = multiline ? `<textarea ${common} rows="3">${escape(val)}</textarea>` : `<input type="${type}" ${common} value="${escape(val)}"${unit ? ' placeholder="m"' : ""}>`;
    return `<label class="field${wide ? " wide" : ""}"><span>${escape(label)}${fixed ? ' <span aria-label="non modificabile">\u{1F512}</span>' : ""}${unit ? " <small>(m)</small>" : ""}</span>${control}</label>`;
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
    return `<button class="add-button" type="button" data-action="${action}" ${extra}>\uFF0B ${escape(label)}</button>`;
  }
  function repeatActions(addLabel, removeLabel, addAction, removeAction, count, extra = "") {
    return `<div class="repeat-actions">${addButton(addLabel, addAction, extra)}<button class="add-button" type="button" data-action="${removeAction}" data-index="${count - 1}" ${extra}${count ? "" : " disabled"} aria-label="${escape(removeLabel)}: ultimo elemento">\u2212 ${escape(removeLabel)}</button></div>`;
  }
  function riskField(label, path) {
    const value = get(path);
    return `<label class="field"><span>${escape(label)}</span><select data-path="${path}" class="risk-${String(value).toLowerCase().replace("basso", "low").replace("medio", "medium").replace("alto", "high")}"><option value="">\u2014</option>${RISKS.map((r) => `<option${r === value ? " selected" : ""}>${r}</option>`).join("")}</select></label>`;
  }
  function choices(label, path, values, multiple = false) {
    const value = get(path);
    return `<fieldset class="choice-group"><legend>${escape(label)}</legend><div class="choices">${values.map((v, i) => `<label><input type="${multiple ? "checkbox" : "radio"}" name="${path}" value="${escape(v)}" data-path="${path}"${multiple ? ' data-multiple="true"' : ""}${multiple ? Array.isArray(value) && value.includes(v) ? " checked" : "" : value === v ? " checked" : ""}>${escape(v)}</label>`).join("")}</div>${!multiple ? `<button type="button" class="clear-choice" data-action="clear-choice" data-path="${path}">Azzera scelta</button>` : ""}</fieldset>`;
  }
  function sharedHeader(datePath) {
    return `<div class="fields three shared-header">${field("ID scheda", "general.id")}${field("Data", datePath, { type: "date" })}${field("Oggetto", "general.object", { fixed: Object.hasOwn(asset().fixed || {}, "object") })}</div>`;
  }
  function mapHtml() {
    return `<aside class="map-panel"><h2>LOCALIZZAZIONE BENE</h2><p>\u{1F512} ${escape(asset().label)}</p><div class="map-frame"><img src="./assets/map.jpg" alt="Planimetria del percorso del Sacro Monte di Varese">${assets.map((a) => `<span class="map-check${a.id === state.assetId ? " selected" : ""}" role="checkbox" aria-checked="${a.id === state.assetId}" aria-disabled="true" aria-label="${escape(a.label)}" title="${escape(a.label)}" style="left:${a.x}%;top:${a.y}%">${a.id === state.assetId ? "\u2713" : ""}</span>`).join("")}</div></aside>`;
  }
  function firstSection() {
    const fixed = asset().fixed || {};
    const general = (label, key, options = {}) => field(label, "general." + key, {
      ...options,
      fixed: Object.hasOwn(fixed, key)
    });
    return `<div class="first-layout"><div><h1>SCHEDA DI ISPEZIONE PERIODICA</h1><div class="fields">${field("ID scheda", "general.id", { wide: true })}${field("Data", "general.date", { type: "date" })}${field("Ora", "general.time", { type: "time" })}</div>
  ${band("1. IDENTIFICAZIONE DEL BENE")}<div class="fields">${general("Oggetto", "object", { wide: true })}${general("Cronologia", "chronology")}${general("Autore", "author")}${general("Quota s.l.m.", "altitude", { unit: true })}${general("Distanza dal Santuario", "distance", { unit: true })}${fixedField("Complesso", COMMON.complex)}${fixedField("Ente proprietario", COMMON.owner)}</div>
  ${band("2. SOGGETTO E DATI TECNICO-DIMENSIONALI")}<div class="fields">${general("Soggetto", "subject", { wide: true })}</div><div class="fields three wide-note">${general("Altezza H", "height", { unit: true })}${general("Larghezza L", "width", { unit: true })}${general("Profondit\xE0 P", "depth", { unit: true })}</div><div class="wide-note">${general("Materie e Tecniche", "materials", { multiline: true })}</div></div>${mapHtml()}</div>`;
  }
  function historyCards(key, title) {
    return `${band(title)}${state.history[key].map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>${escape(title)} \xB7 ${i + 1}</h3></div><div class="fields">${field("Mese e anno", `history.${key}.${i}.date`, { type: "month" })}${field("Azione", `history.${key}.${i}.action`, { multiline: true, wide: true })}</div></article>`).join("")}${repeatActions("Aggiungi intervento", "Rimuovi intervento", "add-history", "remove-history", state.history[key].length, `data-key="${key}"`)}`;
  }
  function historySection() {
    return `<h1>Storico e stato conservativo</h1>${band("3. STORICO MANUTENTIVO")}${historyCards("restorations", "Interventi di RESTAURO precedenti")}${historyCards("maintenance", "Interventi di MANUTENZIONE precedenti")}${band("4. STATO CONSERVATIVO ATTUALE")}${state.conditions.map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>Stato conservativo \xB7 ${i + 1}</h3></div>${field("Esposizione", `conditions.${i}.exposure`)}${choices("Metodologia Ispezione", `conditions.${i}.methods`, METHODS, true)}${field("Valutazione sintetica", `conditions.${i}.assessment`, { multiline: true })}</article>`).join("")}${repeatActions("Aggiungi stato conservativo", "Rimuovi stato conservativo", "add-condition", "remove-condition", state.conditions.length)}`;
  }
  var diagnosisHeaders = [
    "Macro-Area",
    "Elemento",
    "Patologia riscontrata",
    "Cause principali",
    "Livello di rischio",
    "Risolto in data"
  ];
  function diagnosisSection() {
    return `<h1>Diagnostica e priorit\xE0</h1>${band("5. DIAGNOSTICA DEL DEGRADO E PRIORIT\xC0 DI INTERVENTO")}<div class="table-wrap"><table class="diagnosis-table" role="table"><thead role="rowgroup"><tr role="row">${diagnosisHeaders.map((h) => `<th role="columnheader" scope="col">${h}</th>`).join("")}</tr></thead><tbody role="rowgroup">${state.diagnosis.map((r, i) => `<tr role="row">${["area", "element", "pathology", "causes"].map((k, j) => `<td role="cell">${field(diagnosisHeaders[j], `diagnosis.${i}.${k}`, { multiline: true })}</td>`).join("")}<td role="cell">${riskField("Livello di rischio", `diagnosis.${i}.risk`)}</td><td role="cell">${field("Risolto in data", `diagnosis.${i}.resolvedDate`, { type: "date" })}</td></tr>`).join("")}</tbody></table></div>${repeatActions("Aggiungi riga", "Rimuovi riga", "add-diagnosis", "remove-diagnosis", state.diagnosis.length)}${band("INDICE DI PRIORIT\xC0 E TEMPISTICHE DI INTERVENTO")}${state.priorities.map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>Priorit\xE0 \xB7 ${i + 1}</h3></div>${riskField("Grado d\u2019urgenza", `priorities.${i}.risk`)}${choices("Finestra d\u2019intervento programmata", `priorities.${i}.window`, WINDOWS)}${field("Anomalie attese", `priorities.${i}.anomalies`, { multiline: true })}</article>`).join("")}${repeatActions("Aggiungi priorit\xE0", "Rimuovi priorit\xE0", "add-priority", "remove-priority", state.priorities.length)}<div class="wide-note">${field("Note aggiuntive", "inspectionNotes", { multiline: true })}</div>`;
  }
  function photosSection() {
    return `<h1>Atlante fotografico</h1>${band("6. ATLANTE FOTOGRAFICO")}<div class="photo-actions"><button type="button" data-action="camera" class="primary">Scatta foto</button><button type="button" data-action="photos">Carica foto</button></div><div class="photo-grid">${state.photos.map((p, i) => `<article class="photo-card"><img src="${escape(p.data)}" alt="Fotografia ${i + 1}"><div><span>Foto ${i + 1}</span>${removeButton("remove-photo", i)}</div></article>`).join("")}</div>${!state.photos.length ? '<p class="empty">Aggiungi le fotografie del sopralluogo.</p>' : ""}`;
  }
  function immediateSection() {
    return `<h1>Registro interventi di manutenzione immediata</h1>${sharedHeader("immediate.date")}${field("Eseguiti in data", "immediate.executedDate", { type: "date" })}${band("INTERVENTI ESEGUITI")}${state.immediate.records.map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>Intervento \xB7 ${i + 1}</h3></div><div class="fields">${field("Macro-Area", `immediate.records.${i}.area`, { wide: true })}${field("Azioni condotte in loco", `immediate.records.${i}.action`, { wide: true, multiline: true })}</div></article>`).join("")}${repeatActions("Aggiungi intervento", "Rimuovi intervento", "add-immediate", "remove-immediate", state.immediate.records.length)}<div class="wide-note">${field("Note aggiuntive", "immediate.notes", { multiline: true })}</div>`;
  }
  function preventiveSection() {
    return `<h1>Programmazione azioni preventive</h1>${sharedHeader("preventive.date")}${band("AZIONI PREVENTIVE")}<div class="table-wrap"><table><thead><tr><th>Riga</th><th>Macro-Area</th><th>Elemento</th><th>Patologia riscontrata</th></tr></thead><tbody>${state.diagnosis.map((r, i) => `<tr><td>${i + 1}</td><td>${escape(r.area)}</td><td>${escape(r.element)}</td><td>${escape(r.pathology)}</td></tr>`).join("")}</tbody></table></div>${state.diagnosis.map((r, i) => `<div class="record-context"><strong>Riga ${i + 1}</strong> \xB7 ${escape(r.area || "Macro-Area non compilata")}<br>${escape(r.element)}${r.element && r.pathology ? " \xB7 " : ""}${escape(r.pathology)}</div>${r.actions.map((a, j) => `<article class="repeat-card"><div class="card-top"><h3>Azione preventiva ${i + 1}.${j + 1}</h3>${removeButton("remove-preventive", j, `data-row="${i}"`)}</div>${riskField("Grado d\u2019urgenza", `diagnosis.${i}.actions.${j}.risk`)}${choices("Finestra d\u2019intervento", `diagnosis.${i}.actions.${j}.window`, WINDOWS)}<div class="fields">${field("Descrizione", `diagnosis.${i}.actions.${j}.description`, { wide: true, multiline: true })}${field("Azione", `diagnosis.${i}.actions.${j}.action`, { wide: true, multiline: true })}${field("Obiettivo", `diagnosis.${i}.actions.${j}.objective`, { wide: true, multiline: true })}${field("Operatore", `diagnosis.${i}.actions.${j}.operator`, { wide: true })}</div>${choices("Qualifica operatore", `diagnosis.${i}.actions.${j}.role`, ROLES)}${choices("Stato", `diagnosis.${i}.actions.${j}.status`, STATUSES)}</article>`).join("")}${addButton("Aggiungi azione per la riga " + (i + 1), "add-preventive", `data-row="${i}"`)}`).join("")}${!state.diagnosis.length ? '<p class="empty">Aggiungi una riga nella sezione Diagnostica e priorit\xE0 per associarle azioni preventive.</p>' : ""}<div class="wide-note">${field("Note aggiuntive", "preventive.notes", { multiline: true })}</div>`;
  }
  function render() {
    const renderer = [
      firstSection,
      historySection,
      diagnosisSection,
      photosSection,
      immediateSection,
      preventiveSection
    ][state.section];
    $("sectionContent").innerHTML = renderer();
    syncFilename();
    $("sectionCounter").textContent = `Sezione ${state.section + 1} di ${SECTIONS.length}`;
    $("previous").textContent = state.section ? "\u2190 " + SECTIONS[state.section - 1] : "\u2302 Home";
    $("next").textContent = state.section === SECTIONS.length - 1 ? "Salva PDF e esporta JSON" : SECTIONS[state.section + 1] + " \u2192";
    $("next").disabled = busy;
  }
  function navigate(direction) {
    if (direction < 0 && state.section === 0) {
      persist();
      show("home");
      return;
    }
    state.section += direction;
    changed();
    render();
    window.scrollTo(0, 0);
    $("sectionContent").focus({ preventScroll: true });
  }
  $("sectionContent").addEventListener("input", (event) => {
    const el = event.target;
    if (!el.matches("[data-path]") || el.readOnly || ["radio", "checkbox"].includes(el.type))
      return;
    set(el.dataset.path, el.value);
    el.setCustomValidity("");
    changed();
  });
  $("sectionContent").addEventListener("change", (event) => {
    const el = event.target;
    if (!el.matches("[data-path]") || el.readOnly) return;
    if (el.dataset.measure) {
      try {
        el.value = formatMeasure(el.value);
        el.setCustomValidity("");
        set(el.dataset.path, el.value);
      } catch (error) {
        el.setCustomValidity(error.message);
        el.reportValidity();
        return;
      }
    } else if (el.dataset.multiple) {
      const list = get(el.dataset.path);
      set(
        el.dataset.path,
        el.checked ? [.../* @__PURE__ */ new Set([...list, el.value])] : list.filter((v) => v !== el.value)
      );
    } else if (el.type === "radio") {
      if (el.checked) set(el.dataset.path, el.value);
    } else set(el.dataset.path, el.value);
    if (el.tagName === "SELECT") {
      el.className = "risk-" + ({ BASSO: "low", MEDIO: "medium", ALTO: "high" }[el.value] || "");
    }
    changed();
  });
  $("sectionContent").addEventListener("click", (event) => {
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
    if (action.startsWith("remove-")) {
      const hasActions = action === "remove-diagnosis" && state.diagnosis[i].actions.length;
      if (!confirm(
        hasActions ? "Eliminare questa riga e tutte le azioni preventive collegate?" : "Rimuovere questo elemento e i dati contenuti?"
      ))
        return;
    }
    switch (action) {
      case "add-history":
        state.history[key].push(historyRecord());
        break;
      case "remove-history":
        state.history[key].splice(i, 1);
        break;
      case "add-condition":
        state.conditions.push(conditionRecord());
        break;
      case "remove-condition":
        state.conditions.splice(i, 1);
        break;
      case "add-diagnosis":
        state.diagnosis.push(diagnosisRecord());
        break;
      case "remove-diagnosis":
        state.diagnosis.splice(i, 1);
        break;
      case "add-priority":
        state.priorities.push(priorityRecord());
        break;
      case "remove-priority":
        state.priorities.splice(i, 1);
        break;
      case "remove-photo":
        state.photos.splice(i, 1);
        break;
      case "add-immediate":
        state.immediate.records.push(immediateRecord());
        break;
      case "remove-immediate":
        state.immediate.records.splice(i, 1);
        break;
      case "add-preventive":
        state.diagnosis[Number(row)].actions.push(preventiveRecord());
        break;
      case "remove-preventive":
        state.diagnosis[Number(row)].actions.splice(i, 1);
        break;
      case "clear-choice":
        set(button.dataset.path, "");
        break;
      default:
        return;
    }
    changed();
    render();
  });
  $("filename").addEventListener("input", () => {
    state.filename = $("filename").value;
    state.customFilename = !!state.filename.trim();
    changed();
  });
  $("filename").addEventListener("blur", () => {
    state.filename = currentName();
    syncFilename();
  });
  $("previous").onclick = () => navigate(-1);
  $("next").onclick = () => state.section === SECTIONS.length - 1 ? exportFinal() : navigate(1);
  $("goHome").onclick = () => {
    persist();
    show("home");
  };
  $("newButton").onclick = () => $("newDialog").showModal();
  $("newForm").onsubmit = async (event) => {
    event.preventDefault();
    if (draftAvailable && !confirm(
      "Creare una nuova scheda sostituendo la bozza corrente? Salva prima PDF e JSON se vuoi conservarla."
    ))
      return;
    clearTimeout(saveTimer);
    await saveChain;
    state = applyFixed(newState($("assetSelect").value), assets);
    $("newDialog").close();
    changed();
    show("editor");
  };
  $("resumeButton").onclick = () => show("editor");
  $("resetButton").onclick = async () => {
    if (busy) {
      notify("Attendi il completamento del salvataggio.");
      return;
    }
    if (!confirm(
      "Cancellare tutti i dati e le fotografie della bozza? I PDF gi\xE0 archiviati resteranno disponibili."
    ))
      return;
    clearTimeout(saveTimer);
    await saveChain;
    try {
      if (storageReady) await removeDraft();
      localStorage.removeItem("restauro-v3-fallback");
      state = null;
      draftAvailable = false;
      revision = savedRevision = 0;
      $("resumeButton").disabled = true;
      show("home");
      notify("Bozza cancellata.");
    } catch (error) {
      notify("Reset non riuscito: " + error.message);
    }
  };
  for (const button of document.querySelectorAll("[data-close]"))
    button.onclick = () => $(button.dataset.close).close();
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#options")) $("options").open = false;
  });
  async function insertPhotos(files2) {
    let failures = 0;
    for (const file of files2) {
      let url;
      try {
        url = URL.createObjectURL(file);
        const image = new Image();
        image.src = url;
        await image.decode();
        if (!image.naturalWidth || !image.naturalHeight)
          throw Error("Immagine non leggibile");
        const scale = Math.min(
          1,
          2400 / Math.max(image.naturalWidth, image.naturalHeight)
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        const context = canvas.getContext("2d");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        state.photos.push({
          id: uid(),
          data: canvas.toDataURL("image/jpeg", 0.9),
          width: canvas.width,
          height: canvas.height
        });
      } catch {
        failures++;
      } finally {
        if (url) URL.revokeObjectURL(url);
      }
    }
    changed();
    render();
    await persist();
    if (failures)
      notify(
        `${failures} immagini non leggibili. Convertile in JPEG o PNG e riprova.`
      );
  }
  for (const id of ["photoInput", "cameraInput"])
    $(id).onchange = async (event) => {
      await insertPhotos([...event.target.files]);
      event.target.value = "";
    };
  $("importButton").onclick = () => $("jsonInput").click();
  $("jsonInput").onchange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      const raw = JSON.parse(await file.text());
      const next = parseState(
        raw.version === 3 ? await migrateLegacy(raw, assets) : raw,
        assets
      );
      if (draftAvailable && !confirm("Sostituire la bozza corrente con quella importata?"))
        return;
      clearTimeout(saveTimer);
      await saveChain;
      state = next;
      changed();
      show("editor");
      await persist();
      notify("Scheda importata, fotografie comprese.");
    } catch (error) {
      showMessage("Importazione non riuscita", error.message);
    } finally {
      event.target.value = "";
    }
  };
  async function exportFinal() {
    if (busy) return;
    try {
      for (const k of measureKeys)
        state.general[k] = formatMeasure(state.general[k]);
      parseState(state, assets);
    } catch (error) {
      showMessage("Controlla i dati", error.message);
      return;
    }
    busy = true;
    $("next").disabled = true;
    $("next").textContent = "Generazione dei file\u2026";
    exportFiles.clear();
    const version = revision;
    try {
      await persist();
      const snapshot = structuredClone(state);
      const pdf = await makePdf(snapshot, assets);
      const json = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json"
      });
      const name = baseName(snapshot, assets);
      if (version !== revision) {
        notify(
          "La scheda \xE8 stata modificata durante la generazione. Premi nuovamente Salva PDF e JSON."
        );
        return;
      }
      if (await exportFiles.prepare(pdf, json, name)) exportFiles.download();
    } catch (error) {
      showMessage("Esportazione non riuscita", error.message);
    } finally {
      busy = false;
      render();
    }
  }
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
    const ordered = [...assets].sort((a, b) => {
      const rank = (x) => x.kind === "arch" ? { 1: 0.5, 2: 5.5, 3: 10.5 }[x.number] : x.number;
      return rank(a) - rank(b);
    });
    for (const item of ordered) {
      const option = document.createElement("option");
      option.textContent = item.label;
      option.value = item.id;
      $("assetSelect").append(option);
    }
    $("newButton").disabled = false;
    $("importButton").disabled = false;
    window.RestauroAppReady = true;
    const startRevision = revision;
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
      notify("Bozza locale non disponibile: " + error.message);
    }
  }
  init().catch((error) => showMessage("Avvio non riuscito", error.message));
  initHomeTitle();
})();
