/* Schede Restauro 3.4.3 — generato dai sorgenti modulari in js/. */
(() => {
  // recovered-smv/js/road.js
  var ROAD_SIZE = { width: 654, height: 1190 };
  var ROAD_POINTS = [
    [398, 981],
    [406, 959],
    [415, 935],
    [429, 901],
    [445, 862],
    [460, 824],
    [478, 781],
    [491, 751],
    [501, 736],
    [508, 734],
    [518, 739],
    [532, 756],
    [547, 771],
    [564, 781],
    [576, 783],
    [583, 779],
    [586, 770],
    [585, 750],
    [580, 715],
    [574, 678],
    [568, 645],
    [564, 627],
    [560, 620],
    [552, 619],
    [534, 625],
    [510, 636],
    [496, 649],
    [482, 674],
    [470, 688],
    [455, 696],
    [437, 700],
    [407, 702],
    [369, 702],
    [335, 702],
    [318, 701],
    [311, 696],
    [308, 688],
    [311, 666],
    [316, 636],
    [320, 607],
    [323, 581],
    [322, 562],
    [317, 543],
    [310, 524],
    [309, 514],
    [314, 500],
    [318, 487],
    [315, 470],
    [310, 453],
    [309, 440],
    [311, 430],
    [316, 425],
    [325, 424],
    [334, 426],
    [343, 433],
    [351, 446],
    [359, 465],
    [369, 492],
    [379, 522],
    [387, 548],
    [393, 563],
    [399, 570],
    [405, 572],
    [410, 570],
    [413, 563],
    [414, 549],
    [413, 527],
    [411, 502],
    [409, 478],
    [407, 451],
    [404, 423],
    [401, 405],
    [397, 392],
    [391, 383],
    [380, 378],
    [372, 374],
    [366, 364],
    [357, 343],
    [347, 323],
    [336, 303],
    [325, 285],
    [315, 269],
    [305, 251],
    [298, 236],
    [292, 219],
    [286, 198],
    [277, 174],
    [269, 150],
    [260, 124],
    [250, 104],
    [239, 89],
    [233, 76],
    [231, 64],
    [232, 51],
    [238, 36],
    [240, 25],
    [236, 15],
    [231, 7]
  ];
  var ROAD_SVG_POINTS = ROAD_POINTS.map((point) => point.join(",")).join(
    " "
  );

  // recovered-smv/js/model.js
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
      date: r.resolvedDate,
      action: r.resolvedAction || ""
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
    resolvedAction: "",
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
        object: assetId === "strada" ? "Strada" : "",
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
    const name = (asset2 == null ? void 0 : asset2.kind) === "road" ? "Strada" : (asset2 == null ? void 0 : asset2.kind) === "arch" ? `Arco_${String(asset2.number).padStart(2, "0")}` : `Cappella_${String((asset2 == null ? void 0 : asset2.number) || "").padStart(2, "0")}`;
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
      "resolvedDate",
      "resolvedAction"
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
        a.window = choice(a.window, [...WINDOWS, ...HIGH_WINDOWS]);
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
      r.window = choice(r.window, [...WINDOWS, ...HIGH_WINDOWS]);
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

  // recovered-smv/js/storage.js
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

  // recovered-smv/js/catalog.js
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
    },
    {
      "id": "strada",
      "label": "Strada",
      "kind": "road",
      "fixed": {}
    }
  ];

  // recovered-smv/js/legacy.js
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

  // recovered-smv/js/config.js
  var VERSION = "3.4.3";
  var PWA_URL = "https://alessandromandelli.github.io/SMV/";

  // recovered-smv/js/pdf-layout.js
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
  var clean = (value) => String(value ?? "").normalize("NFC").replace(/\r\n?/g, "\n").replace(/\t/g, "    ");
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
    constructor(pdf, api, fonts, images, state2) {
      Object.assign(this, { pdf, api, fonts, images, state: state2 });
      this.brandedPages = /* @__PURE__ */ new Set();
      this.characters = new Map(
        Object.values(fonts).map((font) => [
          font,
          new Set(font.getCharacterSet())
        ])
      );
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
        (total, char) => total + this.font(char, bold).widthOfTextAtSize(char, size),
        0
      );
    }
    text(page, value, x, top, { size = TYPE.body, bold = false, color = COLORS.ink } = {}) {
      const valueText = clean(value);
      if (!hasText(valueText)) return;
      let run2 = "", font = null, at = x;
      const flush = () => {
        if (!run2) return;
        if (hasText(run2))
          page.drawText(run2, {
            x: at,
            y: PAGE.height - top - size * 0.905,
            size,
            font,
            color: this.color(color)
          });
        at += font.widthOfTextAtSize(run2, size);
        run2 = "";
      };
      for (const char of valueText) {
        if (char === "\n") continue;
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
    label(page, label2, value, x, top, width, { bold = true, size = TYPE.body, minHeight = 12.5 } = {}) {
      const valueX = x + this.width(label2, size, bold) + 5;
      const lines = this.wrap(value, Math.max(25, width - (valueX - x)), size);
      this.text(page, label2, x, top, { bold, size });
      lines.forEach(
        (line, i) => this.text(page, line, valueX, top + i * TYPE.leading, { size })
      );
      return Math.max(minHeight, lines.length * TYPE.leading);
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
        ["Data:", displayDate(meta.date)]
      ]) {
        const height = Math.max(
          14.5,
          this.wrap(value, 300).length * TYPE.leading + 3
        );
        this.rect(page, x - 1, y - 2, 356.6, height, {
          fill: "#d9d9d9"
        });
        this.label(page, label2, value, x, y, 346.6, { minHeight: height });
        y += height;
      }
      y = Math.max(102.3, y + 12);
      y += this.label(
        page,
        "Oggetto:",
        this.state.general.object,
        x,
        y,
        PAGE.width - PAGE.margin - x
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
      if (!continuation && ["first", "immediate", "preventive"].includes(kind))
        this.brandedPages.add(page);
      const y = !continuation && ["immediate", "preventive"].includes(kind) ? this.header(page, kind, meta) : PAGE.margin;
      return { page, y };
    }
    finish() {
      const pages = this.pdf.getPages();
      const footer = "Via Matteotti 8, 21030 Castello Cabiaglio (VA) \u2013 C.F./P.IVA 02507710396 \u2013 info@cromorestauri.com \u2013 PEC \u2013 cromorestauri@sicurezzapostale.it";
      pages.forEach((page, i) => {
        if (this.brandedPages.has(page)) {
          this.image(page, this.images.footer, PAGE.margin, 563, 113.5, 34.9);
          this.text(page, "s.c.ar.l.", PAGE.margin + 120, 583, {
            size: 11,
            color: "#d8a30a"
          });
          let size = 7.5;
          while (this.width(footer, size) > BODY_WIDTH - 166 && size > 5.5)
            size -= 0.25;
          this.text(page, footer, PAGE.margin + 166, 586, { size });
        }
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
    paragraphHeight(label2, value, { size = TYPE.body, labelSize = size, indent = 0, boldLabel = true } = {}) {
      const start = label2 ? this.report.width(label2, labelSize, boldLabel) + 5 : 0;
      return this.report.wrap(value, this.width - indent - start, size).length * (Math.max(size, labelSize) * 1.2) + 6;
    }
    paragraph(label2, value, {
      showEmpty = false,
      size = TYPE.body,
      labelSize = size,
      indent = 0,
      boldLabel = true,
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
        size
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
            { size, color }
          )
        );
        const taken = Math.min(count, lines.length - offset);
        this.y += taken * leading;
        offset += taken;
        if (offset < lines.length) this.next();
      }
      this.y += after;
    }
    box(label2, value, { fill = COLORS.notes, minHeight = 40 } = {}) {
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
            this.x + 8,
            this.y + 19 + i * TYPE.leading
          )
        );
        this.y += height + 12;
        offset += taken;
        if (offset < lines.length) this.next();
      }
    }
    table(headers, rows, proportions, { riskColumn = -1 } = {}) {
      if (!rows.length) return;
      const total = proportions.reduce((a, b) => a + b, 0);
      const widths = proportions.map((w) => w / total * this.width);
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
      this.ensure(headerHeight + 20);
      header();
      const next = () => {
        this.next();
        header();
      };
      rows.forEach((row, index) => {
        const cells = row.map(
          (value, i) => this.report.wrap(value, widths[i] - 8)
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
              fill: index % 2 ? COLORS.alternate : "#ffffff",
              border: COLORS.border
            });
            const fragment = offset > 0 && lines.length <= offset ? lines : lines.slice(offset, offset + count);
            fragment.slice(0, count).forEach(
              (line, j) => this.report.text(
                this.page,
                line,
                xs[i] + 4,
                this.y + 4 + j * TYPE.leading,
                { color: i === riskColumn ? riskColor(row[i]) : COLORS.ink }
              )
            );
          });
          this.y += height;
          offset += count;
          if (offset < lineCount) next();
        }
      });
      this.y += 12;
    }
  };

  // recovered-smv/js/pdf.js
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
  var diagnosisHasContent = (row) => [
    row.area,
    row.element,
    row.pathology,
    row.causes,
    row.risk,
    row.resolvedDate
  ].some(hasText);
  var actionHasContent = (action) => Object.entries(action).some(([key, value]) => key !== "id" && hasText(value));
  function identification(report, state2, assets2) {
    const { page } = report.page("first");
    const left = PAGE.margin, columnWidth = 371.2, textX = left + 92;
    report.image(page, report.images.anniversary, left, 55.1, 70.6, 15);
    report.image(page, report.images.logo, left, 84.55, 70.6, 108.5);
    report.text(page, "SCHEDA DI ISPEZIONE PERIODICA", textX, 48.2, {
      size: 13,
      bold: true,
      color: COLORS.green
    });
    let headerY = 86.6;
    for (const [label2, value] of [
      ["ID Scheda:", state2.general.id],
      ["Data:", displayDate(state2.general.date)],
      ["Ora:", state2.general.time]
    ]) {
      const height = Math.max(
        14.5,
        report.wrap(value, 220).length * TYPE.leading + 3
      );
      report.rect(page, textX - 1, headerY - 2, 271.2, height, {
        fill: "#d9d9d9"
      });
      report.label(page, label2, value, textX, headerY, 266.2, {
        minHeight: height
      });
      headerY += height;
    }
    headerY = Math.max(144.6, headerY + 14);
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
    const top = Math.max(225.5, headerY + 20);
    report.band(page, "1. IDENTIFICAZIONE DEL BENE", top, left, columnWidth);
    const flow = new Flow(
      report,
      "inspection",
      {},
      { page, x: left, width: columnWidth, y: top + 30, firstColumn: true }
    );
    const fields = [
      ["Oggetto:", state2.general.object],
      ["Cronologia:", state2.general.chronology],
      ["Autore:", state2.general.author]
    ];
    fields.forEach(
      ([label2, value]) => flow.paragraph(label2, value, { showEmpty: true })
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
    flow.paragraph("Complesso:", COMMON.complex, { showEmpty: true });
    flow.paragraph("Ente Proprietario:", COMMON.owner, { showEmpty: true });
    flow.y = Math.max(flow.firstColumn ? 376 : flow.y + 8, flow.y + 12);
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
      39.6,
      { size: 11, bold: true, color: COLORS.green }
    );
    const map = {
      x: frame.x + (frame.width - 254.15) / 2,
      top: 63.2,
      width: 254.15,
      height: 462.9
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
    assets2.filter((a) => a.kind !== "road").forEach(
      (asset2) => report.checkbox(
        page,
        map.x + asset2.x / 100 * map.width - 4,
        map.top + asset2.y / 100 * map.height - 4,
        "",
        asset2.id === state2.assetId,
        { size: 8 }
      )
    );
  }
  function historyAndCondition(flow, state2) {
    flow.section(HISTORY_TITLE, 18);
    for (const [key, title] of [
      ["restorations", "Interventi di RESTAURO precedenti"],
      ["maintenance", "Interventi di MANUTENZIONE precedenti"]
    ]) {
      for (const row of state2.history[key].filter(
        (r) => [r.date, r.action].some(hasText)
      )) {
        const height = 18 + (hasText(row.date) ? flow.paragraphHeight("Data:", row.date) : 0) + (hasText(row.action) ? flow.paragraphHeight("Azione:", row.action) : 0) + 8;
        flow.ensure(Math.min(height, flow.freshHeight()));
        flow.report.text(flow.page, title, flow.x, flow.y, { bold: true });
        flow.y += 18;
        flow.paragraph("Data:", row.date);
        flow.paragraph("Azione:", row.action);
        flow.y += 8;
      }
    }
    flow.section(CONDITION_TITLE, 18);
    for (const row of state2.conditions.filter(
      (r) => [r.exposure, r.assessment].some(hasText) || r.methods.length
    )) {
      const height = flow.paragraphHeight("Esposizione:", row.exposure) + flow.paragraphHeight("Valutazione Sintetica:", row.assessment) + (row.methods.length ? 22 : 0);
      flow.ensure(Math.min(height, flow.freshHeight()));
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
      r.area,
      r.element,
      r.pathology,
      r.causes,
      r.risk,
      displayDate(r.resolvedDate)
    ]);
    const weights = [2381, 2381, 2955, 3118, 1843, 1608];
    const total = weights.reduce((a, b) => a + b, 0);
    const firstHeight = rows.length ? Math.max(
      ...rows[0].map(
        (value, i) => flow.report.wrap(value, weights[i] / total * flow.width - 8).length
      )
    ) * TYPE.leading + 8 : 0;
    flow.section(
      DIAGNOSIS_TITLE,
      rows.length ? 20 + Math.min(firstHeight, flow.freshHeight() - 52) : 0
    );
    flow.table(
      [
        "Macro-Area",
        "Elemento",
        "Patologia Riscontrata",
        "Cause Principali",
        "Livello di Rischio",
        "Risolto in data"
      ],
      rows,
      [2381, 2381, 2955, 3118, 1843, 1608],
      { riskColumn: 4 }
    );
  }
  function priorities(flow, state2) {
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
          "INDICE DI PRIORIT\xC0 E TEMPISTICHE DI INTERVENTO",
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
    flow.box("Note aggiuntive:", state2.inspectionNotes, { minHeight: 60 });
  }
  async function photographs(flow, state2) {
    if (!state2.photos.length) {
      flow.section(PHOTO_TITLE);
      return;
    }
    const r = flow.report, gap = 12, width = (BODY_WIDTH - gap) / 2, height = (PAGE.bottom - 65 - gap) / 2;
    for (let i = 0; i < state2.photos.length; i++) {
      if (i % 4 === 0) {
        flow.next();
        if (i === 0) flow.section(PHOTO_TITLE);
      }
      const photo = state2.photos[i];
      const bytes2 = photo.data.split(",")[1];
      const image = photo.data.startsWith("data:image/png") ? await r.pdf.embedPng(bytes2) : photo.data.startsWith("data:image/jpeg") ? await r.pdf.embedJpg(bytes2) : null;
      if (!image)
        throw Error("Le fotografie per il PDF devono essere JPEG o PNG.");
      const slot = i % 4, x = PAGE.margin + slot % 2 * (width + gap), top = 65 + Math.floor(slot / 2) * (height + gap);
      const scale = Math.min(width / image.width, height / image.height);
      r.image(
        flow.page,
        image,
        x + (width - image.width * scale) / 2,
        top + (height - image.height * scale) / 2,
        image.width * scale,
        image.height * scale
      );
    }
  }
  function immediate(report, state2) {
    const rows = immediateRows(state2).filter(
      (r) => [r.area, r.action, r.date].some(hasText)
    );
    const flow = new Flow(report, "immediate", {
      date: state2.immediate.date
    });
    flow.section(IMMEDIATE_TITLE, rows.length ? 20 : 0);
    rows.forEach((row) => {
      const date = displayDate(row.date || state2.immediate.executedDate);
      const contextHeight = (hasText(date) ? flow.paragraphHeight("Eseguito in data:", date) : 0) + (hasText(row.area) ? flow.paragraphHeight("Macro-Area:", row.area) : 0);
      const height = contextHeight + (hasText(row.action) ? flow.paragraphHeight("Azioni condotte in loco:", row.action) : 0) + 12;
      const keepTogether = height <= flow.freshHeight();
      flow.ensure(keepTogether ? height : 18);
      flow.paragraph("Eseguito in data:", date, { keepTogether });
      flow.paragraph("Macro-Area:", row.area, { keepTogether });
      flow.paragraph("Azioni condotte in loco:", row.action, { keepTogether });
      flow.y += 12;
    });
    flow.box("Note aggiuntive:", state2.immediate.notes, {
      minHeight: 80
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
        flow.page.drawCircle({
          x: flow.x + 56,
          y: PAGE.height - flow.y - 5,
          size: 1.8,
          borderColor: r.color(COLORS.ink),
          borderWidth: 0.6
        });
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
    const rows = state2.diagnosis.filter(
      (row) => !row.resolvedDate && ([row.area, row.element, row.pathology].some(hasText) || row.actions.some(actionHasContent))
    );
    const flow = new Flow(report, "preventive", { date: state2.preventive.date });
    flow.section(PREVENTIVE_TITLE, rows.length ? 40 : 0);
    rows.forEach((row, index) => {
      const actions = row.actions.filter(actionHasContent);
      const values = [row.area, row.element, row.pathology];
      const weights = [4461, 4461, 5538], sum = 14460;
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
      if (values.some(hasText))
        flow.table(
          ["Macro-Area", "Elemento", "Patologia Riscontrata"],
          [values],
          weights
        );
      actions.forEach((action) => actionPackage(flow, action));
      flow.y += 8;
    });
    flow.box("Note aggiuntive:", state2.preventive.notes, {
      minHeight: 80
    });
  }
  async function makePdf(state2, assets2) {
    await libraries();
    const api = window.PDFLib, pdf = await api.PDFDocument.create();
    pdf.registerFontkit(window.fontkit);
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
    const report = new PdfReport(pdf, api, fonts, images, state2);
    identification(report, state2, assets2);
    const inspection = new Flow(report);
    historyAndCondition(inspection, state2);
    diagnostics(inspection, state2);
    priorities(inspection, state2);
    await photographs(inspection, state2);
    immediate(report, state2);
    preventive(report, state2);
    report.finish();
    pdf.setTitle(baseName(state2, assets2));
    pdf.setAuthor(COMMON.company);
    pdf.setCreator("Schede Restauro " + VERSION);
    return new Blob([await pdf.save()], { type: "application/pdf" });
  }

  // recovered-smv/js/zip.js
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

  // recovered-smv/js/docx.js
  var MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  var WIDTH = 14688;
  var XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  var NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  var esc = (value) => String(value ?? "").normalize("NFC").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
  var filled = (value) => String(value ?? "").trim().length > 0;
  var any = (row, keys) => keys.some((key) => filled(row[key]));
  var actionFilled = (action) => Object.entries(action).some(([key, value]) => key !== "id" && filled(value));
  function run(value, { bold = false, size = 19, color = "1E3232", font = "Arial" } = {}) {
    const text = String(value ?? "").replace(/\r\n?/g, "\n").split("\n").map(esc).join('</w:t><w:br/><w:t xml:space="preserve">');
    return `<w:r><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:eastAsia="${font}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/><w:color w:val="${color}"/>${bold ? "<w:b/>" : ""}</w:rPr><w:t xml:space="preserve">${text}</w:t></w:r>`;
  }
  function para(content = "", { keep = false, after = 90, before = 0, align = "left", shade, bullet = -1, style, separator = false } = {}) {
    const imageHeight = content.match(/<wp:extent[^>]*cy="(\d+)"/);
    const spacing = imageHeight ? `w:line="${Math.ceil(Number(imageHeight[1]) / 12700 * 20 + 40)}" w:lineRule="atLeast"` : 'w:line="228" w:lineRule="auto"';
    return `<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ""}${keep ? "<w:keepNext/>" : ""}<w:widowControl/><w:spacing w:before="${before}" w:after="${after}" ${spacing}/><w:jc w:val="${align}"/>${separator ? '<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="0" w:color="FFFFFF"/></w:pBdr>' : ""}${shade ? `<w:shd w:fill="${shade}"/>` : ""}${bullet >= 0 ? `<w:numPr><w:ilvl w:val="${bullet}"/><w:numId w:val="1"/></w:numPr>` : ""}</w:pPr>${content}</w:p>`;
  }
  var blank = () => para("", { after: 0 });
  var pageBreak = () => '<w:p><w:pPr><w:pageBreakBefore/><w:keepNext/><w:spacing w:before="0" w:after="0" w:line="1" w:lineRule="exact"/></w:pPr></w:p>';
  function label(title, value, { always = false, ...options } = {}) {
    return always || filled(value) ? para(run(title, { bold: true }) + run(" " + (value ?? "")), options) : "";
  }
  var band = (title, keep = true) => para(run(title, { bold: true, size: 20, color: "FFFFFF" }), { before: 100, after: 150, shade: "005B60", keep, separator: true });
  var choices = (options, selected) => options.map((option) => run((Array.isArray(selected) ? selected.includes(option) : selected === option) ? "\u2611 " : "\u2610 ", { font: "DejaVu Sans" }) + run(option + "   ")).join("");
  function table(rows, widths, { border = true, headers = false, keepRows = true, padding = 70 } = {}) {
    const edge = border ? "<w:tblBorders>" + ["top", "left", "bottom", "right", "insideH", "insideV"].map((side) => `<w:${side} w:val="single" w:sz="4" w:color="D9DDDD"/>`).join("") + "</w:tblBorders>" : "<w:tblBorders>" + ["top", "left", "bottom", "right", "insideH", "insideV"].map((side) => `<w:${side} w:val="nil"/>`).join("") + "</w:tblBorders>";
    return `<w:tbl><w:tblPr><w:tblW w:w="${widths.reduce((a, b) => a + b, 0)}" w:type="dxa"/><w:tblLayout w:type="fixed"/>${edge}<w:tblCellMar><w:top w:w="${padding}" w:type="dxa"/><w:left w:w="${padding}" w:type="dxa"/><w:bottom w:w="${padding}" w:type="dxa"/><w:right w:w="${padding}" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map((width) => `<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid>${rows.map((row, index) => `<w:tr><w:trPr>${keepRows ? "<w:cantSplit/>" : ""}${headers && index === 0 ? "<w:tblHeader/>" : ""}</w:trPr>${row.map((content, col) => `<w:tc><w:tcPr><w:tcW w:w="${widths[col]}" w:type="dxa"/><w:vAlign w:val="top"/>${headers ? `<w:shd w:fill="${index === 0 ? "B9B9B9" : index % 2 === 0 ? "F4F7F6" : "FFFFFF"}"/>` : ""}</w:tcPr>${content || blank()}${(content == null ? void 0 : content.endsWith("</w:tbl>")) ? blank() : ""}</w:tc>`).join("")}</w:tr>`).join("")}</w:tbl>`;
  }
  function dataTable(headers, rows, weights) {
    if (!rows.length) return "";
    const sum = weights.reduce((a, b) => a + b, 0);
    const widths = weights.map((weight) => Math.round(weight / sum * WIDTH));
    widths[widths.length - 1] += WIDTH - widths.reduce((a, b) => a + b, 0);
    return table([headers.map((text) => para(run(text, { bold: true, color: "FFFFFF" }), { after: 0 })), ...rows.map((row) => row.map((text) => para(run(text), { after: 0 })))], widths, { headers: true }) + blank();
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
      for (const asset2 of assets2.filter((item) => item.kind !== "road")) {
        const x = asset2.x / 100 * canvas.width - 10.3, y = asset2.y / 100 * canvas.height - 10.3;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#1e3232";
        ctx.lineWidth = 1.7;
        ctx.fillRect(x, y, 20.6, 20.6);
        ctx.strokeRect(x, y, 20.6, 20.6);
        if (asset2.id === state2.assetId) {
          ctx.strokeStyle = "#005b60";
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(x + 3, y + 10);
          ctx.lineTo(x + 8, y + 18);
          ctx.lineTo(x + 18, y + 3);
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
    const Zip = await zipLibrary();
    const zip = new Zip();
    const rels = [], media = [];
    let imageId = 0;
    function addImage(data, extension, base64 = false) {
      const id = "image" + ++imageId, name = id + "." + extension;
      zip.file("word/media/" + name, data, { base64 });
      rels.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`);
      media.push(id);
      return id;
    }
    function image(id, width, height, description) {
      const cx = Math.round(width * 12700), cy = Math.round(height * 12700), n = media.indexOf(id) + 1;
      return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${++drawingId}" name="${id}" descr="${esc(description)}"/><wp:cNvGraphicFramePr/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${n}" name="${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    }
    let drawingId = 0;
    const anniversary = addImage(await bytes("./assets/branding/anniversary.png"), "png");
    const logo = addImage(await bytes("./assets/branding/logo.jpg"), "jpg");
    const footerLogo = addImage(await bytes("./assets/branding/footer.jpg"), "jpg");
    const map = addImage(await mapImage(state2, assets2), "png", true);
    const branding = () => para(image(anniversary, 70.6, 15, "Anniversario"), { after: 140 }) + para(image(logo, 70.6, 108.5, "Logo"), { after: 0 });
    function heading(title, date, first = false) {
      const g2 = state2.general;
      let metadata = para(run(title, { bold: true, size: 26, color: "005B60" }), { after: 210, style: "Title" });
      metadata += label("ID Scheda:", g2.id, { always: true, shade: "D9D9D9", after: 0 });
      metadata += label("Data:", displayDate(date), { always: true, shade: "D9D9D9", after: first ? 0 : 180 });
      if (first) {
        metadata += label("Ora:", g2.time, { always: true, shade: "D9D9D9", after: 160 });
        metadata += para(run("Operatore: " + COMMON.operator, { bold: true }), { after: 90 });
        metadata += para(run(COMMON.company + " \u2013 " + COMMON.address, { size: 16 }), { after: 20 });
        metadata += para(run(COMMON.email, { size: 16 }), { after: 20 });
        metadata += para(run("PEC \u2013 " + COMMON.pec, { size: 16 }), { after: 0 });
      } else {
        metadata += label("Oggetto:", g2.object, { always: true });
        metadata += label("Operatori:", COMMON.company, { always: true });
        metadata += label("Restauratore capofila:", COMMON.operator, { always: true });
        metadata += label("Interventi autorizzati da:", COMMON.authorization, { always: true });
      }
      return table([[branding(), metadata]], [1600, first ? 6280 : WIDTH - 1600], { border: false, padding: 0, keepRows: false }) + blank();
    }
    const g = state2.general;
    let left = heading("SCHEDA DI ISPEZIONE PERIODICA", g.date, true);
    left += band("1. IDENTIFICAZIONE DEL BENE");
    for (const [title, value] of [["Oggetto:", g.object], ["Cronologia:", g.chronology], ["Autore:", g.author], ["Quota s.l.m.:", measureText(g.altitude)], ["Distanza Santuario:", measureText(g.distance)], ["Complesso:", COMMON.complex], ["Ente Proprietario:", COMMON.owner]]) left += label(title, value, { always: true });
    left += band("2. SOGGETTO E DATI TECNICO-DIMENSIONALI");
    left += label("Soggetto:", g.subject, { always: true });
    left += label("Dimensioni:", `H: ${measureText(g.height)}   L: ${measureText(g.width)}   P: ${measureText(g.depth)}`, { always: true });
    left += label("Materie e Tecniche:", g.materials, { always: true });
    const right = para(run("LOCALIZZAZIONE BENE", { bold: true, size: 22, color: "005B60" }), { align: "center", after: 120 }) + para(image(map, 242, 440.4, "Planimetria del bene selezionato"), { align: "center", after: 0 });
    let body = table([[left, right]], [8e3, WIDTH - 8e3], { border: false, padding: 60, keepRows: false });
    body += pageBreak() + band("3. STORICO MANUTENTIVO");
    for (const [key, title] of [["restorations", "Interventi di RESTAURO precedenti"], ["maintenance", "Interventi di MANUTENZIONE precedenti"]]) {
      for (const row of state2.history[key].filter((row2) => any(row2, ["date", "action"]))) {
        body += para(run(title, { bold: true }), { keep: true });
        body += label("Data:", row.date, { keep: filled(row.action) });
        body += label("Azione:", row.action);
      }
    }
    body += band("4. STATO CONSERVATIVO ATTUALE");
    for (const row of state2.conditions.filter((row2) => any(row2, ["exposure", "assessment"]) || row2.methods.length)) {
      body += label("Esposizione:", row.exposure);
      if (row.methods.length) body += para(run("Metodologia Ispezione: ", { bold: true }) + choices(METHODS, row.methods));
      body += label("Valutazione Sintetica:", row.assessment);
    }
    body += band("5. DIAGNOSTICA DEL DEGRADO E PRIORIT\xC0 DI INTERVENTO");
    body += dataTable(["Macro-Area", "Elemento", "Patologia Riscontrata", "Cause Principali", "Livello di Rischio", "Risolto in data"], state2.diagnosis.filter((row) => any(row, ["area", "element", "pathology", "causes", "risk", "resolvedDate"])).map((row) => [row.area, row.element, row.pathology, row.causes, row.risk, displayDate(row.resolvedDate)]), [2381, 2381, 2955, 3118, 1843, 1608]);
    for (const row of state2.priorities.filter((row2) => any(row2, ["risk", "window", "anomalies"]))) {
      let content = para(run("INDICE DI PRIORIT\xC0 E TEMPISTICHE DI INTERVENTO", { bold: true }), { keep: true });
      content += label("Grado d'Urgenza:", row.risk);
      if (row.window) content += para(run("Finestra d'Intervento Programmata: ", { bold: true }) + choices(windowsForRisk(row.risk), row.window));
      content += label("Anomalie attese:", row.anomalies);
      body += table([[content]], [WIDTH]) + blank();
    }
    body += label("Note aggiuntive:", state2.inspectionNotes);
    if (!state2.photos.length) body += band("6. ATLANTE FOTOGRAFICO", false);
    for (let offset = 0; offset < state2.photos.length; offset += 4) {
      body += pageBreak();
      if (offset === 0) body += band("6. ATLANTE FOTOGRAFICO");
      const cells = [];
      for (const photo of state2.photos.slice(offset, offset + 4)) {
        const extension = photo.data.startsWith("data:image/png") ? "png" : "jpg";
        const id = addImage(photo.data.split(",")[1], extension, true);
        const scale = Math.min(350 / photo.width, 207 / photo.height);
        cells.push(para(image(id, photo.width * scale, photo.height * scale, "Fotografia del bene"), { align: "center", after: 0 }));
      }
      while (cells.length % 2) cells.push(blank());
      const rows = [];
      for (let i = 0; i < cells.length; i += 2) rows.push(cells.slice(i, i + 2));
      body += table(rows, [WIDTH / 2, WIDTH / 2], { border: false, padding: 90 });
    }
    const sectionProperties = () => `<w:sectPr><w:footerReference w:type="default" r:id="footerDefault"/><w:footerReference w:type="first" r:id="footerFirst"/><w:type w:val="nextPage"/><w:pgSz w:w="15840" w:h="12240" w:orient="landscape"/><w:pgMar w:top="576" w:right="576" w:bottom="1120" w:left="576" w:header="180" w:footer="140"/><w:titlePg/></w:sectPr>`;
    const sectionBreak = () => `<w:p><w:pPr>${sectionProperties()}</w:pPr></w:p>`;
    body += sectionBreak() + heading("REGISTRO INTERVENTI DI MANUTENZIONE IMMEDIATA", state2.immediate.date) + band("INTERVENTI ESEGUITI");
    for (const row of immediateRows(state2).filter((row2) => any(row2, ["area", "action", "date"]))) {
      body += label("Eseguito in data:", displayDate(row.date || state2.immediate.executedDate), { keep: true });
      body += label("Macro-Area:", row.area, { keep: filled(row.action) });
      body += label("Azioni condotte in loco:", row.action, { after: 200 });
    }
    body += label("Note aggiuntive:", state2.immediate.notes);
    body += sectionBreak() + heading("PROGRAMMAZIONE AZIONI PREVENTIVE", state2.preventive.date) + band("AZIONI PREVENTIVE");
    for (const row of state2.diagnosis.filter((row2) => !row2.resolvedDate && (any(row2, ["area", "element", "pathology"]) || row2.actions.some(actionFilled)))) {
      if (any(row, ["area", "element", "pathology"])) body += dataTable(["Macro-Area", "Elemento", "Patologia Riscontrata"], [[row.area, row.element, row.pathology]], [4461, 4461, 5538]);
      for (const action of row.actions.filter(actionFilled)) {
        body += label("Grado d'Urgenza:", action.risk);
        if (action.window) body += para(run("Finestra d'Intervento: ", { bold: true }) + choices(windowsForRisk(action.risk), action.window));
        for (const [title, key, level] of [["Descrizione:", "description", 0], ["Azione:", "action", 1], ["Obiettivo:", "objective", 1], ["Operatore:", "operator", 1]]) {
          if (filled(action[key])) body += para(run(title, { bold: true }) + run(" " + action[key]), { bullet: level });
        }
        if (action.role) body += para(choices(ROLES, action.role), { bullet: 1 });
        if (action.status) body += para(run("Stato: ", { bold: true }) + choices(STATUSES, action.status));
      }
    }
    body += label("Note aggiuntive:", state2.preventive.notes) + sectionProperties();
    const number = para('<w:fldSimple w:instr="PAGE">' + run("1", { size: 15 }) + "</w:fldSimple>" + run("/", { size: 15 }) + '<w:fldSimple w:instr="NUMPAGES">' + run("1", { size: 15 }) + "</w:fldSimple>", { align: "right", after: 0 });
    const footer = table([[para(image(footerLogo, 105, 32.3, "Cr\xF2mo"), { after: 0 }), para(run("s.c.ar.l. \u2013 Via Matteotti 8, 21030 Castello Cabiaglio (VA) \u2013 C.F./P.IVA 02507710396\ninfo@cromorestauri.com \u2013 PEC \u2013 cromorestauri@sicurezzapostale.it", { size: 15 }), { after: 0 })]], [2350, WIDTH - 2350], { border: false, padding: 0 }) + number;
    const relXml = (entries) => XML + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + entries.join("") + "</Relationships>";
    zip.file("word/document.xml", XML + `<w:document ${NS}><w:body>${body}</w:body></w:document>`);
    zip.file("word/styles.xml", XML + `<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="19"/><w:color w:val="1E3232"/><w:lang w:val="it-IT"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="90" w:line="228" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="005B60"/></w:rPr></w:style></w:styles>`);
    zip.file("word/numbering.xml", XML + `<w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="multilevel"/>${[0, 1].map((level) => `<w:lvl w:ilvl="${level}"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="${level ? "\u25CB" : "\u2022"}"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="${(level + 1) * 500}"/></w:tabs><w:ind w:left="${(level + 1) * 500}" w:hanging="240"/></w:pPr></w:lvl>`).join("")}</w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`);
    zip.file("word/settings.xml", XML + `<w:settings ${NS}><w:updateFields w:val="true"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`);
    zip.file("word/footerDefault.xml", XML + `<w:ftr ${NS}>${number}</w:ftr>`);
    zip.file("word/footerFirst.xml", XML + `<w:ftr ${NS}>${footer}</w:ftr>`);
    zip.file("word/_rels/footerFirst.xml.rels", relXml(rels.filter((rel) => rel.includes('Id="' + footerLogo + '"'))));
    const type = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/";
    zip.file("word/_rels/document.xml.rels", relXml([...rels, ...["styles", "numbering", "settings"].map((name) => `<Relationship Id="${name}" Type="${type + name}" Target="${name}.xml"/>`), ...["First", "Default"].map((name) => `<Relationship Id="footer${name}" Type="${type}footer" Target="footer${name}.xml"/>`)]));
    zip.file("_rels/.rels", relXml([`<Relationship Id="document" Type="${type}officeDocument" Target="word/document.xml"/>`, '<Relationship Id="core" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>']));
    zip.file("docProps/core.xml", XML + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>' + esc(baseName(state2, assets2)) + "</dc:title><dc:creator>" + esc(COMMON.company) + "</dc:creator><dc:description>Schede Restauro " + VERSION + "</dc:description></cp:coreProperties>");
    const overrides = { "word/document.xml": "document.main", "word/styles.xml": "styles", "word/numbering.xml": "numbering", "word/settings.xml": "settings", "word/footerFirst.xml": "footer", "word/footerDefault.xml": "footer" };
    zip.file("[Content_Types].xml", XML + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/>' + Object.entries(overrides).map(([path, type2]) => `<Override PartName="/${path}" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${type2}+xml"/>`).join("") + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
    return new Blob([await zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } })], { type: MIME });
  }

  // recovered-smv/js/export.js
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
      const archive = apple && files2.length > 1 ? await makeArchive(files2, name) : null;
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

  // recovered-smv/js/home-title.js
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

  // recovered-smv/js/app.js
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
          "Salvataggio locale non riuscito. Mantieni aperta la scheda e salvala prima di uscire."
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
  function field(label2, path, {
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
    return `<label class="field${wide ? " wide" : ""}"><span>${escape(label2)}${fixed ? ' <span aria-label="non modificabile">\u{1F512}</span>' : ""}${unit ? " <small>(m)</small>" : ""}</span>${control}</label>`;
  }
  function fixedField(label2, value, wide = true) {
    return field(label2, "", { fixed: true, value, wide });
  }
  function band2(title) {
    return `<h2 class="section-heading">${escape(title)}</h2>`;
  }
  function removeButton(action, index, extra = "") {
    return `<button type="button" class="remove" data-action="${action}" data-index="${index}" ${extra}>Rimuovi</button>`;
  }
  function addButton(label2, action, extra = "") {
    return `<button class="add-button" type="button" data-action="${action}" ${extra}>\uFF0B ${escape(label2)}</button>`;
  }
  function repeatActions(addLabel, removeLabel, addAction, removeAction, count, extra = "") {
    return `<div class="repeat-actions">${addButton(addLabel, addAction, extra)}<button class="add-button" type="button" data-action="${removeAction}" data-index="${count - 1}" ${extra}${count ? "" : " disabled"} aria-label="${escape(removeLabel)}: ultimo elemento">\u2212 ${escape(removeLabel)}</button></div>`;
  }
  function riskField(label2, path) {
    const value = get(path);
    return `<label class="field"><span>${escape(label2)}</span><select data-path="${path}" class="risk-${String(value).toLowerCase().replace("basso", "low").replace("medio", "medium").replace("alto", "high")}"><option value="">\u2014</option>${RISKS.map((r) => `<option${r === value ? " selected" : ""}>${r}</option>`).join("")}</select></label>`;
  }
  function choices2(label2, path, values, multiple = false) {
    const value = get(path);
    return `<fieldset class="choice-group"><legend>${escape(label2)}</legend><div class="choices">${values.map((v, i) => `<label><input type="${multiple ? "checkbox" : "radio"}" name="${path}" value="${escape(v)}" data-path="${path}"${multiple ? ' data-multiple="true"' : ""}${multiple ? Array.isArray(value) && value.includes(v) ? " checked" : "" : value === v ? " checked" : ""}>${escape(v)}</label>`).join("")}</div>${!multiple ? `<button type="button" class="clear-choice" data-action="clear-choice" data-path="${path}">Azzera scelta</button>` : ""}</fieldset>`;
  }
  function sharedHeader(datePath) {
    return `<div class="fields three shared-header">${field("ID scheda", "general.id")}${field("Data", datePath, { type: "date" })}${field("Oggetto", "general.object", { fixed: Object.hasOwn(asset().fixed || {}, "object") })}</div>`;
  }
  function mapHtml() {
    return `<aside class="map-panel"><h2>LOCALIZZAZIONE BENE</h2><p>\u{1F512} ${escape(asset().label)}</p><div class="map-frame"><img src="./assets/map.jpg" alt="Planimetria del percorso del Sacro Monte di Varese">${state.assetId === "strada" ? `<svg class="map-road" viewBox="0 0 ${ROAD_SIZE.width} ${ROAD_SIZE.height}" aria-label="Strada selezionata"><polyline points="${ROAD_SVG_POINTS}" /></svg>` : ""}${assets.filter((a) => a.kind !== "road").map(
      (a) => `<span class="map-check${a.id === state.assetId ? " selected" : ""}" role="checkbox" aria-checked="${a.id === state.assetId}" aria-disabled="true" aria-label="${escape(a.label)}" title="${escape(a.label)}" style="left:${a.x}%;top:${a.y}%">${a.id === state.assetId ? "\u2713" : ""}</span>`
    ).join("")}</div></aside>`;
  }
  function firstSection() {
    const fixed = asset().fixed || {};
    const general = (label2, key, options = {}) => field(label2, "general." + key, {
      ...options,
      fixed: Object.hasOwn(fixed, key)
    });
    return `<div class="first-layout"><div><h1>SCHEDA DI ISPEZIONE PERIODICA</h1><div class="fields">${field("ID scheda", "general.id", { wide: true })}${field("Data", "general.date", { type: "date" })}${field("Ora", "general.time", { type: "time" })}</div>
  ${band2("1. IDENTIFICAZIONE DEL BENE")}<div class="fields">${general("Oggetto", "object", { wide: true })}${general("Cronologia", "chronology")}${general("Autore", "author")}${general("Quota s.l.m.", "altitude", { unit: true })}${general("Distanza dal Santuario", "distance", { unit: true })}${fixedField("Complesso", COMMON.complex)}${fixedField("Ente proprietario", COMMON.owner)}</div>
  ${band2("2. SOGGETTO E DATI TECNICO-DIMENSIONALI")}<div class="fields">${general("Soggetto", "subject", { wide: true, multiline: true })}</div><div class="fields three wide-note">${general("Altezza H", "height", { unit: true })}${general("Larghezza L", "width", { unit: true })}${general("Profondit\xE0 P", "depth", { unit: true })}</div><div class="wide-note">${general("Materie e Tecniche", "materials", { multiline: true })}</div></div>${mapHtml()}</div>`;
  }
  function historyCards(key, title) {
    return `${band2(title)}${state.history[key].map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>${escape(title)} \xB7 ${i + 1}</h3></div><div class="fields">${field("Data", `history.${key}.${i}.date`)}${field("Azione", `history.${key}.${i}.action`, { multiline: true, wide: true })}</div></article>`).join("")}${repeatActions("Aggiungi intervento", "Rimuovi intervento", "add-history", "remove-history", state.history[key].length, `data-key="${key}"`)}`;
  }
  function historySection() {
    return `<h1>Storico e stato conservativo</h1>${band2("3. STORICO MANUTENTIVO")}${historyCards("restorations", "Interventi di RESTAURO precedenti")}${historyCards("maintenance", "Interventi di MANUTENZIONE precedenti")}${band2("4. STATO CONSERVATIVO ATTUALE")}${state.conditions.map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>Stato conservativo \xB7 ${i + 1}</h3></div>${field("Esposizione", `conditions.${i}.exposure`)}${choices2("Metodologia Ispezione", `conditions.${i}.methods`, METHODS, true)}${field("Valutazione sintetica", `conditions.${i}.assessment`, { multiline: true })}</article>`).join("")}${repeatActions("Aggiungi stato conservativo", "Rimuovi stato conservativo", "add-condition", "remove-condition", state.conditions.length)}`;
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
    return `<h1>Diagnostica e priorit\xE0</h1>${band2("5. DIAGNOSTICA DEL DEGRADO E PRIORIT\xC0 DI INTERVENTO")}<div class="table-wrap"><table class="diagnosis-table" role="table"><thead role="rowgroup"><tr role="row">${diagnosisHeaders.map((h) => `<th role="columnheader" scope="col">${h}</th>`).join("")}</tr></thead><tbody role="rowgroup">${state.diagnosis.map((r, i) => `<tr role="row">${["area", "element", "pathology", "causes"].map((k, j) => `<td role="cell">${field(diagnosisHeaders[j], `diagnosis.${i}.${k}`, { multiline: true })}</td>`).join("")}<td role="cell">${riskField("Livello di rischio", `diagnosis.${i}.risk`)}</td><td role="cell">${field("Risolto in data", `diagnosis.${i}.resolvedDate`, { type: "date" })}</td></tr>`).join("")}</tbody></table></div>${repeatActions("Aggiungi riga", "Rimuovi riga", "add-diagnosis", "remove-diagnosis", state.diagnosis.length)}${band2("INDICE DI PRIORIT\xC0 E TEMPISTICHE DI INTERVENTO")}${state.priorities.map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>Priorit\xE0 \xB7 ${i + 1}</h3></div>${riskField("Grado d\u2019urgenza", `priorities.${i}.risk`)}${choices2("Finestra d\u2019intervento programmata", `priorities.${i}.window`, windowsForRisk(r.risk))}${field("Anomalie attese", `priorities.${i}.anomalies`, { multiline: true })}</article>`).join("")}${repeatActions("Aggiungi priorit\xE0", "Rimuovi priorit\xE0", "add-priority", "remove-priority", state.priorities.length)}<div class="wide-note">${field("Note aggiuntive", "inspectionNotes", { multiline: true })}</div>`;
  }
  function photosSection() {
    return `<h1>Atlante fotografico</h1>${band2("6. ATLANTE FOTOGRAFICO")}<div class="photo-actions"><button type="button" data-action="camera" class="primary">Scatta foto</button><button type="button" data-action="photos">Carica foto</button></div><div class="photo-grid">${state.photos.map((p, i) => `<article class="photo-card"><img src="${escape(p.data)}" alt="Fotografia ${i + 1}"><div><span>Foto ${i + 1}</span>${removeButton("remove-photo", i)}</div></article>`).join("")}</div>${!state.photos.length ? '<p class="empty">Aggiungi le fotografie del sopralluogo.</p>' : ""}`;
  }
  function immediateSection() {
    return `<h1>Registro interventi di manutenzione immediata</h1>${sharedHeader("immediate.date")}${band2("INTERVENTI ESEGUITI")}${state.diagnosis.map((r, i) => r.resolvedDate ? `<article class="repeat-card"><div class="card-top"><h3>Intervento dalla diagnostica \xB7 ${i + 1}</h3></div>${fixedField("Macro-Area", r.area)}${fixedField("Eseguito in data", r.resolvedDate)}${field("Azioni condotte in loco", `diagnosis.${i}.resolvedAction`, { wide: true, multiline: true })}</article>` : "").join("")}${state.immediate.records.map((r, i) => `<article class="repeat-card"><div class="card-top"><h3>Intervento \xB7 ${i + 1}</h3></div><div class="fields">${field("Macro-Area", `immediate.records.${i}.area`, { wide: true })}${field("Azioni condotte in loco", `immediate.records.${i}.action`, { wide: true, multiline: true })}</div></article>`).join("")}${repeatActions("Aggiungi intervento", "Rimuovi intervento", "add-immediate", "remove-immediate", state.immediate.records.length)}<div class="wide-note">${field("Note aggiuntive", "immediate.notes", { multiline: true })}</div>`;
  }
  function preventiveSection() {
    const pending = state.diagnosis.map((r, i) => ({ ...r, index: i })).filter((r) => !r.resolvedDate);
    return `<h1>Programmazione azioni preventive</h1>${sharedHeader("preventive.date")}${band2("AZIONI PREVENTIVE")}<div class="table-wrap"><table><thead><tr><th>Riga</th><th>Macro-Area</th><th>Elemento</th><th>Patologia riscontrata</th></tr></thead><tbody>${pending.map((r) => `<tr><td>${r.index + 1}</td><td>${escape(r.area)}</td><td>${escape(r.element)}</td><td>${escape(r.pathology)}</td></tr>`).join("")}</tbody></table></div>${pending.map((r) => `<div class="record-context"><strong>Riga ${r.index + 1}</strong> \xB7 ${escape(r.area || "Macro-Area non compilata")}<br>${escape(r.element)}${r.element && r.pathology ? " \xB7 " : ""}${escape(r.pathology)}</div>${r.actions.map((a, j) => `<article class="repeat-card"><div class="card-top"><h3>Azione preventiva ${r.index + 1}.${j + 1}</h3>${removeButton("remove-preventive", j, `data-row="${r.index}"`)}</div>${riskField("Grado d\u2019urgenza", `diagnosis.${r.index}.actions.${j}.risk`)}${choices2("Finestra d\u2019intervento", `diagnosis.${r.index}.actions.${j}.window`, windowsForRisk(a.risk))}<div class="fields">${field("Descrizione", `diagnosis.${r.index}.actions.${j}.description`, { wide: true, multiline: true })}${field("Azione", `diagnosis.${r.index}.actions.${j}.action`, { wide: true, multiline: true })}${field("Obiettivo", `diagnosis.${r.index}.actions.${j}.objective`, { wide: true, multiline: true })}${field("Operatore", `diagnosis.${r.index}.actions.${j}.operator`, { wide: true })}</div>${choices2("Qualifica operatore", `diagnosis.${r.index}.actions.${j}.role`, ROLES)}${choices2("Stato", `diagnosis.${r.index}.actions.${j}.status`, STATUSES)}</article>`).join("")}${addButton("Aggiungi azione per la riga " + (r.index + 1), "add-preventive", `data-row="${r.index}"`)}`).join("")}${!pending.length ? '<p class="empty">Aggiungi una riga nella sezione Diagnostica e priorit\xE0 per associarle azioni preventive.</p>' : ""}<div class="wide-note">${field("Note aggiuntive", "preventive.notes", { multiline: true })}</div>`;
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
    $("previous").textContent = state.section ? "\u2190 " + SECTIONS[state.section - 1] : "Home";
    $("next").textContent = state.section === SECTIONS.length - 1 ? "Salva scheda" : SECTIONS[state.section + 1] + " \u2192";
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
    if (el.dataset.path.endsWith(".risk")) {
      const parent = get(el.dataset.path.slice(0, -5));
      if (parent.window && !windowsForRisk(parent.risk).includes(parent.window))
        parent.window = "";
      render();
    }
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
  $("infoButton").onclick = () => {
    $("options").open = false;
    $("appVersion").textContent = "V." + VERSION;
    $("pwaLink").href = PWA_URL;
    $("pwaLink").textContent = PWA_URL;
    $("infoDialog").showModal();
  };
  $("newButton").onclick = () => $("newDialog").showModal();
  $("newForm").onsubmit = async (event) => {
    event.preventDefault();
    if (draftAvailable && !confirm(
      "Creare una nuova scheda sostituendo la bozza corrente? Salva prima la scheda se vuoi conservarla."
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
      "Cancellare tutti i dati e le fotografie della bozza? I file gi\xE0 esportati resteranno disponibili."
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
  function exportFinal() {
    if (busy) return;
    $("saveForm").reset();
    $("confirmSave").disabled = false;
    $("saveError").hidden = true;
    $("saveDialog").showModal();
  }
  var formatInputs = [...document.querySelectorAll('#saveForm input[name="format"]')];
  $("saveForm").addEventListener("change", () => {
    $("confirmSave").disabled = !formatInputs.some((input) => input.checked);
  });
  $("saveDialog").addEventListener("cancel", (event) => {
    if (busy) event.preventDefault();
  });
  $("saveForm").onsubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const selected = formatInputs.filter((input) => input.checked).map((input) => input.value);
    if (!selected.length) return;
    $("saveError").hidden = true;
    busy = true;
    $("next").disabled = true;
    $("closeSave").disabled = true;
    $("confirmSave").disabled = true;
    $("confirmSave").textContent = "Generazione\u2026";
    formatInputs.forEach((input) => input.disabled = true);
    exportFiles.clear();
    const version = revision;
    try {
      for (const key of measureKeys) state.general[key] = formatMeasure(state.general[key]);
      parseState(state, assets);
      await persist();
      const snapshot = structuredClone(state);
      const files2 = [];
      for (const extension of selected) {
        const blob = extension === "docx" ? await makeDocx(snapshot, assets) : extension === "pdf" ? await makePdf(snapshot, assets) : new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
        files2.push({ extension, blob });
      }
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
      busy = false;
      formatInputs.forEach((input) => input.disabled = false);
      $("closeSave").disabled = false;
      $("confirmSave").textContent = "Salva";
      $("confirmSave").disabled = !formatInputs.some((input) => input.checked);
      render();
    }
  };
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
      const rank = (x) => x.kind === "road" ? 99 : x.kind === "arch" ? { 1: 0.5, 2: 5.5, 3: 10.5 }[x.number] : x.number;
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
