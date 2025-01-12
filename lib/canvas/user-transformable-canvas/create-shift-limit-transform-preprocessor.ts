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
    let dx = nextTransform.dx;
    let dy = nextTransform.dy;

    if (minX !== null && dx < minX && dx < prevTransform.dx) {
      dx = prevTransform.dx;
    }

    if (maxX !== null && dx > maxX && dx > prevTransform.dx) {
      dx = prevTransform.dx;
    }

    if (minY !== null && dy < minY && dy < prevTransform.dy) {
      dy = prevTransform.dy;
    }

    if (maxY !== null && dy > maxY && dy > prevTransform.dy) {
      dy = prevTransform.dy;
    }

    return { scale: nextTransform.scale, dx, dy };
  };
};
