import { TransformPayload } from "./transform-payload";
import { TransformPreprocessorFn } from "./transform-preprocessor-fn";

export const createScaleLimitTransformPreprocessor: (
  minContentScale: number | null,
  maxContentScale: number | null,
) => TransformPreprocessorFn = (
  minContentScale: number | null,
  maxContentScale: number | null,
) => {
  const minViewScale = maxContentScale !== null ? 1 / maxContentScale : null;
  const maxViewScale = minContentScale !== null ? 1 / minContentScale : null;

  return (prevTransform: TransformPayload, nextTransform: TransformPayload) => {
    if (
      maxViewScale !== null &&
      nextTransform.scale > maxViewScale &&
      nextTransform.scale > prevTransform.scale
    ) {
      return prevTransform;
    }

    if (
      minViewScale !== null &&
      nextTransform.scale < minViewScale &&
      nextTransform.scale < prevTransform.scale
    ) {
      return prevTransform;
    }

    return nextTransform;
  };
};
