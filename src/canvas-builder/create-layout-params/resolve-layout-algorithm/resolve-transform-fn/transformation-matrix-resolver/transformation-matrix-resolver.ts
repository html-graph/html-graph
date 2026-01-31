import { CoordsTransformDeclaration } from "@/canvas-builder/create-layout-params/coords-transform-config";
import { Matrix } from "../matrix";
import { multiplyTransformationMatrices } from "../multiply-transformation-matrices";
import { Point } from "@/point";

export class TransformationMatrixResolver {
  public resolve(transform: CoordsTransformDeclaration): Matrix {
    if ("rotate" in transform) {
      const sin = Math.sin(transform.rotate);
      const cos = Math.cos(transform.rotate);
      const center = transform.center ?? { x: 0, y: 0 };

      const rotateMatrix: Matrix = {
        a: cos,
        b: -sin,
        c: 0,
        d: sin,
        e: cos,
        f: 0,
      };

      return this.createRelativeTransform(rotateMatrix, center);
    }

    if ("scale" in transform) {
      const center = transform.center ?? { x: 0, y: 0 };

      const scaleMatrix: Matrix = {
        a: transform.scale,
        b: 0,
        c: 0,
        d: 0,
        e: transform.scale,
        f: 0,
      };

      return this.createRelativeTransform(scaleMatrix, center);
    }

    return {
      a: transform.a ?? 1,
      b: transform.b ?? 0,
      c: transform.c ?? 0,
      d: transform.d ?? 0,
      e: transform.e ?? 1,
      f: transform.f ?? 0,
    };
  }

  private createRelativeTransform(matrix: Matrix, center: Point): Matrix {
    const reverseShiftMatrix = this.createReverseShiftMatrix(center);

    const shiftMatrix = this.createShiftMatrix(center);

    return multiplyTransformationMatrices(
      multiplyTransformationMatrices(reverseShiftMatrix, matrix),
      shiftMatrix,
    );
  }

  private createReverseShiftMatrix(shift: Point): Matrix {
    return {
      a: 1,
      b: 0,
      c: -shift.x,
      d: 0,
      e: 1,
      f: -shift.y,
    };
  }

  private createShiftMatrix(shift: Point): Matrix {
    return {
      a: 1,
      b: 0,
      c: shift.x,
      d: 0,
      e: 1,
      f: shift.y,
    };
  }
}
