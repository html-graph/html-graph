import { TransformPayload } from "./transform-payload";
import { TransformPreprocessorFn } from "./transform-preprocessor-fn";

export const createCombinedTransformPreprocessor: (
  preprocessors: readonly TransformPreprocessorFn[],
) => TransformPreprocessorFn = (
  preprocessors: readonly TransformPreprocessorFn[],
) => {
  return (prevTransform: TransformPayload, nextTransform: TransformPayload) => {
    return preprocessors.reduce(
      (acc, cur) => cur(prevTransform, acc),
      nextTransform,
    );
  };
};
