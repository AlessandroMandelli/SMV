/** Download singoli e pacchetto iPhone, senza finestre di conferma dell'app. */
export function isAppleMobile(nav = navigator) {
  return (
    /iPhone|iPad|iPod/.test(nav.userAgent) ||
    (nav.platform === "MacIntel" && nav.maxTouchPoints > 1)
  );
}

let zipLibrary;
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
        script.onload = () => (window.JSZip ? resolve() : fail());
        script.onerror = fail;
        document.head.append(script);
      });
    await zipLibrary;
  }
  const zip = new window.JSZip();
  const [pdfBytes, jsonBytes] = await Promise.all([
    pdf.arrayBuffer(),
    json.arrayBuffer(),
  ]);
  zip.file(name + ".pdf", new Uint8Array(pdfBytes));
  zip.file(name + ".json", new Uint8Array(jsonBytes));
  // STORE evita di ricomprimere PDF e fotografie e limita il lavoro sul telefono.
  const bytes = await zip.generateAsync({
    type: "uint8array",
    compression: "STORE",
  });
  return new Blob([bytes], { type: "application/zip" });
}

export class ExportFiles {
  constructor(root, notify) {
    this.root = root;
    this.notify = notify;
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
    // Consenti al browser di completare un download già iniziato.
    for (const url of this.urls)
      setTimeout(() => URL.revokeObjectURL(url), 60000);
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
        /* I file singoli rimangono sempre disponibili. */
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
      canShare =
        this.apple &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [this.pdfFile] });
    } catch {
      /* Alcuni browser espongono l'API ma non accettano file. */
    }
    this.shareButton.hidden = !canShare;
    this.help.textContent = this.apple
      ? archive
        ? "Lo ZIP contiene PDF e JSON: toccalo nell’app File per estrarli. Puoi anche salvare i file separatamente."
        : "Salva PDF e JSON separatamente con i pulsanti qui sotto."
      : "Puoi salvare nuovamente PDF e JSON con questi pulsanti.";
    if (canShare)
      this.help.textContent +=
        " Per il PDF puoi usare Condividi PDF → Salva su File.";
    this.root.hidden = false;
    return true;
  }
  download() {
    if (this.root.hidden) return;
    if (this.apple) {
      // Un solo download automatico: i due file non competono su iPhone/iPad.
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
      // Chiamata direttamente dal tap, dopo aver già preparato il File PDF.
      await navigator.share({ files: [this.pdfFile] });
    } catch (error) {
      if (error.name !== "AbortError")
        this.notify("Condivisione non disponibile. Usa il pulsante Salva PDF.");
    } finally {
      this.shareButton.disabled = false;
    }
  }
}
