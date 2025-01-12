import { TransformPreprocessorFn } from "./transform-preprocessor-fn";

export const transformPreprocessorDefault: TransformPreprocessorFn = (
  transform,
) => {
  return transform;
};
