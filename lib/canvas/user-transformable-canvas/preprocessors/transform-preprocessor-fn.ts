import { TransformPayload } from "./transform-payload";

export type TransformPreprocessorFn = (
  prevTransform: TransformPayload,
  nextTransform: TransformPayload,
  canvasWidth: number,
  canvasHeight: number,
) => TransformPayload;
