import { TransformPreprocessorFn } from "../transform-preprocessor-fn";
import { TransformPreprocessorParams } from "../transform-preprocessor-params";
import { ShiftLimitPreprocessorParams } from "./shift-limit-preprocessor-params";

export const createShiftLimitTransformPreprocessor: (
  preprocessorParams: ShiftLimitPreprocessorParams,
) => TransformPreprocessorFn = (
  preprocessorParams: ShiftLimitPreprocessorParams,
) => {
  return (params: TransformPreprocessorParams) => {
    let dx = params.nextTransform.dx;
    let dy = params.nextTransform.dy;

    if (
      preprocessorParams.minX !== null &&
      dx < preprocessorParams.minX &&
      dx < params.prevTransform.dx
    ) {
      dx = Math.min(params.prevTransform.dx, preprocessorParams.minX);
    }

    const w = params.canvasWidth * params.prevTransform.scale;

    if (
      preprocessorParams.maxX !== null &&
      dx > preprocessorParams.maxX - w &&
      dx > params.prevTransform.dx
    ) {
      dx = Math.max(params.prevTransform.dx, preprocessorParams.maxX - w);
    }

    if (
      preprocessorParams.minY !== null &&
      dy < preprocessorParams.minY &&
      dy < params.prevTransform.dy
    ) {
      dy = Math.min(params.prevTransform.dy, preprocessorParams.minY);
    }

    const h = params.canvasHeight * params.prevTransform.scale;

    if (
      preprocessorParams.maxY !== null &&
      dy > preprocessorParams.maxY - h &&
      dy > params.prevTransform.dy
    ) {
      dy = Math.max(params.prevTransform.dy, preprocessorParams.maxY - h);
    }

    return { scale: params.nextTransform.scale, dx, dy };
  };
};
