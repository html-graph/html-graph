import { Matrix } from "../matrix";
import { multiplyTransformationMatrices } from "../multiply-transformation-matrices";
import { Point } from "@/point";
import { TransformDeclaration } from "../transform-declaration";
import { calculateReverseMartix } from "./calculate-reverse-matrix";

export class TransformationMatrixResolver {
  public resolve(transform: TransformDeclaration): Matrix {
    if ("shift" in transform) {
      return this.createShiftInitialMatrix(transform.shift);
    }

    if ("rotate" in transform) {
      const origin = transform.origin ?? { x: 0, y: 0 };

      return this.createRotateTransformationMatrix(transform.rotate, origin);
    }

    if ("scale" in transform) {
      const origin = transform.origin ?? { x: 0, y: 0 };

      return this.createScaleTransformationMatrix(transform.scale, origin);
    }

    if ("mirror" in transform) {
      const origin = transform.origin ?? { x: 0, y: 0 };

      return this.createMirrorTransformationMatrix(transform.mirror, origin);
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

  private createRotateTransformationMatrix(
    angle: number,
    origin: Point,
  ): Matrix {
    const initialMatrix = this.createRotateInitialMatrix(angle);
    const coordinateMatrix = calculateReverseMartix(
      this.createShiftInitialMatrix(origin),
    );

    return this.createRelativeTransform(initialMatrix, coordinateMatrix);
  }

  private createScaleTransformationMatrix(
    scale: number,
    origin: Point,
  ): Matrix {
    const initialMatrix = this.createScaleInitialMatrix(scale);
    const coordinateMatrix = calculateReverseMartix(
      this.createShiftInitialMatrix(origin),
    );

    return this.createRelativeTransform(initialMatrix, coordinateMatrix);
  }

  private createMirrorTransformationMatrix(
    direction: number,
    origin: Point,
  ): Matrix {
    const initialMatrix = this.createMirrorYInitialMatrix();
    const shiftMatrix = this.createShiftInitialMatrix(origin);
    const rotateMatrix = this.createRotateInitialMatrix(direction);
    const coordinatesMatrix = calculateReverseMartix(
      multiplyTransformationMatrices(shiftMatrix, rotateMatrix),
    );

    return this.createRelativeTransform(initialMatrix, coordinatesMatrix);
  }

  private createRelativeTransform(
    initialMatrix: Matrix,
    coordinateMatrix: Matrix,
  ): Matrix {
    const reverseCoordinatesMatrix = calculateReverseMartix(coordinateMatrix);

    const intermediateMatrix = multiplyTransformationMatrices(
      reverseCoordinatesMatrix,
      initialMatrix,
    );

    return multiplyTransformationMatrices(intermediateMatrix, coordinateMatrix);
  }

  private createShiftInitialMatrix(shift: Point): Matrix {
    return {
      a: 1,
      b: 0,
      c: shift.x,
      d: 0,
      e: 1,
      f: shift.y,
    };
  }

  private createScaleInitialMatrix(scale: number): Matrix {
    return {
      a: scale,
      b: 0,
      c: 0,
      d: 0,
      e: scale,
      f: 0,
    };
  }

  private createRotateInitialMatrix(angle: number): Matrix {
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

  private createMirrorYInitialMatrix(): Matrix {
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
