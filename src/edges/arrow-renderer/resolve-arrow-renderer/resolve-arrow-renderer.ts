import { edgeConstants } from "@/edges/edge-constants";
import { ArrowRenderer } from "../arrow-renderer";
import { createTriangleArrowRenderer } from "../create-polygon-arrow-renderer";
import { ArrowRendererConfig } from "./arrow-config";
import { createArcArrowRenderer } from "../create-circle-arrow-renderer";
import { createWedgeArrowRenderer } from "../create-wedge-arrow-renderer";

export const resolveArrowRenderer = (
  config: ArrowRendererConfig,
): ArrowRenderer => {
  if (typeof config === "function") {
    return config;
  }

  switch (config.type) {
    case "triangle": {
      return createTriangleArrowRenderer({
        radius: config.radius ?? edgeConstants.polygonArrowRadius,
      });
    }
    case "arc": {
      return createArcArrowRenderer({
        radius: config.radius ?? edgeConstants.circleArrowRadius,
      });
    }
    default: {
      return createWedgeArrowRenderer({
        radius: config.radius ?? edgeConstants.wedgeArrowRadius,
        angle: config.angle ?? edgeConstants.wedgeArrowAngle,
      });
    }
  }
};
