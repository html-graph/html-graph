import { TransformPreprocessorFn } from "./transform-preprocessor-fn";

export const transformPreprocessorDefault: TransformPreprocessorFn = (
  _prevTransform,
  nextTransform,
) => {
  return nextTransform;
};
