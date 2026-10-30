import { makePdf } from "./pdf.js";
import { makeDocx } from "./docx.js";

/** I due documenti leggono gli stessi dati; Word usa la struttura nativa della 3.4.3. */
export async function buildExportFiles(state, assets, formats) {
  const files = new Map();
  if (formats.includes("pdf")) {
    files.set("pdf", await makePdf(state, assets));
  }
  if (formats.includes("docx")) {
    files.set("docx", await makeDocx(state, assets));
  }
  if (formats.includes("json"))
    files.set("json", new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }));
  return formats.map(extension => ({ extension, blob: files.get(extension) }));
}
