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
  switch (config?.algorithm?.type) {
    case "custom": {
      return config.algorithm.instance;
    }
    default: {
      const algorithm = config?.algorithm;
      const seed = cyrb128(algorithm?.seed ?? forceBasedDefaults.seed);
      const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
      const resolver = (): number => rand() * 1000;

      return new ForceBasedAnimatedLayoutAlgorithm({
        rand,
        maxTimeDeltaSec:
          algorithm?.maxTimeDeltaSec ?? forceBasedDefaults.maxTimeDeltaSec,
        nodeCharge: algorithm?.nodeCharge ?? forceBasedDefaults.nodeCharge,
        nodeMass: algorithm?.nodeMass ?? forceBasedDefaults.nodeMass,
        edgeEquilibriumLength:
          algorithm?.edgeEquilibriumLength ??
          forceBasedDefaults.edgeEquilibriumLength,
        effectiveDistance: forceBasedDefaults.effectiveDistance,
        edgeStiffness:
          algorithm?.edgeStiffness ?? forceBasedDefaults.edgeStiffness,
        xFallbackResolver: resolver,
        yFallbackResolver: resolver,
      });
    }
  }
};
