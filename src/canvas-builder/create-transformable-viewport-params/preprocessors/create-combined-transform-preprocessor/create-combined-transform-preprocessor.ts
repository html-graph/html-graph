import {
  TransformPreprocessorFn,
  TransformPreprocessorParams,
} from "@/configurators";

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
