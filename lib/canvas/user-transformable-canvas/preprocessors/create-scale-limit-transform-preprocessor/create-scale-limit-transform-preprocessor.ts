import { TransformPreprocessorFn } from "../transform-preprocessor-fn";
import { TransformPreprocessorParams } from "../transform-preprocessor-params";
import { ScaleLimitPreprocessorParams } from "./scale-limit-preprocessor-params";

export const createScaleLimitTransformPreprocessor: (
  preprocessorParams: ScaleLimitPreprocessorParams,
) => TransformPreprocessorFn = (
  preprocessorParams: ScaleLimitPreprocessorParams,
) => {
  const minViewScale =
    preprocessorParams.maxContentScale !== null
      ? 1 / preprocessorParams.maxContentScale
      : null;
  const maxViewScale =
    preprocessorParams.minContentScale !== null
      ? 1 / preprocessorParams.minContentScale
      : null;

  return (params: TransformPreprocessorParams) => {
    if (
      maxViewScale !== null &&
      params.nextTransform.scale > maxViewScale &&
      params.nextTransform.scale > params.prevTransform.scale
    ) {
      return params.prevTransform;
    }

    if (
      minViewScale !== null &&
      params.nextTransform.scale < minViewScale &&
      params.nextTransform.scale < params.prevTransform.scale
    ) {
      return params.prevTransform;
    }

    return params.nextTransform;
  };
};
