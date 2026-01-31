import { CoordsTransformDeclaration } from "@/canvas-builder/create-layout-params/coords-transform-config";
import { Matrix } from "../matrix";

export const resolveTransformationMatrix = (
  transform: CoordsTransformDeclaration,
): Matrix => {
  if ("scale" in transform) {
    const center = transform.center ?? { x: 0, y: 0 };

    return {
      a: transform.scale,
      b: 0,
      c: (transform.scale - 1) * center.x,
      d: 0,
      e: transform.scale,
      f: (transform.scale - 1) * center.y,
    };
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
