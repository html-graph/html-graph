import { Matrix } from "../matrix";
import { multiplyTransformationMatrices } from "../multiply-transformation-matrices";
import { Point } from "@/point";
import { TransformDeclaration } from "../transform-declaration";
import { calculateReverseMartix } from "./calculate-reverse-matrix";

export class TransformationMatrixResolver {
  public resolve(transform: TransformDeclaration): Matrix {
    if ("shift" in transform) {
      return this.createShiftBaseMatrix(transform.shift);
    }

    if ("scale" in transform) {
      const origin = transform.origin ?? { x: 0, y: 0 };

      return this.createScaleRelativeMatrix(transform.scale, origin);
    }

    if ("rotate" in transform) {
      const origin = transform.origin ?? { x: 0, y: 0 };

      return this.createRotateRelativeMatrix(transform.rotate, origin);
    }

    if ("mirror" in transform) {
      const origin = transform.origin ?? { x: 0, y: 0 };

      return this.createMirrorRelativeMatrix(transform.mirror, origin);
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

  private createScaleRelativeMatrix(scale: number, origin: Point): Matrix {
    const baseMatrix = this.createScaleBaseMatrix(scale);
    const directMatrix = this.createShiftBaseMatrix(origin);

    return this.createRelativeTransform(baseMatrix, directMatrix);
  }

  private createRotateRelativeMatrix(angle: number, origin: Point): Matrix {
    const baseMatrix = this.createRotateBaseMatrix(angle);
    const directMatrix = this.createShiftBaseMatrix(origin);

    return this.createRelativeTransform(baseMatrix, directMatrix);
  }

  private createMirrorRelativeMatrix(direction: number, origin: Point): Matrix {
    const baseMatrix = this.createMirrorYBaseMatrix();

    const directMatrix = multiplyTransformationMatrices(
      this.createShiftBaseMatrix(origin),
      this.createRotateBaseMatrix(direction),
    );

    return this.createRelativeTransform(baseMatrix, directMatrix);
  }

  private createRelativeTransform(
    baseMatrix: Matrix,
    directMatrix: Matrix,
  ): Matrix {
    const intermediateMatrix = multiplyTransformationMatrices(
      directMatrix,
      baseMatrix,
    );

    const reverseMatrix = calculateReverseMartix(directMatrix);

    return multiplyTransformationMatrices(intermediateMatrix, reverseMatrix);
  }

  private createShiftBaseMatrix(shift: Point): Matrix {
    return {
      a: 1,
      b: 0,
      c: shift.x,
      d: 0,
      e: 1,
      f: shift.y,
    };
  }

  private createScaleBaseMatrix(scale: number): Matrix {
    return {
      a: scale,
      b: 0,
      c: 0,
      d: 0,
      e: scale,
      f: 0,
    };
  }

  private createRotateBaseMatrix(angle: number): Matrix {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return {
      a: cos,
      b: -sin,
      c: 0,
      d: sin,
      e: cos,
      f: 0,
    };
  }

  private createMirrorYBaseMatrix(): Matrix {
    return {
      a: 1,
      b: 0,
      c: 0,
      d: 0,
      e: -1,
      f: 0,
    };
  }
}
