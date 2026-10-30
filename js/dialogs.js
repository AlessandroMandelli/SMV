/** Chiusura con pulsanti, tastiera e tocco esterno, nel rispetto delle operazioni in corso. */
export function initDialogs(canClose = () => true) {
  const close = dialog => {
    if (dialog?.open && canClose(dialog)) dialog.close();
  };
  for (const button of document.querySelectorAll("[data-close]"))
    button.onclick = () => close(document.getElementById(button.dataset.close));
  for (const dialog of document.querySelectorAll("dialog")) {
    let startedOutside = false;
    const outside = event => {
      const box = dialog.getBoundingClientRect();
      return event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom;
    };
    dialog.addEventListener("pointerdown", event => {
      startedOutside = event.target === dialog && outside(event);
    });
    dialog.addEventListener("pointercancel", () => { startedOutside = false; });
    dialog.addEventListener("click", event => {
      if (startedOutside && event.target === dialog && outside(event)) close(dialog);
      startedOutside = false;
    });
    dialog.addEventListener("cancel", event => { if (!canClose(dialog)) event.preventDefault(); });
    dialog.addEventListener("close", () => { startedOutside = false; });
  }
}
