import { TransformPreprocessorFn } from "../transform-preprocessor-fn";
import { TransformPreprocessorParams } from "../transform-preprocessor-params";

export const createCombinedTransformPreprocessor: (
  preprocessors: readonly TransformPreprocessorFn[],
) => TransformPreprocessorFn = (
  preprocessors: readonly TransformPreprocessorFn[],
) => {
  return (params: TransformPreprocessorParams) => {
    return preprocessors.reduce(
      (acc, cur) =>
        cur({
          prevTransform: params.prevTransform,
          nextTransform: acc,
          canvasWidth: params.canvasWidth,
          canvasHeight: params.canvasHeight,
        }),
      params.nextTransform,
    );
  };
};
