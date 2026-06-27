import { TransformState } from "@/viewport-store";

export interface TransformPreprocessorParams {
  readonly prevTransform: TransformState;
  readonly nextTransform: TransformState;
  // TODO: rename to viewportWidth
  readonly canvasWidth: number;
  // TODO: rename to viewportHeight
  readonly canvasHeight: number;
}
