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
  return (prevTransform: TransformPayload, nextTransform: TransformPayload) => {
    if (
      (minX !== null && nextTransform.dx < minX) ||
      (maxX !== null && nextTransform.dx > maxX) ||
      (minY !== null && nextTransform.dx < minY) ||
      (maxY !== null && nextTransform.dx > maxY)
    ) {
      return prevTransform;
    }

    return nextTransform;
  };
};
