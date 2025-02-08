import { TransformPreprocessorFn } from "../transform-preprocessor-fn";
import { TransformPreprocessorParams } from "../transform-preprocessor-params";
import { ShiftLimitPreprocessorParams } from "./shift-limit-preprocessor-params";

export const createShiftLimitTransformPreprocessor: (
  preprocessorParams: ShiftLimitPreprocessorParams,
) => TransformPreprocessorFn = (
  preprocessorParams: ShiftLimitPreprocessorParams,
) => {
  const minX =
    preprocessorParams.minX !== null ? preprocessorParams.minX : -Infinity;
  const maxX =
    preprocessorParams.maxX !== null ? preprocessorParams.maxX : Infinity;
  const minY =
    preprocessorParams.minY !== null ? preprocessorParams.minY : -Infinity;
  const maxY =
    preprocessorParams.maxY !== null ? preprocessorParams.maxY : Infinity;

  return (params: TransformPreprocessorParams) => {
    let dx = params.nextTransform.dx;
    let dy = params.nextTransform.dy;

    if (dx < minX && dx < params.prevTransform.dx) {
      dx = Math.min(params.prevTransform.dx, minX);
    }

    const w = params.canvasWidth * params.prevTransform.scale;

    if (dx > maxX - w && dx > params.prevTransform.dx) {
      dx = Math.max(params.prevTransform.dx, maxX - w);
    }

    if (dy < minY && dy < params.prevTransform.dy) {
      dy = Math.min(params.prevTransform.dy, minY);
    }

    const h = params.canvasHeight * params.prevTransform.scale;

    if (dy > maxY - h && dy > params.prevTransform.dy) {
      dy = Math.max(params.prevTransform.dy, maxY - h);
    }

    return { scale: params.nextTransform.scale, dx, dy };
  };
};
