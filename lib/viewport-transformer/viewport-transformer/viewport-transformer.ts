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
      x: matrix.x ?? this.viewportMatrix.x,
      y: matrix.y ?? this.viewportMatrix.y,
    };

    this.contentMatrix = calculateReverseMatrix(this.viewportMatrix);
  }

  public patchContentMatrix(matrix: PatchTransformRequest): void {
    this.contentMatrix = {
      scale: matrix.scale ?? this.contentMatrix.scale,
      x: matrix.x ?? this.contentMatrix.x,
      y: matrix.y ?? this.contentMatrix.y,
    };

    this.viewportMatrix = calculateReverseMatrix(this.contentMatrix);
  }
}
