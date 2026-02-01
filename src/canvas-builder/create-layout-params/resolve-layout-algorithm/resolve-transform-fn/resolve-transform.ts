import { CoordsTransformFn } from "@/layouts";
import { Point } from "@/point";
import { Matrix } from "./matrix";
import { multiplyTransformationMatrices } from "./multiply-transformation-matrices";
import { TransformationMatrixResolver } from "./transformation-matrix-resolver";
import { CoordsTransformConfig } from "./coords-transform-config";
import { TransformDeclaration } from "./transform-declaration";

export const resolveTransformFn = (
  config: CoordsTransformConfig | undefined,
): CoordsTransformFn => {
  if (config === undefined) {
    return (point) => point;
  }

  if (typeof config === "function") {
    return config;
  }

  const transformations: TransformDeclaration[] = Array.isArray(config)
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

  const resolver = new TransformationMatrixResolver();

  transformations.forEach((transformation) => {
    const matrix = resolver.resolve(transformation);

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
