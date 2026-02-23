import { TransformState } from "@/viewport-store";
import { TransformPreprocessorParams } from "./transform-preprocessor-params";

export type TransformPreprocessorFn = (
  params: TransformPreprocessorParams,
) => TransformState;
