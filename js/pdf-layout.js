import { COMMON, displayDate, isGeneralBold } from "./model.js";

/** Unità in punti PDF. Margini di 10,16 mm, come nel Word. */
export const PAGE = Object.freeze({
  width: 792,
  height: 612,
  margin: 28.8,
  bottom: 550,
});
export const BODY_WIDTH = PAGE.width - PAGE.margin * 2;
export const TYPE = Object.freeze({
  body: 9.5,
  leading: 11.4,
  section: 10,
  title: 13,
});
const clean = (value) =>
  String(value ?? "")
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/ {2,}/g, "\t");
export const hasText = (value) => clean(value).trim().length > 0;
export const COLORS = Object.freeze({
  ink: "#1e3232",
  green: "#005b60",
  border: "#d9dddd",
  header: "#b9b9b9",
  alternate: "#f4f7f6",
  priority: "#e8f1f2",
  notes: "#f2f2f2",
});
export const riskColor = (value) =>
  ({ BASSO: "#196e33", MEDIO: "#946b00", ALTO: "#b81010" })[value] ||
  COLORS.ink;

/** Primitive native: testo, righe, rettangoli e sole immagini originali. */
export class PdfReport {
  constructor(pdf, api, fonts, images, state, capture = null) {
    Object.assign(this, { pdf, api, fonts, images, state });
    this.capture = capture;
    this.layoutPages = new Map();
    this.tableCounter = 0;
    this.activeTable = null;
    this.tables = {};
    this.glyphWidths = new Map();
    this.photoImages = new Map();
    this.characters = new Map(
      Object.values(fonts).map((font) => [
        font,
        new Set(font.getCharacterSet()),
      ]),
    );
  }
  record(page, operation) {
    if (this.capture) this.layoutPages.get(page)?.push({ ...operation, table: this.activeTable });
  }
  beginTable(headers, widths) {
    if (!this.capture) return;
    this.activeTable = ++this.tableCounter;
    this.tables[this.activeTable] = { headers, widths };
  }
  endTable() { this.activeTable = null; }
  color(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    return this.api.rgb(
      ((n >> 16) & 255) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255,
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
        if (char === "\t") return (Math.floor(total / 36) + 1) * 36;
        if (char === "\n") return total;
        const font = this.font(char, bold);
        if (!this.glyphWidths.has(font)) this.glyphWidths.set(font, new Map());
        const sizes = this.glyphWidths.get(font);
        if (!sizes.has(size)) sizes.set(size, new Map());
        const glyphs = sizes.get(size);
        if (!glyphs.has(char)) glyphs.set(char, font.widthOfTextAtSize(char, size));
        return total + glyphs.get(char);
      },
      0,
    );
  }
  photoImage(photo) {
    if (!this.photoImages.has(photo.data)) {
      const embed = photo.data.startsWith("data:image/png") ? "embedPng" :
        photo.data.startsWith("data:image/jpeg") ? "embedJpg" : null;
      if (!embed) throw Error("Le fotografie per il PDF devono essere JPEG o PNG.");
      this.photoImages.set(photo.data, this.pdf[embed](photo.data.split(",")[1]));
    }
    return this.photoImages.get(photo.data);
  }
  text(
    page,
    value,
    x,
    top,
    { size = TYPE.body, bold = false, color = COLORS.ink } = {},
  ) {
    const valueText = clean(value);
    if (!hasText(valueText)) return;
    this.record(page, { type: "text", text: valueText, x, top, size, bold, color, width: this.width(valueText, size, bold) });
    let run = "",
      font = null,
      at = x;
    const flush = () => {
      if (!run) return;
      if (hasText(run))
        page.drawText(run, {
          x: at,
          y: PAGE.height - top - size * 0.905,
          size,
          font,
          color: this.color(color),
        });
      at += font.widthOfTextAtSize(run, size);
      run = "";
    };
    for (const char of valueText) {
      if (char === "\n") continue;
      if (char === "\t") { flush(); at = x + (Math.floor((at - x) / 36) + 1) * 36; continue; }
      const next = this.font(char, bold);
      if (font && next !== font) flush();
      font = next;
      run += char;
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
      ...(fill ? { color: this.color(fill) } : {}),
      ...(border ? { borderColor: this.color(border), borderWidth } : {}),
    });
  }
  image(page, image, x, top, width, height) {
    this.record(page, { type: "image", source: this.capture?.sources.get(image), x, top, width, height });
    page.drawImage(image, { x, y: PAGE.height - top - height, width, height });
  }
  band(page, title, top, x = PAGE.margin, width = BODY_WIDTH) {
    this.rect(page, x, top, width, 18, { fill: COLORS.green });
    this.text(page, title, x + 4, top + 3.2, {
      size: TYPE.section,
      bold: true,
      color: "#ffffff",
    });
  }
  checkbox(
    page,
    x,
    top,
    label,
    selected,
    { size = 8.2, fontSize = TYPE.body } = {},
  ) {
    this.rect(page, x, top, size, size, {
      fill: "#ffffff",
      border: COLORS.ink,
      borderWidth: 0.65,
    });
    if (selected) {
      const line = (a, b) =>
        page.drawLine({
          start: { x: x + a[0], y: PAGE.height - top - a[1] },
          end: { x: x + b[0], y: PAGE.height - top - b[1] },
          thickness: 0.9,
          color: this.color(COLORS.green),
        });
      line([1, size * 0.52], [size * 0.4, size * 0.87]);
      line([size * 0.4, size * 0.87], [size - 1, 1]);
    }
    if (label)
      this.text(page, label, x + size + 4, top - 0.4, { size: fontSize });
  }
  choiceLines(options, width, size = TYPE.body) {
    const lines = [];
    let line = [],
      used = 0;
    for (const label of options) {
      const w = this.width(label, size) + 22;
      if (line.length && used + w > width) {
        lines.push(line);
        line = [];
        used = 0;
      }
      line.push({ label, offset: used });
      used += w;
    }
    if (line.length) lines.push(line);
    return lines;
  }
  choices(page, options, selected, x, top, width) {
    const lines = this.choiceLines(options, width);
    lines.forEach((line, i) =>
      line.forEach((item) =>
        this.checkbox(
          page,
          x + item.offset,
          top + i * 16,
          item.label,
          Array.isArray(selected)
            ? selected.includes(item.label)
            : selected === item.label,
        ),
      ),
    );
    return lines.length * 16;
  }
  label(
    page,
    label,
    value,
    x,
    top,
    width,
    { bold = true, boldValue = false, size = TYPE.body, valueSize = size, minHeight = 12.5 } = {},
  ) {
    const valueX = x + this.width(label, size, bold) + 5;
    const leading = Math.max(TYPE.leading, valueSize * 1.2);
    const valueTop = top + (size - valueSize) * 0.905;
    const lines = this.wrap(value, Math.max(25, width - (valueX - x)), valueSize, boldValue);
    this.text(page, label, x, top, { bold, size });
    lines.forEach((line, i) =>
      this.text(page, line, valueX, valueTop + i * leading, { size: valueSize, bold: boldValue }),
    );
    return Math.max(minHeight, lines.length * leading);
  }
  header(page, kind, meta) {
    const x = PAGE.margin + 92;
    this.image(page, this.images.anniversary, PAGE.margin, 31.6, 70.6, 15);
    this.image(page, this.images.logo, PAGE.margin, 62.5, 70.6, 108.5);
    this.text(
      page,
      kind === "immediate"
        ? "REGISTRO INTERVENTI DI MANUTENZIONE IMMEDIATA"
        : "PROGRAMMAZIONE AZIONI PREVENTIVE",
      x,
      29.2,
      { size: 13, bold: true, color: COLORS.green },
    );
    let y = 60.8;
    for (const [label, value] of [
      ["ID Scheda:", this.state.general.id],
      ["Data:", hasText(this.state.general.date) ? displayDate(meta.date) : ""],
    ]) {
      const valueSize = label === "ID Scheda:" ? 12 : TYPE.body;
      const boldValue = label === "ID Scheda:" && isGeneralBold(this.state, "id");
      const valueWidth = 346.6 - this.width(label, TYPE.body, true) - 5;
      const height = Math.max(
        14.5,
        this.wrap(value, valueWidth, valueSize, boldValue).length * Math.max(TYPE.leading, valueSize * 1.2) + 3,
      );
      this.rect(page, x - 1, y - 2, 356.6, height, {
        fill: "#d9d9d9",
      });
      this.label(page, label, value, x, y, 346.6, {
        minHeight: height, boldValue, valueSize,
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
      { boldValue: isGeneralBold(this.state, "object") },
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
      620,
    );
    return Math.max(194, y + 16);
  }
  page(kind = "inspection", meta = {}, { continuation = false } = {}) {
    const page = this.pdf.addPage([PAGE.width, PAGE.height]);
    if (this.capture) {
      this.layoutPages.set(page, []);
      for (const method of ["drawLine", "drawCircle"]) {
        const draw = page[method].bind(page);
        page[method] = options => { this.record(page, { type: method, ...options }); return draw(options); };
      }
    }
    const y =
      !continuation && ["immediate", "preventive"].includes(kind)
        ? this.header(page, kind, meta)
        : PAGE.margin;
    return { page, y };
  }
  finish() {
    const pages = this.pdf.getPages();
    const footer =
      "Via Matteotti 8, 21030 Castello Cabiaglio (VA) – C.F./P.IVA 02507710396 – info@cromorestauri.com – PEC – cromorestauri@sicurezzapostale.it";
    pages.forEach((page, i) => {
      this.image(page, this.images.footer, PAGE.margin, 563, 113.5, 34.9);
      this.text(page, "s.c.ar.l.", PAGE.margin + 120, 583, {
        size: 11,
        color: "#d8a30a",
      });
      let size = 7.5;
      while (this.width(footer, size) > BODY_WIDTH - 166 && size > 5.5)
        size -= 0.25;
      this.text(page, footer, PAGE.margin + 166, 586, { size });
      const count = `${i + 1}/${pages.length}`;
      this.text(
        page,
        count,
        PAGE.width - PAGE.margin - this.width(count, 7.5),
        586,
        { size: 7.5 },
      );
    });
  }
}

/** Cursore di impaginazione: ogni blocco prosegue prima delle sezioni seguenti. */
export class Flow {
  constructor(report, kind = "inspection", meta = {}, region = {}) {
    Object.assign(this, {
      report,
      kind,
      meta,
      x: PAGE.margin,
      width: BODY_WIDTH,
    });
    Object.assign(
      this,
      region.page
        ? { page: region.page, y: region.y }
        : report.page(kind, meta),
    );
    Object.assign(this, region);
  }
  next() {
    Object.assign(
      this,
      this.report.page(this.kind, this.meta, { continuation: true }),
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
  paragraphHeight(
    label,
    value,
    { size = TYPE.body, labelSize = size, indent = 0, boldLabel = true, boldValue = false } = {},
  ) {
    const start = label
      ? this.report.width(label, labelSize, boldLabel) + 5
      : 0;
    return (
      this.report.wrap(value, this.width - indent - start, size, boldValue).length *
        (Math.max(size, labelSize) * 1.2) +
      6
    );
  }
  paragraph(
    label,
    value,
    {
      showEmpty = false,
      size = TYPE.body,
      labelSize = size,
      indent = 0,
      boldLabel = true,
      boldValue = false,
      color = COLORS.ink,
      keepTogether = true,
      after = 6,
    } = {},
  ) {
    if (!showEmpty && !hasText(value)) return;
    const start = label
      ? this.report.width(label, labelSize, boldLabel) + 5
      : 0;
    const leading = Math.max(size, labelSize) * 1.2;
    const lines = this.report.wrap(
      value,
      Math.max(30, this.width - indent - start),
      size,
      boldValue,
    );
    const height = lines.length * leading + after;
    if (keepTogether && height <= this.freshHeight()) this.ensure(height);
    let offset = 0;
    while (offset < lines.length) {
      if (this.y + leading > PAGE.bottom) this.next();
      const count = Math.max(1, Math.floor((PAGE.bottom - this.y) / leading));
      if (label)
        this.report.text(this.page, label, this.x + indent, this.y, {
          size: labelSize,
          bold: boldLabel,
        });
      lines
        .slice(offset, offset + count)
        .forEach((line, i) =>
          this.report.text(
            this.page,
            line,
            this.x + indent + start,
            this.y + i * leading,
            { size, color, bold: boldValue },
          ),
        );
      const taken = Math.min(count, lines.length - offset);
      this.y += taken * leading;
      offset += taken;
      if (offset < lines.length) this.next();
    }
    this.y += after;
  }
  box(label, value, { fill = COLORS.notes, minHeight = 40, anchorBottom = false } = {}) {
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
        Math.floor((PAGE.bottom - this.y - 26) / TYPE.leading),
      );
      const taken = Math.min(count, lines.length - offset);
      const height = Math.max(
        Math.min(minHeight, PAGE.bottom - this.y),
        26 + taken * TYPE.leading,
      );
      if (anchorBottom && offset + taken === lines.length) this.y = Math.max(this.y, PAGE.bottom - height);
      this.report.rect(this.page, this.x, this.y, this.width, height, {
        fill,
        border: COLORS.green,
        borderWidth: 0.5,
      });
      this.report.text(this.page, label, this.x + 4, this.y + 4, {
        bold: true,
      });
      lines
        .slice(offset, offset + taken)
        .forEach((line, i) =>
          this.report.text(
            this.page,
            line,
            this.x + 4,
            this.y + 19 + i * TYPE.leading,
          ),
        );
      this.y += height + 12;
      offset += taken;
      if (offset < lines.length) this.next();
    }
  }
  table(headers, rows, proportions, { riskColumn = -1, rowFill = null } = {}) {
    if (!rows.length) return;
    const resolutionColumn = headers.findIndex(title => /^risolto in data$/i.test(title));
    rows = rows.map(row => row.map((value, i) =>
      i === resolutionColumn && !hasText(value) ? "-" : value));
    const isBold = (value, i) => i === resolutionColumn && value !== "-";
    const total = proportions.reduce((a, b) => a + b, 0);
    const widths = proportions.map((w) => (w / total) * this.width);
    this.report.beginTable(headers, widths);
    const xs = [this.x];
    widths.forEach((w) => xs.push(xs.at(-1) + w));
    const headerHeight = Math.max(
      20,
      ...headers.map(
        (h, i) =>
          this.report.wrap(h, widths[i] - 8, 9.5, true).length * 11.4 + 8,
      ),
    );
    const header = () => {
      this.report.rect(this.page, this.x, this.y, this.width, headerHeight, {
        fill: COLORS.header,
      });
      headers.forEach((h, i) =>
        this.report
          .wrap(h, widths[i] - 8, 9.5, true)
          .forEach((line, j) =>
            this.report.text(
              this.page,
              line,
              xs[i] + 4,
              this.y + 4 + j * 11.4,
              { size: 9.5, bold: true, color: "#ffffff" },
            ),
          ),
      );
      this.y += headerHeight;
    };
    const firstRowHeight = Math.max(...rows[0].map((value, i) =>
      this.report.wrap(value, widths[i] - 8, TYPE.body, isBold(value, i)).length)) * TYPE.leading + 8;
    this.ensure(headerHeight + Math.min(firstRowHeight, this.freshHeight() - headerHeight));
    header();
    const next = () => {
      this.next();
      header();
    };
    rows.forEach((row, index) => {
      const cells = row.map((value, i) =>
        this.report.wrap(value, widths[i] - 8, TYPE.body, isBold(value, i)),
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
          Math.max(1, Math.floor((PAGE.bottom - this.y - 8) / TYPE.leading)),
        );
        const height = count * TYPE.leading + 8;
        cells.forEach((lines, i) => {
          this.report.rect(this.page, xs[i], this.y, widths[i], height, {
            fill: rowFill || (index % 2 ? COLORS.alternate : "#ffffff"),
            border: COLORS.border,
          });
          const fragment =
            offset > 0 && lines.length <= offset
              ? lines
              : lines.slice(offset, offset + count);
          fragment
            .slice(0, count)
            .forEach((line, j) =>
              this.report.text(
                this.page,
                line,
                i === resolutionColumn && row[i] === "-"
                  ? xs[i] + (widths[i] - this.report.width(line)) / 2 : xs[i] + 4,
                this.y + (i === resolutionColumn && row[i] === "-" ? (height - TYPE.body) / 2 : 4) + j * TYPE.leading,
                { color: i === riskColumn ? riskColor(row[i]) : COLORS.ink,
                  bold: isBold(row[i], i) },
              ),
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
}
