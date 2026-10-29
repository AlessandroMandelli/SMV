/** Allinea la larghezza del titolo al sottotitolo usando il font effettivo del dispositivo. */
export function initHomeTitle() {
  const branding = document.querySelector(".home-branding");
  const title = document.getElementById("homeTitle");
  const subtitle = document.getElementById("homeSubtitle");
  if (!branding || !title || !subtitle) return;

  function fit() {
    const targetWidth = subtitle.getBoundingClientRect().width;
    const titleWidth = title.getBoundingClientRect().width;
    if (
      !targetWidth ||
      !titleWidth ||
      Math.abs(targetWidth - titleWidth) < 0.05
    )
      return;
    const size = parseFloat(getComputedStyle(title).fontSize);
    if (Number.isFinite(size))
      title.style.fontSize = `${(size * targetWidth) / titleWidth}px`;
  }

  // Il CSS fornisce già le proporzioni iniziali; qui si correggono le differenze fra font.
  fit();
  window.addEventListener("resize", fit, { passive: true });
  if (typeof ResizeObserver !== "undefined")
    new ResizeObserver(fit).observe(branding);
  if (document.fonts) {
    document.fonts.ready.then(fit).catch(() => {});
    document.fonts.addEventListener("loadingdone", fit);
  }
}
