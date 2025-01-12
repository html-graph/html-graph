import { TransformPayload } from "./transform-payload";

export type TransformPreprocessorFn = (
  transform: TransformPayload,
) => TransformPayload | null;
