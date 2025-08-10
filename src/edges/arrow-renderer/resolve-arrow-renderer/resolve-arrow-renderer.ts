import { edgeConstants } from "@/edges/edge-constants";
import { ArrowRenderer } from "../arrow-renderer";
import { createPolygonArrowRenderer } from "../create-polygon-arrow-renderer";
import { ArrowRendererConfig } from "./arrow-config";

export const resolveArrowRenderer = (
  config: ArrowRendererConfig,
): ArrowRenderer => {
  if (typeof config === "function") {
    return config;
  }

  switch (config.type) {
    default: {
      return createPolygonArrowRenderer({
        radius: config.radius ?? edgeConstants.arrowWidth,
      });
    }
  }
};
