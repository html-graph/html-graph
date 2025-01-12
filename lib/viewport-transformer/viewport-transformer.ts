import { initialMatrix } from "./initial-matrix";
import { TransformState } from "./transform-state";

export class ViewportTransformer {
  private viewportMatrix: TransformState = initialMatrix;

  private contentMatrix: TransformState = initialMatrix;

  public getViewportMatrix(): TransformState {
    return this.viewportMatrix;
  }

  public getContentMatrix(): TransformState {
    return this.contentMatrix;
  }

  public patchViewportMatrix(
    scale: number | null,
    x: number | null,
    y: number | null,
  ): void {
    this.viewportMatrix = {
      scale: scale ?? this.viewportMatrix.scale,
      dx: x ?? this.viewportMatrix.dx,
      dy: y ?? this.viewportMatrix.dy,
    };

    this.contentMatrix = this.calculateReverseMatrix(this.viewportMatrix);
  }

  public patchContentMatrix(
    scale: number | null,
    dx: number | null,
    dy: number | null,
  ): void {
    this.contentMatrix = {
      scale: scale ?? this.contentMatrix.scale,
      dx: dx ?? this.contentMatrix.dx,
      dy: dy ?? this.contentMatrix.dy,
    };

    this.viewportMatrix = this.calculateReverseMatrix(this.contentMatrix);
  }

  private calculateReverseMatrix(matrix: TransformState): TransformState {
    return {
      scale: 1 / matrix.scale,
      dx: -matrix.dx / matrix.scale,
      dy: -matrix.dy / matrix.scale,
    };
  }
}
