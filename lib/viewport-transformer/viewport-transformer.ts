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
    const viewportMatrix: TransformState = {
      scale: scale ?? this.viewportMatrix.scale,
      x: x ?? this.viewportMatrix.x,
      y: y ?? this.viewportMatrix.y,
    };

    this.viewportMatrix = viewportMatrix;

    this.contentMatrix = {
      scale: 1 / viewportMatrix.scale,
      x: -viewportMatrix.x / viewportMatrix.scale,
      y: -viewportMatrix.y / viewportMatrix.scale,
    };
  }
}
