import { calculateReverseMatrix } from "../calculate-reverse-matrix";
import { initialMatrix } from "../initial-matrix";
import { TransformState } from "../transform-state";
import { PatchTransformRequest } from "./patch-transform-request";

export class ViewportTransformer {
  private viewportMatrix: TransformState = initialMatrix;

  private contentMatrix: TransformState = initialMatrix;

  public getViewportMatrix(): TransformState {
    return this.viewportMatrix;
  }

  public getContentMatrix(): TransformState {
    return this.contentMatrix;
  }

  public patchViewportMatrix(matrix: PatchTransformRequest): void {
    this.viewportMatrix = {
      scale: matrix.scale ?? this.viewportMatrix.scale,
      dx: matrix.dx ?? this.viewportMatrix.dx,
      dy: matrix.dy ?? this.viewportMatrix.dy,
    };

    this.contentMatrix = calculateReverseMatrix(this.viewportMatrix);
  }

  public patchContentMatrix(matrix: PatchTransformRequest): void {
    this.contentMatrix = {
      scale: matrix.scale ?? this.contentMatrix.scale,
      dx: matrix.dx ?? this.contentMatrix.dx,
      dy: matrix.dy ?? this.contentMatrix.dy,
    };

    this.viewportMatrix = calculateReverseMatrix(this.contentMatrix);
  }
}
