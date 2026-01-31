import { Matrix } from "../matrix";
import { multiplyTransformationMatrices } from "../multiply-transformation-matrices";
import { Point } from "@/point";
import { TransformDeclaration } from "../transform-declaration";
import { calculateReverseMartix } from "./calculate-reverse-matrix";

export class TransformationMatrixResolver {
  public resolve(transform: TransformDeclaration): Matrix {
    if ("rotate" in transform) {
      const center = transform.center ?? { x: 0, y: 0 };

      return this.createRotateTransformationMatrix(transform.rotate, center);
    }

    if ("scale" in transform) {
      const center = transform.center ?? { x: 0, y: 0 };

      return this.createScaleTransformationMatrix(transform.scale, center);
    }

    if ("mirror" in transform) {
      return this.createMirrorTransformationMatrix(transform.mirror);
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
    center: Point,
  ): Matrix {
    const rotateMatrix = this.createRotateMatrix(angle);
    const coordinateMatrix = this.createShiftMatrix(center);

    return this.createRelativeTransform(rotateMatrix, coordinateMatrix);
  }

  private createScaleTransformationMatrix(
    scale: number,
    center: Point,
  ): Matrix {
    const scaleMatrix = this.createScaleMatrix(scale);
    const coordinateMatrix = this.createShiftMatrix(center);

    return this.createRelativeTransform(scaleMatrix, coordinateMatrix);
  }

  private createMirrorTransformationMatrix(direction: number): Matrix {
    const mirroYMatrix = this.createMirrorYMatrix();
    const coordinatesMatrix = this.createRotateTransformationMatrix(direction, {
      x: 0,
      y: 0,
    });

    return this.createRelativeTransform(mirroYMatrix, coordinatesMatrix);
  }

  private createRelativeTransform(
    matrix: Matrix,
    coordinateMatrix: Matrix,
  ): Matrix {
    const reverseTransformMatrix = calculateReverseMartix(coordinateMatrix);

    const intermediateMatrix = multiplyTransformationMatrices(
      reverseTransformMatrix,
      matrix,
    );

    return multiplyTransformationMatrices(intermediateMatrix, coordinateMatrix);
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

  private createScaleMatrix(scale: number): Matrix {
    return {
      a: scale,
      b: 0,
      c: 0,
      d: 0,
      e: scale,
      f: 0,
    };
  }

  private createRotateMatrix(angle: number): Matrix {
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

  private createMirrorYMatrix(): Matrix {
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
