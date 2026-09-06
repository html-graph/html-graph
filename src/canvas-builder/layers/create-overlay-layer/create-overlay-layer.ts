import { createLayer } from "../create-layer";

export const createOverlayLayer = (zIndex: number): HTMLDivElement => {
  const layer = createLayer(zIndex);
  layer.style.pointerEvents = "none";

  return layer;
};
