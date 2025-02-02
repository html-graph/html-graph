import { TransformPayload } from "../transform-payload";
import { TransformPreprocessorFn } from "../transform-preprocessor-fn";

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
  return (
    prevTransform: TransformPayload,
    nextTransform: TransformPayload,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    let dx = nextTransform.dx;
    let dy = nextTransform.dy;

    if (minX !== null && dx < minX && dx < prevTransform.dx) {
      dx = prevTransform.dx;
    }

    const w = canvasWidth * prevTransform.scale;

    if (maxX !== null && dx > maxX - w && dx > prevTransform.dx) {
      dx = prevTransform.dx;
    }

    if (minY !== null && dy < minY && dy < prevTransform.dy) {
      dy = prevTransform.dy;
    }

    const h = canvasHeight * prevTransform.scale;

    if (maxY !== null && dy > maxY - h && dy > prevTransform.dy) {
      dy = prevTransform.dy;
    }

    return { scale: nextTransform.scale, dx, dy };
  };
};
