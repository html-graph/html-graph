import { edgeConstants } from "@/edges/edge-constants";
import { ArrowRenderer } from "../arrow-renderer";
import { createPolygonArrowRenderer } from "../create-polygon-arrow-renderer";
import { ArrowRendererConfig } from "./arrow-config";
import { createCircleArrowRenderer } from "../create-circle-arrow-renderer";

export const resolveArrowRenderer = (
  config: ArrowRendererConfig,
): ArrowRenderer => {
  if (typeof config === "function") {
    return config;
  }

  switch (config.type) {
    case "polygon": {
      return createPolygonArrowRenderer({
        radius: config.radius ?? edgeConstants.arrowRadius,
      });
    }
    default: {
      return createCircleArrowRenderer({
        radius: config.radius ?? edgeConstants.circleArrowRadius,
      });
    }
  }
};
