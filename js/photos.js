import { localDate, uid } from "./model.js";

export const MAX_PHOTO_BYTES = 2_000_000;
const MAX_COMPRESSED_SIDE = 2400;
const JPEG_QUALITIES = [0.9, 0.8, 0.7, 0.6];

function dataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || Error("Fotografia non leggibile."));
    reader.readAsDataURL(blob);
  });
}

function imageType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => bytes[i] === value)) return "image/png";
  return "";
}

/** I JPEG ruotati vanno normalizzati: Word e PDF non applicano l'orientamento EXIF. */
function jpegOrientation(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  try {
    for (let at = 2; at + 4 <= bytes.length;) {
      if (bytes[at] !== 0xff || [0xda, 0xd9].includes(bytes[at + 1])) break;
      const length = view.getUint16(at + 2);
      const end = at + 2 + length;
      if (length < 2 || end > bytes.length) return 0;
      if (bytes[at + 1] === 0xe1 && view.getUint32(at + 4) === 0x45786966 && view.getUint16(at + 8) === 0) {
        const tiff = at + 10;
        const little = view.getUint16(tiff) === 0x4949;
        if ((!little && view.getUint16(tiff) !== 0x4d4d) || view.getUint16(tiff + 2, little) !== 42) return 0;
        const directory = tiff + view.getUint32(tiff + 4, little);
        if (directory < tiff || directory + 2 > end) return 0;
        const count = view.getUint16(directory, little);
        for (let i = 0; i < count; i++) {
          const entry = directory + 2 + i * 12;
          if (entry + 12 > end) return 0;
          if (view.getUint16(entry, little) === 0x0112)
            return view.getUint16(entry + 2, little) === 3 && view.getUint32(entry + 4, little) === 1
              ? view.getUint16(entry + 8, little) : 0;
        }
      }
      at = end;
    }
    return 1;
  } catch { return 0; }
}

function encodeJpeg(canvas, quality) {
  return new Promise((resolve, reject) => canvas.toBlob(blob => {
    if (blob?.type === "image/jpeg") resolve(blob);
    else reject(Error("Impossibile comprimere la fotografia."));
  }, "image/jpeg", quality));
}

/** Elabora una foto alla volta e verifica il peso binario prima di aggiungerla alla scheda. */
export async function readPhoto(file, surveyDate) {
  const url = URL.createObjectURL(file);
  const image = new Image();
  let canvas;
  try {
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw Error("Immagine non leggibile.");
    const photo = { id: uid(), surveyDate, insertedDate: localDate(), caption: "" };
    const small = file.size <= MAX_PHOTO_BYTES;
    const bytes = new Uint8Array(await (small ? file : file.slice(0, 12)).arrayBuffer());
    const type = imageType(bytes);
    if (small && (type === "image/png" || (type === "image/jpeg" && jpegOrientation(bytes) === 1))) {
      // Conserva i byte originali quando formato e orientamento sono già compatibili.
      return { ...photo, data: await dataUrl(new Blob([bytes], { type })),
        width: image.naturalWidth, height: image.naturalHeight };
    }

    canvas = document.createElement("canvas");
    let scale = small && type ? 1 : Math.min(1, MAX_COMPRESSED_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
    for (;;) {
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) throw Error("Immagine non elaborabile.");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of JPEG_QUALITIES) {
        const blob = await encodeJpeg(canvas, quality);
        if (blob.size <= MAX_PHOTO_BYTES)
          return { ...photo, data: await dataUrl(blob), width: canvas.width, height: canvas.height };
      }
      if (canvas.width === 1 && canvas.height === 1) throw Error("Fotografia non comprimibile entro 2 MB.");
      scale *= 0.8;
    }
  } finally {
    URL.revokeObjectURL(url);
    image.src = "";
    if (canvas) canvas.width = canvas.height = 0;
  }
}
