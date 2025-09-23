import { AnimatedLayoutConfig } from "./animated-layout-config";
import {
  AnimatedLayoutAlgorithm,
  ForceBasedAnimatedLayoutAlgorithm,
} from "@/animated-layout-algorithm";
import { cyrb128, sfc32 } from "@/prng";
import { forceBasedDefaults } from "./force-based-defaults";

export const createAnimatedLayoutAlgorithm = (
  config: AnimatedLayoutConfig | undefined,
): AnimatedLayoutAlgorithm => {
  switch (config?.type) {
    case "custom": {
      return config.algorithm;
    }
    default: {
      const seed = cyrb128(forceBasedDefaults.seed);
      const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
      const resolver = (): number => rand() * 1000;

      return new ForceBasedAnimatedLayoutAlgorithm({
        rand,
        maxTimeDeltaSec:
          config?.maxTimeDeltaSec ?? forceBasedDefaults.maxTimeDeltaSec,
        nodeCharge: config?.nodeCharge ?? forceBasedDefaults.nodeCharge,
        nodeMass: config?.nodeMass ?? forceBasedDefaults.nodeMass,
        edgeEquilibriumLength:
          config?.edgeEquilibriumLength ??
          forceBasedDefaults.edgeEquilibriumLength,
        edgeStiffness:
          config?.edgeStiffness ?? forceBasedDefaults.edgeStiffness,
        xFallbackResolver: resolver,
        yFallbackResolver: resolver,
      });
    }
  }
};
