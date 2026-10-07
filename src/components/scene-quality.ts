// Signature visuals receive at least two physical pixels per CSS pixel,
// including zoomed-out displays. Coarse-pointer devices keep a 2x ceiling.
export function scenePixelRatio(deviceRatio: number, coarsePointer: boolean) {
  return Math.min(coarsePointer ? 2 : 2.25, Math.max(2, deviceRatio));
}
