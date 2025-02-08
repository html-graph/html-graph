import { TransformPreprocessorFn } from "../transform-preprocessor-fn";
import { TransformPreprocessorParams } from "../transform-preprocessor-params";
import { ScaleLimitPreprocessorParams } from "./scale-limit-preprocessor-params";

export const createScaleLimitTransformPreprocessor: (
  preprocessorParams: ScaleLimitPreprocessorParams,
) => TransformPreprocessorFn = (
  preprocessorParams: ScaleLimitPreprocessorParams,
) => {
  const maxContentScale = preprocessorParams.maxContentScale;
  const minContentScale = preprocessorParams.minContentScale;

  const minViewScale = maxContentScale !== null ? 1 / maxContentScale : 0;
  const maxViewScale =
    minContentScale !== null ? 1 / minContentScale : Infinity;

  return (params: TransformPreprocessorParams) => {
    let nextScale = params.nextTransform.scale;
    let nextDx = params.nextTransform.dx;
    let nextDy = params.nextTransform.dy;

    if (
      params.nextTransform.scale > maxViewScale &&
      params.nextTransform.scale > params.prevTransform.scale
    ) {
      nextScale = Math.max(params.prevTransform.scale, maxViewScale);
      nextDx = params.prevTransform.dx;
      nextDy = params.prevTransform.dy;
    }

    if (
      params.nextTransform.scale < minViewScale &&
      params.nextTransform.scale < params.prevTransform.scale
    ) {
      nextScale = Math.min(params.prevTransform.scale, minViewScale);
      nextDx = params.prevTransform.dx;
      nextDy = params.prevTransform.dy;
    }

    return {
      scale: nextScale,
      dx: nextDx,
      dy: nextDy,
    };
  };
};
