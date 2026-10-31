import { surveyEntries, preventiveGroups, maintenanceEntries, allPhotos } from "./surveys.js";
import { VERSION } from "./config.js";
import { ROAD_SIZE, ROAD_POINTS, mapAssets } from "./road.js";
import {
  COMMON,
  METHODS,
  ROLES,
  STATUSES,
  windowsForRisk,
  immediateRows,
  displayDate,
  measureText,
  baseName,
  diagnosisHasContent,
} from "./model.js";
import {
  PdfReport,
  Flow,
  PAGE,
  BODY_WIDTH,
  TYPE,
  COLORS,
  hasText,
  riskColor,
} from "./pdf-layout.js";

const files = new Map();
async function resource(path) {
  if (!files.has(path))
    files.set(
      path,
      fetch(path)
        .then((response) => {
          if (!response.ok) throw Error("Risorsa PDF non disponibile: " + path);
          return response.arrayBuffer();
        })
        .catch((error) => {
          files.delete(path);
          throw error;
        }),
    );
  return new Uint8Array(await files.get(path));
}
let dependencies;
function loadScript(src, globalName) {
  if (window[globalName]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.onload = () =>
      window[globalName]
        ? resolve()
        : reject(Error("Libreria PDF non inizializzata."));
    script.onerror = () => {
      script.remove();
      reject(
        Error(
          "Caricamento PDF non riuscito. Apri il sito GitHub Pages con connessione e riprova.",
        ),
      );
    };
    document.head.append(script);
  });
}
async function libraries() {
  if (!dependencies)
    dependencies = Promise.all([
      loadScript("./vendor/pdf-lib.min.js", "PDFLib"),
      loadScript("./vendor/fontkit.umd.min.js", "fontkit"),
    ]).catch((error) => {
      dependencies = null;
      throw error;
    });
  await dependencies;
}

const HISTORY_TITLE = "3. STORICO MANUTENTIVO";
const CONDITION_TITLE = "4. STATO CONSERVATIVO ATTUALE";
const DIAGNOSIS_TITLE = "5. DIAGNOSTICA DEL DEGRADO E PRIORITÀ DI INTERVENTO";
const PHOTO_TITLE = "6. ATLANTE FOTOGRAFICO";
const IMMEDIATE_TITLE = "INTERVENTI ESEGUITI";
const PREVENTIVE_TITLE = "AZIONI PREVENTIVE";
const actionHasContent = (action) =>
  Object.entries(action).some(([key, value]) => key !== "id" && hasText(value));

function identification(report, state, assets) {
  const { page } = report.page("first");
  const left = PAGE.margin,
    columnWidth = 371.2,
    textX = left + 92;
  report.image(page, report.images.anniversary, left, 55.1, 70.6, 15);
  report.image(page, report.images.logo, left, 84.55, 70.6, 108.5);
  report.text(page, "SCHEDA DI ISPEZIONE PERIODICA", textX, 48.2, {
    size: 13,
    bold: true,
    color: COLORS.green,
  });
  let headerY = 86.6;
  for (const [label, value] of [
    ["ID Scheda:", state.general.id],
    ["Data:", displayDate(state.general.date)],
    ["Ora:", state.general.time],
  ]) {
    const height = Math.max(
      14.5,
      report.wrap(value, 220).length * TYPE.leading + 3,
    );
    report.rect(page, textX - 1, headerY - 2, 271.2, height, {
      fill: "#d9d9d9",
    });
    report.label(page, label, value, textX, headerY, 266.2, {
      minHeight: height,
    });
    headerY += height;
  }
  headerY = Math.max(144.6, headerY + 14);
  report.text(page, "Operatore: " + COMMON.operator, textX, headerY, {
    bold: true,
  });
  headerY += 15;
  const address = `${COMMON.company} – ${COMMON.address}`;
  const addressLines = report.wrap(address, columnWidth - 92, 8);
  addressLines.forEach((line, i) =>
    report.text(page, line, textX, headerY + i * 10, { size: 8 }),
  );
  headerY += addressLines.length * 10 + 1;
  for (const info of [COMMON.email, "PEC – " + COMMON.pec]) {
    report.text(page, info, textX, headerY, { size: 8 });
    headerY += 11.2;
  }
  const top = Math.max(225.5, headerY + 20);
  report.band(page, "1. IDENTIFICAZIONE DEL BENE", top, left, columnWidth);
  const flow = new Flow(
    report,
    "inspection",
    {},
    { page, x: left, width: columnWidth, y: top + 30, firstColumn: true },
  );
  const fields = [
    ["Oggetto:", state.general.object],
    ["Cronologia:", state.general.chronology],
    ["Autore:", state.general.author],
  ];
  fields.forEach(([label, value]) =>
    flow.paragraph(label, value, { showEmpty: true }),
  );
  const measureRow = (label, value, x, width) =>
    report.label(flow.page, label, value, x, flow.y, width, {
      minHeight: 17.4,
    });
  flow.ensure(18);
  measureRow("Quota s.l.m.:", measureText(state.general.altitude), flow.x, 125);
  measureRow(
    "Distanza Santuario:",
    measureText(state.general.distance),
    flow.x + 131,
    flow.width - 131,
  );
  flow.y += 17.4;
  flow.paragraph("Complesso:", state.general.complex, { showEmpty: true });
  flow.paragraph("Ente Proprietario:", state.general.owner, { showEmpty: true });
  flow.y = Math.max(flow.firstColumn ? 376 : flow.y + 8, flow.y + 12);
  flow.section("2. SOGGETTO E DATI TECNICO-DIMENSIONALI", 18);
  flow.paragraph("Soggetto:", state.general.subject, {
    showEmpty: true,
  });
  flow.ensure(18);
  // Un'unica riga con le tre dimensioni; i valori lunghi vanno a capo nei campi.
  const dimensions = [
    ["Dimensioni: H:", state.general.height],
    ["L:", state.general.width],
    ["P:", state.general.depth],
  ];
  const widths = [150, 90, flow.width - 240];
  let x = flow.x,
    max = 17.4;
  dimensions.forEach(([label, value], i) => {
    max = Math.max(
      max,
      report.label(flow.page, label, measureText(value), x, flow.y, widths[i], {
        minHeight: 17.4,
      }),
    );
    x += widths[i];
  });
  flow.y += max;
  flow.paragraph("Materie e Tecniche:", state.general.materials, {
    showEmpty: true,
  });

  const frame = { x: 428.8, top: 28.8, width: 334.4, height: 523.2 };
  report.rect(page, frame.x, frame.top, frame.width, frame.height, {
    fill: "#f8faf9",
    border: COLORS.green,
    borderWidth: 0.75,
  });
  const mapTitle = "LOCALIZZAZIONE BENE";
  report.text(
    page,
    mapTitle,
    frame.x + (frame.width - report.width(mapTitle, 11, true)) / 2,
    39.6,
    { size: 11, bold: true, color: COLORS.green },
  );
  const map = {
    x: frame.x + (frame.width - 254.15) / 2,
    top: 63.2,
    width: 254.15,
    height: 254.15 * ROAD_SIZE.height / ROAD_SIZE.width,
  };
  report.image(page, report.images.map, map.x, map.top, map.width, map.height);
  if (state.assetId === "strada")
    for (let i = 1; i < ROAD_POINTS.length; i++) {
      const point = ([x, y]) => ({
        x: map.x + (x / ROAD_SIZE.width) * map.width,
        y: PAGE.height - map.top - (y / ROAD_SIZE.height) * map.height,
      });
      page.drawLine({
        start: point(ROAD_POINTS[i - 1]),
        end: point(ROAD_POINTS[i]),
        thickness: 2.1,
        color: report.color("#d90d14"),
        lineCap: 1,
        opacity: 0.9,
      });
    }
  mapAssets(assets, state.assetId)
    .forEach((asset) =>
      report.checkbox(
        page,
        map.x + (asset.x / 100) * map.width - 4,
        map.top + (asset.y / 100) * map.height - 4,
        "",
        asset.id === state.assetId,
        { size: 8 },
      ),
    );
}

function historyAndCondition(flow, state) {
  flow.section(HISTORY_TITLE, 18);
  for (const [key, title] of [
    ["restorations", "Interventi di RESTAURO precedenti"],
    ["maintenance", "Interventi di MANUTENZIONE precedenti"],
  ]) {
    for (const row of state.history[key].filter((r) =>
      [r.date, r.action].some(hasText),
    )) {
      const height =
        18 +
        (hasText(row.date)
          ? flow.paragraphHeight("Data:", row.date)
          : 0) +
        (hasText(row.action)
          ? flow.paragraphHeight("Azione:", row.action)
          : 0) +
        8;
      flow.ensure(Math.min(height, flow.freshHeight()));
      flow.report.text(flow.page, title, flow.x, flow.y, { bold: true });
      flow.y += 18;
      flow.paragraph("Data:", row.date);
      flow.paragraph("Azione:", row.action);
      flow.y += 8;
    }
  }
  flow.section(CONDITION_TITLE, 18);
  for (const row of state.conditions.filter(
    (r) => [r.exposure, r.assessment].some(hasText) || r.methods.length,
  )) {
    const height =
      (row.date ? flow.paragraphHeight("Data del rilievo:", displayDate(row.date)) : 0) +
      flow.paragraphHeight("Esposizione:", row.exposure) +
      flow.paragraphHeight("Valutazione Sintetica:", row.assessment) +
      (row.methods.length ? 22 : 0);
    flow.ensure(Math.min(height, flow.freshHeight()));
    flow.paragraph("Data del rilievo:", displayDate(row.date));
    flow.paragraph("Esposizione:", row.exposure, {
    });
    if (row.methods.length) {
      flow.ensure(22);
      flow.report.text(flow.page, "Metodologia Ispezione:", flow.x, flow.y, {
        bold: true,
      });
      flow.report.choices(
        flow.page,
        METHODS,
        row.methods,
        flow.x + 124,
        flow.y,
        flow.width - 124,
      );
      flow.y += 22;
    }
    flow.paragraph("Valutazione Sintetica:", row.assessment, {
    });
    flow.y += 6;
  }
}
function diagnostics(flow, state) {
  const rows = state.diagnosis
    .filter(diagnosisHasContent)
    .map((r) => [
      r.reference,
      r.area,
      r.element,
      r.pathology,
      r.causes,
      r.risk,
      displayDate(r.detectedDate),
      displayDate(r.resolvedDate),
    ]);
  const weights = [50, 115, 115, 210, 190, 105, 100, 100];
  const total = weights.reduce((a, b) => a + b, 0);
  const firstHeight = rows.length
    ? Math.max(
        ...rows[0].map(
          (value, i) =>
            flow.report.wrap(value, (weights[i] / total) * flow.width - 8)
              .length,
        ),
      ) *
        TYPE.leading +
      8
    : 0;
  flow.section(
    DIAGNOSIS_TITLE,
    rows.length ? 32 + Math.min(firstHeight, flow.freshHeight() - 64) : 0,
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
      "Risolto in data",
    ],
    rows,
    weights,
    { riskColumn: 5 },
  );
}
function priorities(flow, state) {
  for (const row of state.priorities.filter((r) =>
    [r.risk, r.window, r.anomalies].some(hasText),
  )) {
    const r = flow.report,
      choiceX = flow.x + 180;
    const options = windowsForRisk(row.risk);
    const choiceHeight = hasText(row.window)
      ? r.choiceLines(options, flow.width - 188).length * 16
      : 0;
    const anomalyTop = hasText(row.window) ? 44 + choiceHeight + 4 : 46;
    const anomalyLines = hasText(row.anomalies)
      ? r.wrap(row.anomalies, flow.width - 16)
      : [];
    const total = Math.max(
      64,
      anomalyTop + anomalyLines.length * TYPE.leading + 22,
    );
    if (total <= flow.freshHeight()) flow.ensure(total);
    let offset = 0,
      first = true;
    while (first || offset < anomalyLines.length) {
      first = false;
      if (flow.y + anomalyTop + 20 > PAGE.bottom) flow.next();
      const take = Math.max(
        1,
        Math.floor((PAGE.bottom - flow.y - anomalyTop - 22) / TYPE.leading),
      );
      const count = Math.min(take, anomalyLines.length - offset);
      const height = Math.max(64, anomalyTop + count * TYPE.leading + 22);
      r.rect(flow.page, flow.x, flow.y, flow.width, height, {
        fill: COLORS.priority,
        border: COLORS.green,
        borderWidth: 0.6,
      });
      r.text(
        flow.page,
        "INDICE DI PRIORITÀ E TEMPISTICHE DI INTERVENTO" +
          (row.diagnosisId ? " · PRIORITÀ " + (state.diagnosis.find(source => source.id === row.diagnosisId)?.reference || "") : ""),
        flow.x + 4,
        flow.y + 4,
        { bold: true },
      );
      if (hasText(row.risk)) {
        r.text(flow.page, "Grado d'Urgenza:", flow.x + 4, flow.y + 28, {
          bold: true,
        });
        r.text(flow.page, row.risk, flow.x + 104, flow.y + 28, {
          color: riskColor(row.risk),
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
          { bold: true },
        );
        r.choices(
          flow.page,
          options,
          row.window,
          choiceX,
          flow.y + 44,
          flow.width - 188,
        );
      }
      if (anomalyLines.length) {
        r.text(flow.page, "Anomalie attese:", flow.x + 8, flow.y + anomalyTop, {
          bold: true,
        });
        // Testo sotto l'etichetta per mantenere tutta la larghezza disponibile.
        anomalyLines
          .slice(offset, offset + count)
          .forEach((line, i) =>
            r.text(
              flow.page,
              line,
              flow.x + 8,
              flow.y + anomalyTop + 14 + i * TYPE.leading,
            ),
          );
      }
      flow.y += height + 12;
      offset += count;
      if (offset < anomalyLines.length) flow.next();
    }
  }
  flow.box("Note aggiuntive:", state.inspectionNotes, { minHeight: 60, anchorBottom: true });
}
async function photographs(flow, state) {
  const photos = allPhotos(state);
  flow.next();
  flow.section(PHOTO_TITLE);
  if (!photos.length) return;
  const r = flow.report, gap = 12, width = (BODY_WIDTH - gap) / 2;
  const dated = surveyEntries(state).length > 1;
  const groups = dated ? [...new Set(photos.map(p => p.surveyDate || ""))].map(date =>
    ({ date, photos: photos.filter(p => (p.surveyDate || "") === date) })) : [{ date: "", photos }];
  let pageIndex = 0;
  for (const group of groups) {
    const top = dated ? 82 : 65;
    const height = (PAGE.bottom - top - gap) / 2;
    // Didascalie molto lunghe proseguono in uno spazio successivo, senza tagli.
    const slots = [];
    for (const photo of group.photos) {
      const lines = photo.caption?.trim() ? r.wrap(photo.caption, width) : [];
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
        const x = PAGE.margin + (slot % 2) * (width + gap), y = top + Math.floor(slot / 2) * (height + gap);
        let textTop = y;
        if (first) {
          const image = await r.photoImage(photo);
          const imageHeight = height - (lines.length + 1) * TYPE.leading - 8;
          const scale = Math.min(width / image.width, imageHeight / image.height);
          r.image(flow.page, image, x + (width - image.width * scale) / 2,
            y + (imageHeight - image.height * scale) / 2, image.width * scale, image.height * scale);
          textTop = y + imageHeight + 5;
        }
        r.text(flow.page, (first ? "Inserita il " : "Didascalia (segue) · ") + displayDate(photo.insertedDate || photo.surveyDate), x, textTop);
        lines.forEach((line, i) => r.text(flow.page, line, x, textTop + (i + 1) * TYPE.leading));
      }
    }
  }
}

function immediate(report, state) {
  const rows = maintenanceEntries(state).filter((r) =>
    [r.area, r.action, r.date].some(hasText),
  );
  const flow = new Flow(report, "immediate", {
    date: state.immediate.date,
  });
  const dated = surveyEntries(state).length > 1;
  flow.section(IMMEDIATE_TITLE, rows.length ? 20 : 0);
  rows.forEach((row) => {
    const headers = ["ID", "Macro-Area", "Elemento", "Patologia", "Cause principali", "Eseguito in data"];
    const values = [row.reference, row.area, row.element, row.pathology, row.causes,
      displayDate(row.date || state.immediate.executedDate)];
    const weights = [700, 2700, 2700, 3860, 3100, 1900];
    const total = weights.reduce((sum, width) => sum + width, 0);
    const widths = weights.map(width => width / total * flow.width - 8);
    const tableHeight = Math.max(20, ...headers.map((text, i) =>
      report.wrap(text, widths[i], 9.5, true).length * 11.4 + 8)) +
      Math.max(...values.map((text, i) => report.wrap(text, widths[i]).length)) * TYPE.leading + 20;
    const height = tableHeight +
      (dated ? flow.paragraphHeight("Sopralluogo:", displayDate(row.surveyDate)) : 0) +
      (hasText(row.action)
        ? flow.paragraphHeight("Azioni condotte in loco:", row.action)
        : 0) +
      12;
    // Le date differenti non interrompono il flusso. Teniamo insieme una voce
    // che entra in una pagina; quelle più lunghe proseguono subito dopo.
    const keepTogether = height <= flow.freshHeight();
    flow.ensure(keepTogether ? height : 18);
    if (dated) flow.paragraph("Sopralluogo:", displayDate(row.surveyDate), { keepTogether });
    flow.table(headers, [values], weights);
    flow.paragraph("Azioni condotte in loco:", row.action, { keepTogether });
    flow.y += 12;
  });
  flow.box("Note aggiuntive:", state.immediate.notes, {
    minHeight: 80, anchorBottom: true,
  });
}
function actionPackage(flow, action) {
  const r = flow.report;
  const entries = [
    ["Descrizione:", action.description, 0],
    ["Azione:", action.action, 1],
    ["Obiettivo:", action.objective, 1],
    ["Operatore:", action.operator, 1],
  ].filter(([, value]) => hasText(value));
  const height =
    entries.reduce(
      (h, [label, value, level]) =>
        h + flow.paragraphHeight(label, value, { indent: level ? 72 : 36 }),
      0,
    ) +
    (hasText(action.risk) || hasText(action.window) ? 40 : 0) +
    (action.role ? 56 : action.status ? 24 : 0);
  flow.ensure(Math.min(height, flow.freshHeight()));
  if (hasText(action.risk) || hasText(action.window)) {
    const options = windowsForRisk(action.risk);
    const choiceHeight = hasText(action.window)
      ? r.choiceLines(options, flow.width - 188).length * 16
      : 0;
    flow.ensure(24 + choiceHeight);
    if (hasText(action.risk)) {
      r.text(flow.page, "Grado d'Urgenza:", flow.x + 4, flow.y, { bold: true });
      r.text(flow.page, action.risk, flow.x + 104, flow.y, {
        color: riskColor(action.risk),
      });
    }
    if (hasText(action.window)) {
      if (hasText(action.risk))
        r.text(flow.page, ">>>", flow.x + 150, flow.y, { bold: true });
      r.text(flow.page, "Finestra d'Intervento:", flow.x + 180, flow.y, {
        bold: true,
      });
      r.choices(
        flow.page,
        options,
        action.window,
        flow.x + 180,
        flow.y + 16,
        flow.width - 188,
      );
    }
    flow.y += 24 + choiceHeight;
  }
  entries.forEach(([label, value, level]) => {
    const indent = level ? 72 : 36;
    const h = flow.paragraphHeight(label, value, { indent, labelSize: 10 });
    flow.ensure(Math.min(h, flow.freshHeight()));
    flow.page.drawCircle({
      x: flow.x + (level ? 56 : 20),
      y: PAGE.height - flow.y - 5,
      size: level ? 1.8 : 1.9,
      borderColor: r.color(COLORS.ink),
      borderWidth: 0.6,
      ...(!level ? { color: r.color(COLORS.ink) } : {}),
    });
    flow.paragraph(label, value, {
      indent,
      labelSize: 10,
    });
  });
  if (action.role || action.status) {
    flow.ensure(action.role ? 56 : 24);
    if (action.role)
      ROLES.forEach((label, i) =>
        r.checkbox(
          flow.page,
          flow.x + 72,
          flow.y + i * 16,
          label,
          label === action.role,
          { fontSize: 10 },
        ),
      );
    if (action.status) {
      r.text(flow.page, "Stato:", flow.x + 312.5, flow.y, {
        bold: true,
        size: 10,
      });
      STATUSES.forEach((label, i) =>
        r.checkbox(
          flow.page,
          flow.x + [355.1, 440.3, 539.7][i],
          flow.y,
          label,
          label === action.status,
          { fontSize: 10 },
        ),
      );
    }
    flow.y += action.role ? 56 : 24;
  }
  flow.y += 12;
}
function preventive(report, state) {
  const rows = preventiveGroups(state);
  const flow = new Flow(report, "preventive", { date: state.preventive.date });
  flow.section(PREVENTIVE_TITLE, rows.length ? 40 : 0);
  rows.forEach((row, index) => {
    const actions = row.actions.filter(actionHasContent);
    const headers = ["ID", "Macro-Area", "Elemento", "Patologia Riscontrata", "Cause Principali", "Data del rilievo", "Risolto in data"];
    const values = [row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row.detectedDate), displayDate(row.resolvedDate)];
    const weights = [650, 2200, 2200, 3300, 2600, 1800, 1800];
    const sum = weights.reduce((total, width) => total + width, 0);
    const contextHeight =
      Math.max(
        ...values.map(
          (value, i) =>
            report.wrap(value, (weights[i] / sum) * flow.width - 8).length,
        ),
      ) *
        TYPE.leading +
      40;
    const actionHeight = actions.reduce(
      (total, a) =>
        total +
        ["description", "action", "objective", "operator"].reduce(
          (n, key) =>
            n +
            (hasText(a[key])
              ? flow.paragraphHeight(key + ":", a[key], { indent: 72 })
              : 0),
          0,
        ) +
        (a.risk || a.window ? 40 : 0) +
        (a.role ? 56 : a.status ? 24 : 0) +
        12,
      0,
    );
    const height = contextHeight + actionHeight;
    if (index)
      flow.ensure(
        height <= flow.freshHeight()
          ? height
          : Math.min(contextHeight + 40, flow.freshHeight()),
      );
    flow.paragraph("Azioni preventive programmate il", displayDate(row.programmedDate));
    if (values.some(hasText))
      flow.table(headers, [values], weights, { rowFill: row.resolvedDate ? "#e4f3e6" : null });
    actions.forEach((action) => actionPackage(flow, action));
    flow.y += 8;
  });
  flow.box("Note aggiuntive:", state.preventive.notes, {
    minHeight: 80, anchorBottom: true,
  });
}

export async function makePdf(state, assets, { layout = false, includePdf = false } = {}) {
  await libraries();
  const api = window.PDFLib,
    pdf = await api.PDFDocument.create();
  pdf.registerFontkit(window.fontkit);
  const sources = new WeakMap();
  if (layout) for (const method of ["embedPng", "embedJpg"]) {
    const embed = pdf[method].bind(pdf);
    pdf[method] = async data => {
      const image = await embed(data);
      sources.set(image, { data, extension: method === "embedPng" ? "png" : "jpg" });
      return image;
    };
  }
  const fontPaths = {
    regular: "source-arial.ttf",
    bold: "source-arial-bold.ttf",
    fallback: "sans-regular.ttf",
    fallbackBold: "sans-bold.ttf",
  };
  const fonts = Object.fromEntries(
    await Promise.all(
      Object.entries(fontPaths).map(async ([key, file]) => [
        key,
        await pdf.embedFont(await resource("./assets/" + file), {
          subset: true,
        }),
      ]),
    ),
  );
  const imagePaths = {
    anniversary: "branding/anniversary.png",
    logo: "branding/logo.jpg",
    footer: "branding/footer.jpg",
    map: "map.jpg",
  };
  const images = Object.fromEntries(
    await Promise.all(
      Object.entries(imagePaths).map(async ([key, file]) => [
        key,
        file.endsWith(".png")
          ? await pdf.embedPng(await resource("./assets/" + file))
          : await pdf.embedJpg(await resource("./assets/" + file)),
      ]),
    ),
  );
  const report = new PdfReport(pdf, api, fonts, images, state, layout ? { sources } : null);
  identification(report, state, assets);
  const inspection = new Flow(report);
  historyAndCondition(inspection, state);
  diagnostics(inspection, state);
  priorities(inspection, state);
  await photographs(inspection, state);
  immediate(report, state);
  preventive(report, state);
  report.finish();
  const documentLayout = layout ? { pages: [...report.layoutPages.values()], tables: report.tables } : null;
  if (layout && !includePdf) return documentLayout;
  pdf.setTitle(baseName(state, assets));
  pdf.setAuthor(COMMON.company);
  pdf.setCreator("Schede Restauro " + VERSION);
  const blob = new Blob([await pdf.save()], { type: "application/pdf" });
  return layout ? { layout: documentLayout, pdf: blob } : blob;
}
