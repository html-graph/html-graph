import { AnimatedLayoutParams } from "@/configurators";
import { AnimatedLayoutConfig } from "@html-graph/html-graph";

export const createAnimatedLayoutParams = (
  config: AnimatedLayoutConfig,
): AnimatedLayoutParams => {
  return {
    algorithm: config.algorithm,
    maxTimeDeltaSec: 0.1,
  };
};
