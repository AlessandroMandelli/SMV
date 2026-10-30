import { localDate, uid } from "./model.js";

/** Decodifica in sequenza e ridimensiona per non trattenere immagini a piena risoluzione. */
export async function readPhoto(file, surveyDate) {
  const url = URL.createObjectURL(file);
  const image = new Image();
  let canvas;
  try {
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw Error("Immagine non leggibile.");
    const scale = Math.min(1, 2400 / Math.max(image.naturalWidth, image.naturalHeight));
    canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) throw Error("Immagine non elaborabile.");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return {
      id: uid(), surveyDate, insertedDate: localDate(), caption: "",
      data: canvas.toDataURL("image/jpeg", 0.9), width: canvas.width, height: canvas.height,
    };
  } finally {
    URL.revokeObjectURL(url);
    image.src = "";
    if (canvas) canvas.width = canvas.height = 0;
  }
}
