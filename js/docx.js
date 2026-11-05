import {
  COMMON, METHODS, ROLES, STATUSES, windowsForRisk, diagnosisHasContent,
  displayDate, measureText, baseName, isGeneralBold,
} from "./model.js";
import {
  surveyEntries, allPhotos, preventiveGroups, maintenanceEntries,
} from "./surveys.js";
import { ROAD_POINTS, ROAD_SIZE, mapAssets } from "./road.js";
import { zipLibrary } from "./zip.js";
import { VERSION } from "./config.js";

// Struttura della 3.4.3: paragrafi, sfondi, tabelle e immagini in linea Word.
// Il documento cresce con il testo e non usa forme VML o caselle sovrapposte.
const WIDTH = 14688;
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
const esc = value => String(value ?? "").normalize("NFC").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
const filled = value => String(value ?? "").trim().length > 0;
const any = (row, keys) => keys.some(key => filled(row[key]));
const actionFilled = action => Object.entries(action).some(([key, value]) => key !== "id" && filled(value));
const riskColor = risk => ({ ALTO: "FF0000", MEDIO: "AA8000", BASSO: "138138" })[risk] || "1E3232";

function run(value, { bold = false, size = 19, color = "1E3232", font = "Arial" } = {}) {
  const text = String(value ?? "").normalize("NFC").replace(/\r\n?/g, "\n").replace(/ {2,}/g, "\t").split(/(\n|\t)/).map(part =>
    part === "\n" ? "<w:br/>" : part === "\t" ? "<w:tab/>" : `<w:t xml:space="preserve">${esc(part)}</w:t>`,
  ).join("");
  return `<w:r><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:eastAsia="${font}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/><w:color w:val="${color}"/>${bold ? "<w:b/>" : ""}</w:rPr>${text}</w:r>`;
}
function para(content = "", { keep = false, after = 90, before = 0, align = "left", shade, bullet = -1, style, separator = false, line, indent = 0 } = {}) {
  const imageHeight = content.match(/<wp:extent[^>]*cy="(\d+)"/);
  const spacing = imageHeight ? `w:line="${Math.ceil(Number(imageHeight[1]) / 635 + 40)}" w:lineRule="atLeast"` : line ? `w:line="${Math.round(line * 20)}" w:lineRule="atLeast"` : 'w:line="228" w:lineRule="auto"';
  return `<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ""}${keep ? "<w:keepNext/>" : ""}${indent ? `<w:ind w:left="${indent}"/>` : ""}<w:widowControl/><w:spacing w:before="${before}" w:after="${after}" ${spacing}/><w:jc w:val="${align}"/>${separator ? '<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="0" w:color="FFFFFF"/></w:pBdr>' : ""}${shade ? `<w:shd w:fill="${shade}"/>` : ""}${bullet >= 0 ? `<w:numPr><w:ilvl w:val="${bullet}"/><w:numId w:val="1"/></w:numPr>` : ""}</w:pPr>${content}</w:p>`;
}
const blank = () => para("", { after: 0 });
const pageBreak = () => '<w:p><w:pPr><w:pageBreakBefore/><w:keepNext/><w:spacing w:before="0" w:after="0" w:line="1" w:lineRule="exact"/></w:pPr></w:p>';
function label(title, value, { always = false, boldValue = false, ...options } = {}) {
  return always || filled(value) ? para(run(title, { bold: true }) + run(" " + (value ?? ""), { bold: boldValue }), options) : "";
}
const band = (title, keep = true) => para(run(title, { bold: true, size: 20, color: "FFFFFF" }), { before: 100, after: 0, shade: "005B60", keep, separator: true, line: 18 }) + `<w:p><w:pPr>${keep ? "<w:keepNext/>" : ""}<w:spacing w:before="0" w:after="0" w:line="120" w:lineRule="exact"/></w:pPr></w:p>`;
const choices = (options, selected) => options.map(option => run((Array.isArray(selected) ? selected.includes(option) : selected === option) ? "☑ " : "☐ ", { font: "DejaVu Sans" }) + run(option)).join(run("\t"));
function scaled(weights, total = WIDTH) {
  const sum = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map(weight => Math.round(weight / sum * total));
  widths[widths.length - 1] += total - widths.reduce((a, b) => a + b, 0);
  return widths;
}
function table(rows, widths, { border = true, headers = false, stripe = headers, keepRows = true, padding = 70, shade, borderColor = "D9DDDD", minHeight = 0, bottom = false } = {}) {
  const borders = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(side =>
    `<w:${side} w:val="${border ? "single" : "nil"}" w:sz="4" w:color="${borderColor}"/>`,
  ).join("");
  const position = bottom ? '<w:tblpPr w:horzAnchor="margin" w:vertAnchor="margin" w:tblpX="0" w:tblpYSpec="bottom" w:topFromText="120" w:bottomFromText="0" w:leftFromText="0" w:rightFromText="0"/><w:tblOverlap w:val="never"/>' : "";
  const body = rows.map((row, index) => {
    let column = 0;
    const cells = row.map(value => {
      const cell = typeof value === "string" ? { content: value } : value;
      const span = cell.span || 1, width = widths.slice(column, column + span).reduce((a, b) => a + b, 0);
      column += span;
      const fill = cell.shade || shade || (headers && index === 0 ? "B9B9B9" : stripe ? index % 2 === 0 ? "F4F7F6" : "FFFFFF" : "");
      return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${span > 1 ? `<w:gridSpan w:val="${span}"/>` : ""}<w:vAlign w:val="${cell.center ? "center" : "top"}"/>${fill ? `<w:shd w:fill="${fill}"/>` : ""}</w:tcPr>${cell.content || blank()}${cell.content?.endsWith("</w:tbl>") ? '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="2" w:lineRule="exact"/></w:pPr></w:p>' : ""}</w:tc>`;
    }).join("");
    return `<w:tr><w:trPr>${keepRows ? "<w:cantSplit/>" : ""}${headers && index === 0 ? "<w:tblHeader/>" : ""}${minHeight ? `<w:trHeight w:val="${minHeight}" w:hRule="atLeast"/>` : ""}</w:trPr>${cells}</w:tr>`;
  }).join("");
  return `<w:tbl><w:tblPr>${position}<w:tblW w:w="${widths.reduce((a, b) => a + b, 0)}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders>${borders}</w:tblBorders><w:tblCellMar>${['top', 'left', 'bottom', 'right'].map(side => `<w:${side} w:w="${padding}" w:type="dxa"/>`).join("")}</w:tblCellMar></w:tblPr><w:tblGrid>${widths.map(width => `<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid>${body}</w:tbl>`;
}
function dataTable(headers, rows, weights, { rowFill = "" } = {}) {
  if (!rows.length) return "";
  return table([headers.map(text => para(run(text, { bold: true, color: "FFFFFF" }), { after: 0 })),
    ...rows.map(row => row.map((text, index) => {
      const resolution = /^risolto in data$/i.test(headers[index]);
      const empty = resolution && !filled(text);
      return { content: para(run(empty ? "-" : text, {
        bold: resolution && !empty,
        color: /livello di rischio/i.test(headers[index]) ? riskColor(text) : "1E3232",
      }), { after: 0, align: empty ? "center" : "left" }), shade: rowFill, center: empty };
    }))], scaled(weights), { headers: true }) + blank();
}
function note(value, height = 1200) {
  return filled(value) ? table([[para(run("Note aggiuntive:", { bold: true }), { keep: true, after: 70, align: "left" }) + para(run(value), { after: 0, align: "left" })]], [WIDTH], { shade: "F2F2F2", borderColor: "005B60", minHeight: height, bottom: true, keepRows: false }) + blank() : "";
}
async function bytes(path) {
  const response = await fetch(path);
  if (!response.ok) throw Error("Risorsa Word non disponibile: " + path);
  return new Uint8Array(await response.arrayBuffer());
}
async function mapImage(state, assets) {
  const blob = new Blob([await bytes("./assets/map.jpg")], { type: "image/jpeg" });
  let image, url;
  try {
    if (typeof createImageBitmap === "function") image = await createImageBitmap(blob);
    else { url = URL.createObjectURL(blob); image = new Image(); image.src = url; await image.decode(); }
    const canvas = document.createElement("canvas");
    canvas.width = ROAD_SIZE.width; canvas.height = ROAD_SIZE.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw Error("Impossibile preparare la planimetria Word.");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (state.assetId === "strada") {
      ctx.strokeStyle = "#d90d14"; ctx.lineWidth = 5.4; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ROAD_POINTS.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    }
    for (const asset of mapAssets(assets, state.assetId)) {
      const x = asset.x / 100 * canvas.width - 8.7, y = asset.y / 100 * canvas.height - 8.7;
      ctx.fillStyle = "white"; ctx.strokeStyle = "#1e3232"; ctx.lineWidth = 1.7;
      ctx.fillRect(x, y, 17.4, 17.4); ctx.strokeRect(x, y, 17.4, 17.4);
      if (asset.id === state.assetId) {
        ctx.strokeStyle = "#005b60"; ctx.lineWidth = 2.4; ctx.beginPath();
        ctx.moveTo(x + 3, y + 8); ctx.lineTo(x + 7, y + 15); ctx.lineTo(x + 15, y + 3); ctx.stroke();
      }
    }
    return canvas.toDataURL("image/png").split(",")[1];
  } finally { image?.close?.(); if (url) URL.revokeObjectURL(url); }
}

export async function makeDocx(state, assets) {
  const Zip = await zipLibrary(), zip = new Zip(), rels = [], media = [], imageIds = new Map();
  let drawingId = 0;
  function addImage(data, extension, base64 = false) {
    if (imageIds.has(data)) return imageIds.get(data);
    const id = "image" + (media.length + 1), name = id + "." + extension;
    zip.file("word/media/" + name, data, { base64 });
    rels.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`);
    media.push(id); imageIds.set(data, id); return id;
  }
  function image(id, width, height, description) {
    const cx = Math.round(width * 12700), cy = Math.round(height * 12700);
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${++drawingId}" name="${id}" descr="${esc(description)}"/><wp:cNvGraphicFramePr/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${media.indexOf(id) + 1}" name="${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  }
  const anniversary = addImage(await bytes("./assets/branding/anniversary.png"), "png");
  const logo = addImage(await bytes("./assets/branding/logo.jpg"), "jpg");
  const footerLogo = addImage(await bytes("./assets/branding/footer.jpg"), "jpg");
  const map = addImage(await mapImage(state, assets), "png", true);
  const branding = () => para(image(anniversary, 70.6, 15, "Anniversario"), { after: 140 }) + para(image(logo, 70.6, 108.5, "Logo"), { after: 0 });
  const g = state.general;
  function heading(title, date, first = false) {
    let metadata = para(run(title, { bold: true, size: 26, color: "005B60" }), { after: 210, style: "Title" });
    metadata += label("ID Scheda:", g.id, { always: true, shade: "D9D9D9", after: 0, boldValue: isGeneralBold(state, "id") });
    metadata += label("Data:", displayDate(date), { always: true, shade: "D9D9D9", after: first ? 0 : 180 });
    if (first) {
      metadata += label("Ora:", g.time, { always: true, shade: "D9D9D9", after: 160 });
      metadata += para(run("Operatore: " + COMMON.operator, { bold: true }), { after: 90 });
      for (const text of [COMMON.company + " – " + COMMON.address, COMMON.email, "PEC – " + COMMON.pec]) metadata += para(run(text, { size: 16 }), { after: 20 });
    } else {
      for (const [title, value, key] of [["Oggetto:", g.object, "object"], ["Operatori:", COMMON.company], ["Restauratore capofila:", COMMON.operator], ["Interventi autorizzati da:", COMMON.authorization]]) metadata += label(title, value, { always: true, boldValue: isGeneralBold(state, key) });
    }
    return table([[branding(), metadata]], [1600, first ? 5824 : WIDTH - 1600], { border: false, padding: 0, keepRows: false }) + blank();
  }
  let left = heading("SCHEDA DI ISPEZIONE PERIODICA", g.date, true) + band("1. IDENTIFICAZIONE DEL BENE");
  for (const [title, value, key] of [["Oggetto:", g.object, "object"], ["Cronologia:", g.chronology], ["Autore:", g.author], ["Quota s.l.m.:", measureText(g.altitude)], ["Distanza Santuario:", measureText(g.distance)], ["Complesso:", g.complex], ["Ente Proprietario:", g.owner]]) left += label(title, value, { always: true, boldValue: isGeneralBold(state, key) });
  left += band("2. SOGGETTO E DATI TECNICO-DIMENSIONALI") + label("Soggetto:", g.subject, { always: true });
  left += label("Dimensioni:", `H: ${measureText(g.height)}\t\tL: ${measureText(g.width)}\t\tP: ${measureText(g.depth)}`, { always: true });
  left += label("Materie e Tecniche:", g.materials, { always: true });
  const right = table([[para(run("LOCALIZZAZIONE BENE", { bold: true, size: 22, color: "005B60" }), { align: "center", after: 120 }) + para(image(map, 254.15, 254.15 * ROAD_SIZE.height / ROAD_SIZE.width, "Planimetria del bene selezionato"), { align: "center", after: 0 })]], [6688], { borderColor: "005B60", shade: "F8FAF9", padding: 80, minHeight: 10000 });
  let body = table([[left, "", right]], [7424, 576, 6688], { border: false, padding: 0, keepRows: false });
  body += pageBreak() + band("3. STORICO MANUTENTIVO");
  for (const [key, title] of [["restorations", "Interventi di RESTAURO precedenti"], ["maintenance", "Interventi di MANUTENZIONE precedenti"]]) {
    const rows = state.history[key].filter(row => any(row, ["date", "action"]));
    if (rows.length) body += para(run(title, { bold: true }), { keep: true });
    for (const row of rows) body += table([[label("Data:", row.date, { keep: filled(row.action) }) + label("Azione:", row.action)]], [WIDTH], { border: false, padding: 0 }) + blank();
  }
  body += band("4. STATO CONSERVATIVO ATTUALE");
  for (const row of state.conditions.filter(row => any(row, ["exposure", "assessment"]) || row.methods.length)) {
    body += label("Data del rilievo:", displayDate(row.date), { keep: true });
    body += label("Esposizione:", row.exposure);
    if (row.methods.length) body += para(run("Metodologia Ispezione: ", { bold: true }) + choices(METHODS, row.methods));
    body += label("Valutazione Sintetica:", row.assessment) + blank();
  }
  body += band("5. DIAGNOSTICA DEL DEGRADO E PRIORITÀ DI INTERVENTO");
  body += dataTable(["ID", "Macro-Area", "Elemento", "Patologia Riscontrata", "Cause Principali", "Livello di Rischio", "Data del rilievo", "Risolto in data"], state.diagnosis.filter(diagnosisHasContent).map(row => [row.reference, row.area, row.element, row.pathology, row.causes, row.risk, displayDate(row.detectedDate), displayDate(row.resolvedDate)]), [700, 1700, 1700, 3100, 2700, 1500, 1500, 1500]);
  function timing(risk, window, title) {
    if (!risk && !window) return "";
    return table([[para(run("Grado d'Urgenza: ", { bold: true }) + run(risk, { color: riskColor(risk) })), label(title, "", { always: true, after: 50 }) + para(choices(windowsForRisk(risk), window))]], [3300, WIDTH - 3300], { border: false, padding: 0 });
  }
  for (const row of state.priorities.filter(row => any(row, ["risk", "window", "anomalies"]))) {
    const reference = state.diagnosis.find(source => source.id === row.diagnosisId)?.reference;
    const title = "INDICE DI PRIORITÀ E TEMPISTICHE DI INTERVENTO" + (reference ? " · PRIORITÀ " + reference : "");
    const content = para(run(title, { bold: true }), { keep: true }) + timing(row.risk, row.window, "Finestra d'Intervento Programmata:") + label("Anomalie attese:", row.anomalies);
    body += table([[content]], [WIDTH], { borderColor: "005B60", shade: "E8F1F2" }) + blank();
  }
  const visits = surveyEntries(state);
  body += note(state.inspectionNotes);
  const photos = allPhotos(state);
  if (!photos.length) body += pageBreak() + band("6. ATLANTE FOTOGRAFICO", false);
  for (let offset = 0; offset < photos.length; offset += 4) {
    body += pageBreak();
    const rows = [[{ content: band("6. ATLANTE FOTOGRAFICO"), span: 2, shade: "FFFFFF" }]];
    const cells = [];
    for (const photo of photos.slice(offset, offset + 4)) {
      const extension = photo.data.startsWith("data:image/png") ? "png" : "jpg";
      const id = addImage(photo.data.split(",")[1], extension, true);
      const scale = Math.min(345 / photo.width, 185 / photo.height);
      const dates = run("Inserita il ", { bold: true }) + run(displayDate(photo.insertedDate || photo.surveyDate)) + (visits.length > 1 ? run("\tSopralluogo del ", { bold: true }) + run(displayDate(photo.surveyDate)) : "");
      cells.push(para(image(id, photo.width * scale, photo.height * scale, "Fotografia del bene"), { align: "center", after: 40 }) + para(dates, { after: 40 }) + (filled(photo.caption) ? para(run(photo.caption), { after: 80 }) : ""));
    }
    while (cells.length % 2) cells.push(blank());
    for (let index = 0; index < cells.length; index += 2) rows.push(cells.slice(index, index + 2));
    body += table(rows, [WIDTH / 2, WIDTH / 2], { border: false, headers: true, stripe: false, padding: 90 });
  }
  const sectionProperties = () => `<w:sectPr><w:footerReference w:type="default" r:id="footerDefault"/><w:footerReference w:type="first" r:id="footerFirst"/><w:type w:val="nextPage"/><w:pgSz w:w="15840" w:h="12240" w:orient="landscape"/><w:pgMar w:top="576" w:right="576" w:bottom="1120" w:left="576" w:header="180" w:footer="140"/><w:titlePg/></w:sectPr>`;
  const sectionBreak = () => `<w:p><w:pPr>${sectionProperties()}</w:pPr></w:p>`;
  body += sectionBreak() + heading("REGISTRO INTERVENTI DI MANUTENZIONE IMMEDIATA", state.immediate.date) + band("INTERVENTI ESEGUITI");
  for (const row of maintenanceEntries(state)) {
    let content = "";
    if (visits.length > 1) content += label("Sopralluogo:", displayDate(row.surveyDate), { keep: true });
    content += dataTable(["ID", "Macro-Area", "Elemento", "Patologia", "Cause principali", "Eseguito in data"],
      [[row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row.date || state.immediate.executedDate)]],
      [700, 2700, 2700, 3860, 3100, 1900]);
    content += label("Azioni condotte in loco:", row.action);
    body += table([[content]], [WIDTH], { border: false, padding: 0 }) + blank();
  }
  body += note(state.immediate.notes, 1600);
  body += sectionBreak() + heading("PROGRAMMAZIONE AZIONI PREVENTIVE", state.preventive.date) + band("AZIONI PREVENTIVE");
  for (const row of preventiveGroups(state)) {
    let context = label("Azioni preventive programmate il", displayDate(row.programmedDate), { keep: true });
    const headers = ["ID", "Macro-Area", "Elemento", "Patologia Riscontrata", "Cause Principali", "Data del rilievo", "Risolto in data"];
    const values = [row.reference, row.area, row.element, row.pathology, row.causes, displayDate(row.detectedDate), displayDate(row.resolvedDate)];
    const weights = [650, 2200, 2200, 3300, 2600, 1800, 1800];
    context += dataTable(headers, [values], weights, { rowFill: row.resolvedDate ? "E4F3E6" : "" });
    for (const [index, action] of row.actions.filter(actionFilled).entries()) {
      let content = (index === 0 ? context : "") + timing(action.risk, action.window, "Finestra d'Intervento:");
      for (const [title, key, level] of [["Descrizione:", "description", 0], ["Azione:", "action", 1], ["Obiettivo:", "objective", 1], ["Operatore:", "operator", 1]]) if (filled(action[key])) content += para(run(title, { bold: true }) + run(" " + action[key]), { bullet: level });
      if (action.role || action.status) {
        const roles = action.role ? ROLES.map(role => para(choices([role], action.role), { after: 30, indent: 1000 })).join("") : "";
        const status = action.status ? para(run("Stato: ", { bold: true }) + choices(STATUSES, action.status)) : "";
        content += table([[roles, status]], [6200, WIDTH - 6200], { border: false, padding: 0 });
      }
      body += table([[content]], [WIDTH], { border: false, padding: 0 }) + blank();
    }
  }
  body += note(state.preventive.notes, 1600) + sectionProperties();
  const number = para('<w:fldSimple w:instr="PAGE">' + run("1", { size: 15 }) + '</w:fldSimple>' + run("/", { size: 15 }) + '<w:fldSimple w:instr="NUMPAGES">' + run("1", { size: 15 }) + '</w:fldSimple>', { align: "right", after: 0 });
  const footer = table([[para(image(footerLogo, 105, 32.3, "Cròmo"), { after: 0 }), para(run("s.c.ar.l. – Via Matteotti 8, 21030 Castello Cabiaglio (VA) – C.F./P.IVA 02507710396\ninfo@cromorestauri.com – PEC – cromorestauri@sicurezzapostale.it", { size: 15 }), { after: 0 })]], [2350, WIDTH - 2350], { border: false, padding: 0 }) + number;
  const relXml = entries => XML + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + entries.join("") + '</Relationships>';
  zip.file("word/document.xml", XML + `<w:document ${NS}><w:body>${body}</w:body></w:document>`);
  zip.file("word/styles.xml", XML + `<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="19"/><w:color w:val="1E3232"/><w:lang w:val="it-IT"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="90" w:line="228" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="005B60"/></w:rPr></w:style></w:styles>`);
  zip.file("word/numbering.xml", XML + `<w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="multilevel"/>${[0, 1].map(level => `<w:lvl w:ilvl="${level}"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="${level ? "○" : "•"}"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="${(level + 1) * 500}"/></w:tabs><w:ind w:left="${(level + 1) * 500}" w:hanging="240"/></w:pPr></w:lvl>`).join("")}</w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`);
  zip.file("word/settings.xml", XML + `<w:settings ${NS}><w:updateFields w:val="true"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`);
  zip.file("word/footerDefault.xml", XML + `<w:ftr ${NS}>${number}</w:ftr>`);
  zip.file("word/footerFirst.xml", XML + `<w:ftr ${NS}>${footer}</w:ftr>`);
  zip.file("word/_rels/footerFirst.xml.rels", relXml(rels.filter(rel => rel.includes('Id="' + footerLogo + '"'))));
  const type = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/";
  zip.file("word/_rels/document.xml.rels", relXml([...rels, ...["styles", "numbering", "settings"].map(name => `<Relationship Id="${name}" Type="${type + name}" Target="${name}.xml"/>`), ...['First', 'Default'].map(name => `<Relationship Id="footer${name}" Type="${type}footer" Target="footer${name}.xml"/>`)]));
  zip.file("_rels/.rels", relXml([`<Relationship Id="document" Type="${type}officeDocument" Target="word/document.xml"/>`, '<Relationship Id="core" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>']));
  zip.file("docProps/core.xml", XML + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>' + esc(baseName(state, assets)) + '</dc:title><dc:creator>' + esc(COMMON.company) + '</dc:creator><dc:description>Schede Restauro ' + VERSION + '</dc:description></cp:coreProperties>');
  const overrides = { 'word/document.xml': 'document.main', 'word/styles.xml': 'styles', 'word/numbering.xml': 'numbering', 'word/settings.xml': 'settings', 'word/footerFirst.xml': 'footer', 'word/footerDefault.xml': 'footer' };
  zip.file("[Content_Types].xml", XML + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/>' + Object.entries(overrides).map(([path, value]) => `<Override PartName="/${path}" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${value}+xml"/>`).join("") + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
  return new Blob([await zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } })], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
