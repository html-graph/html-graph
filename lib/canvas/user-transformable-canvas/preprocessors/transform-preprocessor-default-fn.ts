import { TransformPreprocessorFn } from "./transform-preprocessor-fn";

export const transformPreprocessorDefault: TransformPreprocessorFn = (
  params,
) => {
  return params.nextTransform;
};
