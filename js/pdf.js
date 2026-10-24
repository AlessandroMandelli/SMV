import {
  WINDOWS,
  METHODS,
  ROLES,
  STATUSES,
  displayDate,
  displayMonth,
  measureText,
  baseName,
} from "./model.js";

const WIDTH = 792,
  HEIGHT = 612,
  BOTTOM = 550;
const ATLAS_TITLE = [32, 227.8, 727.5, 20.5];
const IMMEDIATE_NOTES = [27, 456, 727, 100];
const PREVENTIVE_NOTES = [31, 466, 727, 87];
const files = new Map();
const normalize = (value) =>
  String(value ?? "")
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, "    ");
const hasText = (value) => normalize(value).trim().length > 0;
const diagnosisHasContent = (row) =>
  [
    row.area,
    row.element,
    row.pathology,
    row.causes,
    row.risk,
    row.resolvedDate,
  ].some(hasText);
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

/** Disegna sempre il modello originale. Le porzioni ripetute sono ritagli vettoriali,
 * non ricostruzioni dei font, dei grassetti, dei loghi o degli elenchi. */
class TemplateReport {
  constructor(pdf, templates, fonts, api) {
    this.pdf = pdf;
    this.templates = templates;
    this.fonts = fonts;
    this.api = api;
    this.overflow = [];
    this.used = new Map();
    this.coverage = new Map(
      Object.values(fonts).map((font) => [
        font,
        new Set(font.getCharacterSet()),
      ]),
    );
  }
  page(index) {
    const page = this.pdf.addPage([WIDTH, HEIGHT]);
    page.drawPage(this.templates[index]);
    this.used.set(page, [540, 365.5, 0, 218, 216][index]);
    return page;
  }
  slice(page, index, x, top, width, height, destX = x, destTop = top) {
    const { pushGraphicsState, popGraphicsState, rectangle, clip, endPath } =
      this.api;
    page.pushOperators(
      pushGraphicsState(),
      rectangle(destX, HEIGHT - destTop - height, width, height),
      clip(),
      endPath(),
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
  appendHeading(index, rect) {
    let page = this.pdf.getPages().at(-1);
    let top = (this.used.get(page) ?? BOTTOM) + 14;
    if (top + rect[3] > BOTTOM) {
      page = this.continuation(index);
      top = 30;
    }
    this.slice(page, index, ...rect, rect[0], top);
    return page;
  }
  continuation(index, heading) {
    const page = this.pdf.addPage([WIDTH, HEIGHT]);
    this.used.set(page, 0);
    this.slice(page, index, 0, 560, WIDTH, 52);
    if (index === 3 || index === 4) {
      this.slice(page, index, 0, 0, WIDTH, index === 3 ? 218 : 215);
      if (this.state) {
        const date =
          index === 3 ? this.state.immediate.date : this.state.preventive.date;
        sharedFields(this, page, this.state, date, false);
        if (index === 3) {
          this.hideUnless(
            page,
            hasText(this.state.immediate.executedDate),
            [121, 164.9, 620, 12.5],
          );
          this.fit(
            page,
            "Eseguiti in data",
            displayDate(this.state.immediate.executedDate),
            201,
            165.4,
            520,
            13,
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
        heading.top ?? 30,
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
      0,
    );
  }
  text(
    page,
    text,
    x,
    baseline,
    size = 9.5,
    { bold = false, color = this.api.rgb(0, 0, 0) } = {},
  ) {
    let run = "",
      font = null,
      position = x;
    const flush = () => {
      if (!run) return;
      page.drawText(run, {
        x: position,
        y: HEIGHT - baseline,
        size,
        font,
        color,
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
  fit(
    page,
    label,
    value,
    x,
    top,
    width,
    height,
    { color, bold = false, queue = true } = {},
  ) {
    if (!hasText(value)) return;
    let size = 9.5,
      lines;
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
      visible.forEach((line, i) =>
        this.text(page, line, x, top + 8.6 + i * size * 1.18, size, {
          color,
          bold,
        }),
      );
      if (queue)
        this.overflow.push({ label, text: lines.slice(take).join("\n") });
    } else
      lines.forEach((line, i) =>
        this.text(page, line, x, top + 8.6 + i * size * 1.18, size, {
          color,
          bold,
        }),
      );
  }
  check(page, x, top, size = 8) {
    this.mark(page, top + size);
    const c = this.api.rgb(0, 0.22, 0.42);
    page.drawLine({
      start: { x: x + 1, y: HEIGHT - top - size * 0.5 },
      end: { x: x + size * 0.4, y: HEIGHT - top - size * 0.88 },
      thickness: 1,
      color: c,
    });
    page.drawLine({
      start: { x: x + size * 0.4, y: HEIGHT - top - size * 0.88 },
      end: { x: x + size * 0.95, y: HEIGHT - top - size * 0.08 },
      thickness: 1,
      color: c,
    });
  }
  risk(page, value, x, top, width = 65) {
    const color = {
      BASSO: this.api.rgb(0.1, 0.43, 0.2),
      MEDIO: this.api.rgb(0.58, 0.42, 0),
      ALTO: this.api.rgb(0.72, 0.06, 0.06),
    }[value];
    this.fit(page, "Grado d’urgenza", value, x, top, width, 14, { color });
  }
  flushOverflow(index) {
    if (!this.overflow.length) return;
    const pending = this.overflow.splice(0);
    let page = this.continuation(index),
      y = index >= 3 ? 225 : 32;
    for (const item of pending) {
      if (y + 45 > BOTTOM) {
        page = this.continuation(index);
        y = index >= 3 ? 225 : 32;
      }
      this.text(page, item.label + " — continuazione", 34, y + 10, 9.5, {
        bold: true,
      });
      y += 24;
      for (const line of this.lines(item.text, 710, 9.5)) {
        if (y + 13 > BOTTOM) {
          page = this.continuation(index);
          y = index >= 3 ? 225 : 32;
          this.text(page, item.label + " — continuazione", 34, y + 10, 9.5, {
            bold: true,
          });
          y += 24;
        }
        this.text(page, line, 34, y + 9.5);
        y += 12;
      }
      y += 16;
    }
  }
}

function diagnostics(report, page, rows, titleTop) {
  const xs = [32.82, 151.88, 270.92, 418.72, 574.6, 666.76, 747.18];
  const headers = [32.58, 380.86, 714.84, 20.7];
  const entries = rows.filter(diagnosisHasContent);
  // La seconda pagina nasce vuota: copia soltanto il titolo e i dati presenti.
  report.slice(page, 1, 28, 347.3, 724, 18, 28, titleTop);
  if (!entries.length) return;
  const headerTop = titleTop + 32;
  report.slice(page, 1, ...headers, headers[0], headerTop);
  let current = page,
    y = headerTop + 20.94,
    bottom = BOTTOM,
    parity = 0;
  function next() {
    current = report.continuation(1);
    report.slice(current, 1, 32.58, 347.3, 714.84, 18, 32.58, 31);
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
      displayDate(row.resolvedDate),
    ];
    const wrapped = values.map((v, i) =>
      report.lines(v, xs[i + 1] - xs[i] - 9),
    );
    let offset = 0,
      total = Math.max(...wrapped.map((l) => l.length), 1);
    while (offset < total) {
      const desired = Math.max(17.14, (total - offset) * 11.4 + 6);
      if (y + desired > bottom && desired < 450) {
        next();
      }
      if (y + 18 > bottom) next();
      const count = Math.min(
          total - offset,
          Math.max(1, Math.floor((bottom - y - 6) / 11.4)),
        ),
        height = Math.max(17.14, count * 11.4 + 6);
      for (let c = 0; c < 6; c++) {
        current.drawRectangle({
          x: xs[c],
          y: HEIGHT - y - height,
          width: xs[c + 1] - xs[c],
          height,
          borderWidth: 0.48,
          borderColor: report.api.rgb(0.867, 0.867, 0.867),
          color:
            parity % 2
              ? report.api.rgb(0.957, 0.969, 0.965)
              : report.api.rgb(1, 1, 1),
        });
        const lines =
          offset > 0 && wrapped[c].length <= offset
            ? wrapped[c]
            : wrapped[c].slice(offset, offset + count);
        lines.forEach((line, j) => {
          if (c === 4)
            report.risk(
              current,
              line,
              xs[c] + 4,
              y + 3 + j * 11.4,
              xs[c + 1] - xs[c] - 8,
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
function history(report, page, state) {
  // Mantieni le fasce e i caratteri originali, ma fai scorrere i gruppi vuoti.
  let cursor = 46.5;
  report.slice(page, 1, 28, 28.5, 724, 18);
  for (const [key, top] of [
    ["restorations", 63.3],
    ["maintenance", 147.9],
  ]) {
    const rows = state.history[key].filter((row) =>
      [row.date, row.action].some(hasText),
    );
    const first = rows[0];
    const dateTop = key === "restorations" ? 80.2 : 162.5,
      actionTop = key === "restorations" ? 97.2 : 177.1;
    function fields(target, row, offset = 0, height = 38) {
      report.hideUnless(target, hasText(row.date), [
        35,
        dateTop + offset - 0.5,
        30,
        12,
      ]);
      report.hideUnless(target, hasText(row.action), [
        35,
        actionTop + offset - 0.5,
        39,
        12,
      ]);
      report.fit(
        target,
        "Data intervento precedente",
        displayMonth(row.date),
        66,
        dateTop + offset,
        650,
        14,
      );
      report.fit(
        target,
        "Azione precedente",
        row.action,
        74,
        actionTop + offset,
        665,
        height,
      );
    }
    if (first) {
      const start = cursor + 14;
      const end = hasText(first.action) ? actionTop + 38 : dateTop + 14;
      report.slice(page, 1, 35, top - 1, 710, end - top + 1, 35, start);
      fields(page, first, start - top + 1);
      cursor = start + end - top + 1;
    }
    for (const row of rows.slice(1)) {
      const continuation = report.continuation(1);
      report.slice(continuation, 1, 28, 28.5, 724, 18, 28, 29);
      report.slice(continuation, 1, 35, top - 3, 705, 69, 35, 65);
      fields(continuation, row, 68 - top, 400);
    }
  }
  const conditions = state.conditions.filter(
    (condition) =>
      [condition.exposure, condition.assessment].some(hasText) ||
      condition.methods.length,
  );
  const conditionTitleTop = cursor + 14;
  report.slice(page, 1, 28, 223, 724, 18, 28, conditionTitleTop);
  cursor = conditionTitleTop + 18;
  conditions.forEach((condition, i) => {
    let target = page,
      offset = 0;
    if (i) {
      target = report.continuation(1);
      report.slice(target, 1, 28, 223, 724, 110, 28, 30);
      offset = 193;
    } else {
      const start = cursor + 14;
      const end = hasText(condition.assessment)
        ? 332
        : condition.methods.length
          ? 292
          : 276;
      report.slice(page, 1, 35, 260.8, 710, end - 260.8, 35, start);
      offset = 260.8 - start;
      cursor = start + end - 260.8;
    }
    report.hideUnless(target, hasText(condition.exposure), [
      35,
      260.8 - offset,
      66,
      12,
    ]);
    report.hideUnless(target, condition.methods.length > 0, [
      35,
      277.5 - offset,
      710,
      14,
    ]);
    report.hideUnless(target, hasText(condition.assessment), [
      35,
      296.3 - offset,
      107,
      12,
    ]);
    report.fit(
      target,
      "Esposizione",
      condition.exposure,
      101,
      261.4 - offset,
      638,
      15,
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
      i ? 350 : 35,
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
    background,
  );
  report.hideUnless(
    page,
    hasText(row.risk) && hasText(row.window),
    [178.5, 58 - dy, 22, 13.5],
    background,
  );
  report.hideUnless(
    page,
    hasText(row.window),
    [206.8, 58 - dy, 500, 26.5],
    background,
  );
  report.hideUnless(
    page,
    hasText(row.anomalies),
    [206.8, 85.8 - dy, 78, 12],
    background,
  );
  report.risk(page, row.risk, 129, 58.7 - dy, 48);
  for (const [i, x] of [207.6, 392.2, 477.5, 576.8].entries())
    if (row.window === WINDOWS[i]) report.check(page, x, 74 - dy);
  report.fit(page, "Anomalie attese", row.anomalies, 285, 86.4 - dy, 452, 56);
}

async function inspectionEnd(report, state) {
  const priorities = state.priorities.filter((row) =>
    [row.risk, row.window, row.anomalies].some(hasText),
  );
  if (
    !priorities.length &&
    !hasText(state.inspectionNotes) &&
    !state.photos.length
  ) {
    // Senza priorità compilate ometti anche il relativo titolo.
    report.appendHeading(2, ATLAS_TITLE);
    return;
  }
  const page = report.page(2);
  priority(report, page, priorities[0]);
  report.hideUnless(page, hasText(state.inspectionNotes), [31, 155, 727, 60]);
  if (hasText(state.inspectionNotes)) report.mark(page, 214.5);
  report.fit(
    page,
    "Note aggiuntive",
    state.inspectionNotes,
    118,
    160.1,
    620,
    55,
  );
  if (!state.photos.length) report.clear(page, 31, 227, 729, 324);
  for (const row of priorities.slice(1)) {
    const continuation = report.continuation(2);
    report.slice(continuation, 2, 32.7, 28.4, 724.5, 114);
    priority(report, continuation, row);
  }
  if (state.photos.length) {
    report.mark(page, 248.3);
    await photographs(report, page, state.photos);
  }
  report.flushOverflow(2);
  if (!state.photos.length) report.appendHeading(2, ATLAS_TITLE);
}
async function photographs(report, page, photos) {
  // Rimuovi sfondo, bordi e segnaposto del modello, anche con l'atlante vuoto.
  report.clear(page, 31, 261.5, 729, 289.5);
  if (!photos.length) return;
  const gap = 12,
    width = (712 - gap) / 2;
  let target = page;
  for (let i = 0; i < photos.length; i++) {
    const slot = i % 4;
    if (i > 0 && slot === 0) {
      target = report.continuation(2);
      report.slice(target, 2, 32, 227, 725, 20, 32, 30);
    }
    const startTop = i < 4 ? 263 : 65,
      height = (540 - startTop - gap) / 2,
      top = startTop + Math.floor(slot / 2) * (height + gap),
      x = 35 + (slot % 2) * (width + gap);
    const photo = photos[i],
      encoded = photo.data.split(",")[1];
    let bitmap;
    if (photo.data.startsWith("data:image/png"))
      bitmap = await report.pdf.embedPng(encoded);
    else if (photo.data.startsWith("data:image/jpeg"))
      bitmap = await report.pdf.embedJpg(encoded);
    else throw Error("Per il PDF usa fotografie JPEG o PNG.");
    const scale = Math.min(width / bitmap.width, height / bitmap.height),
      w = bitmap.width * scale,
      h = bitmap.height * scale;
    target.drawImage(bitmap, {
      x: x + (width - w) / 2,
      y: HEIGHT - top - (height + h) / 2,
      width: w,
      height: h,
    });
  }
}
function sharedFields(report, page, state, date, queue = true) {
  report.fit(page, "ID Scheda", state.general.id, 178, 60.9, 300, 12, {
    queue,
  });
  report.fit(page, "Data", displayDate(date), 152, 75.5, 320, 12, { queue });
  report.fit(page, "Oggetto", state.general.object, 165, 102.6, 568, 12, {
    queue,
  });
}
function immediate(report, state) {
  let page = report.page(3);
  sharedFields(report, page, state, state.immediate.date);
  report.hideUnless(
    page,
    hasText(state.immediate.executedDate),
    [121, 164.9, 620, 12.5],
  );
  report.fit(
    page,
    "Eseguiti in data",
    displayDate(state.immediate.executedDate),
    201,
    165.4,
    520,
    13,
  );
  const rows = state.immediate.records.filter((row) =>
    [row.area, row.action].some(hasText),
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
      192,
    );
  }
  if (!rows.length) fields(page, { area: "", action: "" });
  rows.forEach((row, i) => {
    if (i) {
      page = report.continuation(3);
      report.slice(page, 3, 28, 232, 736, 36);
      report.hideUnless(
        page,
        hasText(state.immediate.executedDate),
        [121, 164.9, 620, 12.5],
      );
    }
    fields(page, row);
  });
  if (hasText(state.immediate.notes)) report.slice(page, 3, ...IMMEDIATE_NOTES);
  report.fit(
    page,
    "Note aggiuntive",
    state.immediate.notes,
    114,
    461.2,
    624,
    77,
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
    report.fit(page, "Finestra d’intervento", action.window, 318, 296, 420, 14);
  }
  if (hasText(action.risk) && hasText(action.window))
    report.slice(page, 4, 184.5, 295.5, 20, 11.8);
  // Ogni etichetta e ogni pallino rimangono quelli vettoriali del modello.
  const fields = [
    ["Descrizione", action.description, 317, 335.45, 128, 324.5],
    ["Azione", action.action, 335.45, 346.95, 141, 336.02],
    ["Obiettivo", action.objective, 346.95, 358.45, 151, 347.54],
    ["Operatore", action.operator, 358.45, 369.7, 156, 359],
  ];
  const heights = fields.map(([, value, top, bottom, x]) => {
    const lines = hasText(value) ? report.lines(value, 740 - x).length : 0;
    return Math.max(bottom - top, lines > 1 ? lines * 11.3 : 0);
  });
  const extra = heights.reduce(
    (sum, height, i) => sum + height - (fields[i][3] - fields[i][2]),
    0,
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
        extra < 38 ? heights[i] : bottom - top,
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
      9,
    );
  }
  if (STATUSES.includes(action.status)) {
    report.slice(page, 4, 340.5, 369.7, 284.5, 16.1, 340.5, 369.7 + shift);
    report.check(
      page,
      [383.8, 469.1, 568.4][STATUSES.indexOf(action.status)],
      376 + shift,
      9,
    );
  }
}
function preventive(report, state) {
  const actionHasContent = (action) =>
    Object.entries(action).some(
      ([key, value]) => key !== "id" && hasText(value),
    );
  const records = state.diagnosis.filter(
    (row) =>
      [row.area, row.element, row.pathology].some(hasText) ||
      row.actions.some(actionHasContent),
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
      sharedFields(report, page, state, state.preventive.date);
      report.clear(page, ...PREVENTIVE_NOTES);
      // Senza dati nascondi anche l'intestazione della tabella del modello.
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
        14,
      );
      preventiveFields(report, page, action);
      report.flushOverflow(4);
    }
  }
  if (hasText(state.preventive.notes))
    report.slice(last, 4, ...PREVENTIVE_NOTES);
  report.fit(
    last,
    "Note aggiuntive",
    state.preventive.notes,
    118,
    470.9,
    620,
    70,
  );
}

export async function makePdf(state, assets) {
  await libraries();
  const api = window.PDFLib;
  const [template, regular, bold, fallback, fallbackBold] = await Promise.all(
    [
      "./assets/pdf-template.pdf",
      "./assets/source-arial.ttf",
      "./assets/source-arial-bold.ttf",
      "./assets/sans-regular.ttf",
      "./assets/sans-bold.ttf",
    ].map(resource),
  );
  const source = await api.PDFDocument.load(template),
    pdf = await api.PDFDocument.create();
  pdf.registerFontkit(window.fontkit);
  const templates = await pdf.embedPages(source.getPages());
  const fonts = {
    regular: await pdf.embedFont(regular, { subset: true }),
    bold: await pdf.embedFont(bold, { subset: true }),
    fallback: await pdf.embedFont(fallback, { subset: true }),
    fallbackBold: await pdf.embedFont(fallbackBold, { subset: true }),
  };
  const report = new TemplateReport(pdf, templates, fonts, api),
    g = state.general;
  report.state = state;
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
    ["Profondità P", measureText(g.depth), 279, 423.8, 118, 14],
    ["Materie e Tecniche", g.materials, 126, 440.7, 271, 89],
  ])
    report.fit(page1, label, value, x, top, w, h);
  const map = { x: 466.5, y: 63.1, w: 254.1, h: 462.9 };
  for (const asset of assets) {
    const x = map.x + (asset.x / 100) * map.w - 4,
      y = map.y + (asset.y / 100) * map.h - 4;
    page1.drawRectangle({
      x,
      y: HEIGHT - y - 8,
      width: 8,
      height: 8,
      borderWidth: 0.6,
      borderColor: api.rgb(0, 0.22, 0.42),
      color: api.rgb(1, 1, 1),
    });
    if (asset.id === state.assetId) report.check(page1, x, y, 8);
  }
  report.flushOverflow(0);
  const page2 = report.continuation(1);
  const diagnosisTop = history(report, page2, state);
  diagnostics(report, page2, state.diagnosis, diagnosisTop);
  report.flushOverflow(1);
  await inspectionEnd(report, state);
  immediate(report, state);
  report.flushOverflow(3);
  preventive(report, state);
  report.flushOverflow(4);
  pdf.setTitle(baseName(state, assets));
  pdf.setAuthor("Cròmo s.c.ar.l.");
  pdf.setCreator("Schede Restauro 2.6");
  return new Blob([await pdf.save()], { type: "application/pdf" });
}
