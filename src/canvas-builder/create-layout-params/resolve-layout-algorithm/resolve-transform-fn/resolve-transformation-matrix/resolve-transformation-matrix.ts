import { CoordsTransformDeclaration } from "@/canvas-builder/create-layout-params/coords-transform-config";
import { Matrix } from "../matrix";
import { multiplyTransformationMatrices } from "../multiply-transformation-matrices";

export const resolveTransformationMatrix = (
  transform: CoordsTransformDeclaration,
): Matrix => {
  if ("rotate" in transform) {
    const sin = Math.sin(transform.rotate);
    const cos = Math.cos(transform.rotate);
    const center = transform.center ?? { x: 0, y: 0 };

    const shiftedMatrix = multiplyTransformationMatrices(
      {
        a: 1,
        b: 0,
        c: -center.x,
        d: 0,
        e: 1,
        f: -center.y,
      },
      { a: cos, b: -sin, c: 0, d: sin, e: cos, f: 0 },
    );

    return multiplyTransformationMatrices(shiftedMatrix, {
      a: 1,
      b: 0,
      c: center.x,
      d: 0,
      e: 1,
      f: center.y,
    });
  }

  if ("scale" in transform) {
    const center = transform.center ?? { x: 0, y: 0 };

    const shiftedMatrix = multiplyTransformationMatrices(
      {
        a: 1,
        b: 0,
        c: -center.x,
        d: 0,
        e: 1,
        f: -center.y,
      },
      { a: transform.scale, b: 0, c: 0, d: 0, e: transform.scale, f: 0 },
    );

    return multiplyTransformationMatrices(shiftedMatrix, {
      a: 1,
      b: 0,
      c: center.x,
      d: 0,
      e: 1,
      f: center.y,
    });
  }

  return {
    a: transform.a ?? 1,
    b: transform.b ?? 0,
    c: transform.c ?? 0,
    d: transform.d ?? 0,
    e: transform.e ?? 1,
    f: transform.f ?? 0,
  };
};
