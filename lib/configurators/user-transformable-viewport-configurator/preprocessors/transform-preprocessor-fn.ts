import { TransformPayload } from "./transform-payload";
import { TransformPreprocessorParams } from "./transform-preprocessor-params";

export type TransformPreprocessorFn = (
  params: TransformPreprocessorParams,
) => TransformPayload;
