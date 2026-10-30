/** Ordine unico per navigazione, compilazione e storico della pagina corrente. */
export const EDITOR_LAYOUT_VERSION = 36;
export const SECTION_DEFINITIONS = Object.freeze([
  { key: "context", label: "Identificazione e dati del bene" },
  { key: "history", label: "Storico manutentivo" },
  { key: "conditions", label: "Stato conservativo" },
  { key: "diagnosis", label: "Diagnostica e priorità" },
  { key: "photos", label: "Atlante fotografico" },
  { key: "immediate", label: "Manutenzione immediata" },
  { key: "preventive", label: "Azioni preventive" },
].map(Object.freeze));
export const SECTIONS = Object.freeze(SECTION_DEFINITIONS.map(section => section.label));

/** Le versioni fino alla 3.5 riunivano storico e stato conservativo. */
export function importedSection(index, layoutVersion) {
  if (!Number.isInteger(index)) return 0;
  const migrated = layoutVersion === EDITOR_LAYOUT_VERSION || index < 2 ? index : index + 1;
  return Math.max(0, Math.min(SECTIONS.length - 1, migrated));
}
