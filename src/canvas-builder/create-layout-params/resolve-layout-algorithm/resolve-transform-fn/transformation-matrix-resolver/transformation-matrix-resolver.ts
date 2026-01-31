import { Matrix } from "../matrix";
import { multiplyTransformationMatrices } from "../multiply-transformation-matrices";
import { Point } from "@/point";
import { TransformDeclaration } from "../transform-declaration";

export class TransformationMatrixResolver {
  public resolve(transform: TransformDeclaration): Matrix {
    if ("rotate" in transform) {
      const center = transform.center ?? { x: 0, y: 0 };

      return this.createRotateMatrix(transform.rotate, center);
    }

    if ("scale" in transform) {
      const center = transform.center ?? { x: 0, y: 0 };

      return this.createScaleMatrix(transform.scale, center);
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

  private createRotateMatrix(angle: number, center: Point): Matrix {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

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

  private createScaleMatrix(scale: number, center: Point): Matrix {
    const scaleMatrix: Matrix = {
      a: scale,
      b: 0,
      c: 0,
      d: 0,
      e: scale,
      f: 0,
    };

    return this.createRelativeTransform(scaleMatrix, center);
  }

  private createRelativeTransform(matrix: Matrix, center: Point): Matrix {
    const reverseShiftMatrix = this.createReverseShiftMatrix(center);
    const shiftMatrix = this.createShiftMatrix(center);

    const intermediateMatrix = multiplyTransformationMatrices(
      reverseShiftMatrix,
      matrix,
    );

    return multiplyTransformationMatrices(intermediateMatrix, shiftMatrix);
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
