import { AnimatedLayoutParams } from "@/configurators";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { ForceBasedAnimatedLayoutAlgorithm } from "@/animated-layout-algorithm";

export const createAnimatedLayoutParams = (
  config: AnimatedLayoutConfig | undefined,
): AnimatedLayoutParams => {
  const algorithm = config?.algorithm;

  if (algorithm === undefined) {
    return {
      algorithm: new ForceBasedAnimatedLayoutAlgorithm({
        maxTimeDeltaSec: 0.1,
        nodeCharge: 1e5,
        nodeMass: 1,
        edgeEquilibriumLength: 300,
        edgeStiffness: 1e3,
        xFallbackResolver: (): number => 0,
        yFallbackResolver: (): number => 0,
      }),
    };
  }

  return {
    algorithm: algorithm,
  };
};
