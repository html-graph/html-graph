import { createScaleLimitTransformPreprocessor } from "../create-scale-limit-transform-preprocessor";
import { createShiftLimitTransformPreprocessor } from "../create-shift-limit-transform-preprocessor";
import { TransformPreprocessorFn } from "../transform-preprocessor-fn";
import { TransformPreprocessorOption } from "../../options";

export const resolveTransformPreprocessor: (
  option: TransformPreprocessorOption,
) => TransformPreprocessorFn = (option: TransformPreprocessorOption) => {
  switch (option.type) {
    case "scale-limit":
      return createScaleLimitTransformPreprocessor({
        minContentScale: option.minContentScale ?? null,
        maxContentScale: option.maxContentScale ?? null,
      });
    case "shift-limit":
      return createShiftLimitTransformPreprocessor({
        minX: option.minX ?? null,
        minY: option.minY ?? null,
        maxX: option.maxX ?? null,
        maxY: option.maxY ?? null,
      });
    default:
      return option.preprocessorFn;
  }
};
