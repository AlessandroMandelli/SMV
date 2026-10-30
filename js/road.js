/** Coordinate della nuova planimetria; condivise da SVG, Word e PDF. */
export const ROAD_SIZE = { width: 553, height: 949 };
export const ROAD_POINTS = [[246, 860], [256, 827], [270, 783], [285, 737], [295, 704], [294, 686], [293, 679], [308, 683], [330, 690], [352, 697], [365, 698], [368, 686], [366, 669], [360, 648], [352, 634], [341, 626], [324, 619], [307, 616], [292, 623], [280, 636], [271, 644], [255, 646], [235, 646], [211, 646], [202, 644], [198, 639], [198, 626], [201, 599], [201, 574], [200, 548], [208, 520], [205, 490], [204, 466], [210, 449], [204, 422], [196, 396], [193, 379], [194, 369], [199, 364], [208, 363], [218, 369], [224, 383], [231, 406], [240, 433], [255, 458], [270, 476], [277, 484], [292, 483], [302, 476], [306, 463], [306, 445], [306, 419], [294, 399], [298, 377], [296, 355], [284, 330], [273, 309], [254, 287], [235, 268], [226, 249], [225, 229], [221, 205], [219, 181], [217, 156], [215, 137], [212, 123], [226, 121], [236, 115]];
export const ROAD_SVG_POINTS = ROAD_POINTS.map(point => point.join(",")).join(" ");

/** Sono visibili solo i marcatori della categoria selezionata. */
export function mapAssets(assets, assetId) {
  const kind = assets.find(asset => asset.id === assetId)?.kind;
  return kind && kind !== "road" ? assets.filter(asset => asset.kind === kind && Number.isFinite(asset.x) && Number.isFinite(asset.y)) : [];
}
