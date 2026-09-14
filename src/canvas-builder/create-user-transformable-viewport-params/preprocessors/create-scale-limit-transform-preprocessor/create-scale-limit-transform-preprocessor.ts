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
    let nextX = next.x;
    let nextY = next.y;

    if (next.scale > maxViewScale && next.scale > prev.scale) {
      nextScale = Math.max(prev.scale, maxViewScale);
      const ratio = (nextScale - prev.scale) / (next.scale - prev.scale);

      nextX = prev.x + (next.x - prev.x) * ratio;
      nextY = prev.y + (next.y - prev.y) * ratio;
    }

    if (next.scale < minViewScale && next.scale < prev.scale) {
      nextScale = Math.min(prev.scale, minViewScale);
      const ratio = (nextScale - prev.scale) / (next.scale - prev.scale);

      nextX = prev.x + (next.x - prev.x) * ratio;
      nextY = prev.y + (next.y - prev.y) * ratio;
    }

    return {
      scale: nextScale,
      x: nextX,
      y: nextY,
    };
  };
};
