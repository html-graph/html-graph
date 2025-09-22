import { AnimatedLayoutParams } from "@/configurators";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { ForceBasedAnimatedLayoutAlgorithm } from "@/animated-layout-algorithm";

export const createAnimatedLayoutParams = (
  config: AnimatedLayoutConfig | undefined,
): AnimatedLayoutParams => {
  if (config === undefined || config.algorithm === undefined) {
    return {
      algorithm: new ForceBasedAnimatedLayoutAlgorithm(),
    };
  }

  return {
    algorithm: config.algorithm,
  };
};
