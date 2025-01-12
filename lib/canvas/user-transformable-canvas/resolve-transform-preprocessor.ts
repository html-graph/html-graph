import { createScaleLimitTransformPreprocessor } from "./create-scale-limit-transform-preprocessor";
import { createShiftLimitTransformPreprocessor } from "./create-shift-limit-transform-preprocessor";
import { TransformPreprocessorFn } from "./transform-preprocessor-fn";
import { TransformPreprocessorOption } from "./transform-preprocessor-option";

export const resolveTransformPreprocessor: (
  option: TransformPreprocessorOption,
) => TransformPreprocessorFn = (option: TransformPreprocessorOption) => {
  switch (option.type) {
    case "scale-limit":
      return createScaleLimitTransformPreprocessor(
        option.minContentScale ?? null,
        option.maxContentScale ?? null,
      );
    case "shift-limit":
      return createShiftLimitTransformPreprocessor(
        option.minX ?? null,
        option.maxX ?? null,
        option.minY ?? null,
        option.maxY ?? null,
      );
    default:
      return option.preprocessorFn;
  }
};
