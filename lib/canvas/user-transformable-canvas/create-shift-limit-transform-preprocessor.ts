import { TransformPayload } from "./transform-payload";
import { TransformPreprocessorFn } from "./transform-preprocessor-fn";

export const createShiftLimitTransformPreprocessor: (
  minX: number | null,
  maxX: number | null,
  minY: number | null,
  maxY: number | null,
) => TransformPreprocessorFn = (
  minX: number | null,
  maxX: number | null,
  minY: number | null,
  maxY: number | null,
) => {
  return (transform: TransformPayload) => {
    if (
      (minX !== null && transform.dx < minX) ||
      (maxX !== null && transform.dx > maxX) ||
      (minY !== null && transform.dx < minY) ||
      (maxY !== null && transform.dx > maxY)
    ) {
      return null;
    }

    return transform;
  };
};
