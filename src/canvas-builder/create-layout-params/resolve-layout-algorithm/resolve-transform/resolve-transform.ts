import { CoordsTransformFn } from "@/layouts";
import { Point } from "@/point";
import {
  CoordsTransformConfig,
  CoordsTransformDeclaration,
} from "../../coords-transform-config";

export const resolveTransform = (
  config: CoordsTransformConfig,
): CoordsTransformFn => {
  if (typeof config === "function") {
    return config;
  }

  const transformers: CoordsTransformDeclaration[] = Array.isArray(config)
    ? config
    : [config];

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  transformers.forEach((transformer) => {
    scale *= transformer.scale ?? 1;
    translateX += transformer.translateX ?? 0;
    translateY += transformer.translateY ?? 0;
  });

  return (point: Point) => ({
    x: scale * point.x + translateX,
    y: scale * point.y + translateY,
  });
};
