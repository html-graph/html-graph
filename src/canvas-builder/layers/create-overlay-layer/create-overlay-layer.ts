import { createLayer } from "../create-layer";

export const createOverlayLayer: () => HTMLDivElement = () => {
  const layer = createLayer();
  layer.style.pointerEvents = "none";

  return layer;
};
