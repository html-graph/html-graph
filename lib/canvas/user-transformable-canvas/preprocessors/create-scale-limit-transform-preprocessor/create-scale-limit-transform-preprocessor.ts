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
    const prev = params.prevTransform;
    const next = params.nextTransform;
    let nextScale = next.scale;
    let nextDx = next.dx;
    let nextDy = next.dy;

    if (next.scale > maxViewScale && next.scale > prev.scale) {
      nextScale = Math.max(prev.scale, maxViewScale);
      nextDx = prev.dx;
      nextDy = prev.dy;
    }

    if (next.scale < minViewScale && next.scale < prev.scale) {
      nextScale = Math.min(prev.scale, minViewScale);
      nextDx = prev.dx;
      nextDy = prev.dy;
    }

    return {
      scale: nextScale,
      dx: nextDx,
      dy: nextDy,
    };
  };
};
