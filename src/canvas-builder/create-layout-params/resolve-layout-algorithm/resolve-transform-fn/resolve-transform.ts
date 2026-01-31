import { CoordsTransformFn } from "@/layouts";
import { Point } from "@/point";
import {
  CoordsTransformConfig,
  CoordsTransformDeclaration,
} from "../../coords-transform-config";
import { Matrix } from "./matrix";
import { multiplyTransformationMatrices } from "./multiply-transformation-matrices";
import { resolveTransformationMatrix } from "./resolve-transformation-matrix/resolve-transformation-matrix";
import { defaults } from "../../defaults";

export const resolveTransformFn = (
  config: CoordsTransformConfig | undefined,
): CoordsTransformFn => {
  if (config === undefined) {
    return defaults.transformFn;
  }

  if (typeof config === "function") {
    return config;
  }

  const transformations: CoordsTransformDeclaration[] = Array.isArray(config)
    ? config
    : [config];

  let finalMatrix: Matrix = {
    a: 1,
    b: 0,
    c: 0,
    d: 0,
    e: 1,
    f: 0,
  };

  transformations.forEach((transformation) => {
    const matrix = resolveTransformationMatrix(transformation);

    finalMatrix = multiplyTransformationMatrices(finalMatrix, matrix);
  });

  return (point: Point) => {
    const { x, y } = point;

    return {
      x: finalMatrix.a * x + finalMatrix.b * y + finalMatrix.c,
      y: finalMatrix.d * x + finalMatrix.e * y + finalMatrix.f,
    };
  };
};
