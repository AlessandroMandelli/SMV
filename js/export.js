import { zipLibrary } from "./zip.js";

export function isAppleMobile(nav = navigator) {
  return /iPhone|iPad|iPod/.test(nav.userAgent) ||
    (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
}

async function makeArchive(files, name) {
  const Zip = await zipLibrary();
  const zip = new Zip();
  for (const file of files) {
    zip.file(`${name}.${file.extension}`, new Uint8Array(await file.blob.arrayBuffer()));
  }
  return new Blob([await zip.generateAsync({ type: "uint8array", compression: "STORE" })],
    { type: "application/zip" });
}

/** Prepara tutti i file prima di avviare i download; un solo ZIP su iPhone. */
export class ExportFiles {
  constructor(root, notify) {
    this.root = root;
    this.notify = notify;
    this.generation = 0;
    this.urls = [];
    this.links = Object.fromEntries(["docx", "pdf", "json"].map(extension =>
      [extension, root.querySelector(`[data-format="${extension}"]`)]));
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
    for (const url of this.urls) setTimeout(() => URL.revokeObjectURL(url), 60000);
    this.urls = [];
  }
  link(element, blob, name) {
    const url = URL.createObjectURL(blob);
    this.urls.push(url);
    element.href = url;
    element.download = name;
    element.hidden = false;
  }
  async prepare(files, name) {
    this.clear();
    if (!files.length) return false;
    const generation = this.generation;
    const apple = isAppleMobile();
    const archive = apple && files.length > 1 ? await makeArchive(files, name) : null;
    if (generation !== this.generation) return false;
    if (archive) {
      this.link(this.zipLink, archive, `${name}.zip`);
      this.downloadLinks = [this.zipLink];
    } else {
      for (const file of files) this.link(this.links[file.extension], file.blob, `${name}.${file.extension}`);
      this.downloadLinks = files.map(file => this.links[file.extension]);
    }
    const pdf = files.find(file => file.extension === "pdf");
    if (apple && files.length === 1 && pdf) {
      this.pdfFile = new File([pdf.blob], `${name}.pdf`, { type: "application/pdf" });
      try {
        this.shareButton.hidden = !(typeof navigator.share === "function" &&
          typeof navigator.canShare === "function" && navigator.canShare({ files: [this.pdfFile] }));
      } catch { this.shareButton.hidden = true; }
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
    try { await navigator.share({ files: [this.pdfFile] }); }
    catch (error) {
      if (error.name !== "AbortError") this.notify("Condivisione non disponibile. Usa Salva PDF.");
    } finally { this.shareButton.disabled = false; }
  }
}
