import { TransformPreprocessorOption } from "../options";
import {
  createScaleLimitTransformPreprocessor,
  createShiftLimitTransformPreprocessor,
  TransformPreprocessorFn,
} from "../preprocessors";

export const resolveTransformPreprocessor: (
  option: TransformPreprocessorOption,
) => TransformPreprocessorFn = (option: TransformPreprocessorOption) => {
  if (typeof option === "function") {
    return option;
  }

  switch (option.type) {
    case "scale-limit":
      return createScaleLimitTransformPreprocessor({
        minContentScale: option.minContentScale ?? 0,
        maxContentScale: option.maxContentScale ?? Infinity,
      });
    case "shift-limit":
      return createShiftLimitTransformPreprocessor({
        minX: option.minX ?? -Infinity,
        maxX: option.maxX ?? Infinity,
        minY: option.minY ?? -Infinity,
        maxY: option.maxY ?? Infinity,
      });
  }
};
