import { AnimatedLayoutParams } from "@/configurators";
import { AnimatedLayoutConfig } from "./animated-layout-config";

export const createAnimatedLayoutParams = (
  config: AnimatedLayoutConfig,
): AnimatedLayoutParams => {
  return {
    algorithm: config.algorithm,
    maxTimeDeltaSec: config.maxTimeDeltaSec ?? 0.1,
  };
};
