import { TransformPreprocessorFn } from "@/configurators";
import {
  createScaleLimitTransformPreprocessor,
  createShiftLimitTransformPreprocessor,
} from "../preprocessors";
import { TransformPreprocessorConfig } from "../transform-preprocessor-config";

export const resolveTransformPreprocessor: (
  option: TransformPreprocessorConfig,
) => TransformPreprocessorFn = (option: TransformPreprocessorConfig) => {
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
