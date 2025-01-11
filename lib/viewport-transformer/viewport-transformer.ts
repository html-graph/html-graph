import { initialMatrix } from "./initial-matrix";
import { TransformState } from "./transform-state";

export class ViewportTransformer {
  private viewportMatrix: TransformState = initialMatrix;

  private contentMatrix: TransformState = initialMatrix;

  public getViewportMatrix(): TransformState {
    return { ...this.viewportMatrix };
  }

  public getContentMatrix(): TransformState {
    return { ...this.contentMatrix };
  }

  public patchViewportState(
    scale: number | null,
    x: number | null,
    y: number | null,
  ): void {
    this.viewportMatrix = {
      scale: scale ?? this.viewportMatrix.scale,
      x: x ?? this.viewportMatrix.x,
      y: y ?? this.viewportMatrix.y,
    };

    this.contentMatrix = this.calculateReverseMatrix(this.viewportMatrix);
  }

  public patchContentState(
    scale: number | null,
    x: number | null,
    y: number | null,
  ): void {
    this.contentMatrix = {
      scale: scale ?? this.contentMatrix.scale,
      x: x ?? this.contentMatrix.x,
      y: y ?? this.contentMatrix.y,
    };

    this.viewportMatrix = this.calculateReverseMatrix(this.contentMatrix);
  }

  private calculateReverseMatrix(matrix: TransformState): TransformState {
    return {
      scale: 1 / matrix.scale,
      x: -matrix.x / matrix.scale,
      y: -matrix.y / matrix.scale,
    };
  }
}
