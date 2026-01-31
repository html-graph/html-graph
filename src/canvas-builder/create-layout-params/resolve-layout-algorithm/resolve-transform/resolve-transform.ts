import { CoordsTransformFn } from "@/layouts";
import { Point } from "@/point";
import {
  CoordsTransformConfig,
  CoordsTransformDeclaration,
} from "../../coords-transform-config";
import { Matrix } from "./matrix";
import { multiplyTransformationMatrices } from "./multiply-transformation-matrices";

export const resolveTransform = (
  config: CoordsTransformConfig,
): CoordsTransformFn => {
  if (typeof config === "function") {
    return config;
  }

  const transformations: CoordsTransformDeclaration[] = Array.isArray(config)
    ? config
    : [config];

  let m: Matrix = {
    a: 1,
    b: 0,
    c: 0,
    d: 0,
    e: 1,
    f: 0,
  };

  transformations.forEach((transformation) => {
    m = multiplyTransformationMatrices(m, transformation);
  });

  return (point: Point) => {
    const { x, y } = point;

    return {
      x: m.a * x + m.b * y + m.c,
      y: m.d * x + m.e * y + m.f,
    };
  };
};
