import { TransformState } from "../transform-state";

export interface AbstractViewportTransformer {
  getViewportMatrix(): TransformState;

  getContentMatrix(): TransformState;

  patchViewportMatrix(
    scale: number | null,
    x: number | null,
    y: number | null,
  ): void;

  patchContentMatrix(
    scale: number | null,
    dx: number | null,
    dy: number | null,
  ): void;
}
