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

  return (transform: TransformPayload) => {
    if (
      maxViewScale !== null &&
      transform.scale > maxViewScale &&
      transform.scale > transform.scale
    ) {
      return null;
    }

    if (
      minViewScale !== null &&
      transform.scale < minViewScale &&
      transform.scale < transform.scale
    ) {
      return null;
    }

    return transform;
  };
};
