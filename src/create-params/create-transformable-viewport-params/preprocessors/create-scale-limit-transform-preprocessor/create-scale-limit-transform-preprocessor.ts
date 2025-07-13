import {
  TransformPreprocessorFn,
  TransformPreprocessorParams,
} from "@/configurators";
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
    let nextDx = next.x;
    let nextDy = next.y;

    if (next.scale > maxViewScale && next.scale > prev.scale) {
      nextScale = Math.max(prev.scale, maxViewScale);
      nextDx = prev.x;
      nextDy = prev.y;
      const ratio = (nextScale - prev.scale) / (next.scale - prev.scale);
      nextDx = prev.x + (next.x - prev.x) * ratio;
      nextDy = prev.y + (next.y - prev.y) * ratio;
    }

    if (next.scale < minViewScale && next.scale < prev.scale) {
      nextScale = Math.min(prev.scale, minViewScale);
      nextDx = prev.x;
      nextDy = prev.y;
      const ratio = (nextScale - prev.scale) / (next.scale - prev.scale);
      nextDx = prev.x + (next.x - prev.x) * ratio;
      nextDy = prev.y + (next.y - prev.y) * ratio;
    }

    return {
      scale: nextScale,
      x: nextDx,
      y: nextDy,
    };
  };
};
