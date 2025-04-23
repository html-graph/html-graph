import { TransformPayload } from "./transform-payload";

export interface TransformPreprocessorParams {
  readonly prevTransform: TransformPayload;
  readonly nextTransform: TransformPayload;
  readonly canvasWidth: number;
  readonly canvasHeight: number;
}
