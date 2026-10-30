/** Un solo caricamento, condiviso da DOCX e pacchetti di esportazione. */
let loading;
export async function zipLibrary() {
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
