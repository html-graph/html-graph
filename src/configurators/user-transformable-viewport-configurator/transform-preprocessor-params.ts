import { TransformState } from "@/viewport-store";

export interface TransformPreprocessorParams {
  readonly prevTransform: TransformState;
  readonly nextTransform: TransformState;
  readonly canvasWidth: number;
  readonly canvasHeight: number;
}
