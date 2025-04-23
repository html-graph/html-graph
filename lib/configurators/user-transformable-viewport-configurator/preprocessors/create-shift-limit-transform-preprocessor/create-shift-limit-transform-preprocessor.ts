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
    let dx = params.nextTransform.x;
    let dy = params.nextTransform.y;

    if (dx < minX && dx < params.prevTransform.x) {
      dx = Math.min(params.prevTransform.x, minX);
    }

    const w = params.canvasWidth * params.prevTransform.scale;
    const maxScreenX = maxX - w;

    if (dx > maxScreenX && dx > params.prevTransform.x) {
      dx = Math.max(params.prevTransform.x, maxScreenX);
    }

    if (dy < minY && dy < params.prevTransform.y) {
      dy = Math.min(params.prevTransform.y, minY);
    }

    const h = params.canvasHeight * params.prevTransform.scale;
    const maxScreenY = maxY - h;

    if (dy > maxScreenY && dy > params.prevTransform.y) {
      dy = Math.max(params.prevTransform.y, maxScreenY);
    }

    return { scale: params.nextTransform.scale, x: dx, y: dy };
  };
};
