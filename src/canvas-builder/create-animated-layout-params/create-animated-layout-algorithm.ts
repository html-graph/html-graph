import { AnimatedLayoutConfig } from "./animated-layout-config";
import {
  AnimatedLayoutAlgorithm,
  ForceDirectedAnimatedLayoutAlgorithm,
} from "@/layouts";
import { cyrb128, sfc32 } from "@/prng";
import { forceDirectedDefaults } from "../layout-defaults";

export const createAnimatedLayoutAlgorithm = (
  config: AnimatedLayoutConfig | undefined,
): AnimatedLayoutAlgorithm => {
  switch (config?.algorithm?.type) {
    case "custom": {
      return config.algorithm.instance;
    }
    default: {
      const algorithm = config?.algorithm;
      const seed = cyrb128(algorithm?.seed ?? forceDirectedDefaults.seed);
      const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

      return new ForceDirectedAnimatedLayoutAlgorithm({
        rand,
        maxTimeDeltaSec:
          algorithm?.maxTimeDeltaSec ?? forceDirectedDefaults.maxTimeDeltaSec,
        nodeCharge: algorithm?.nodeCharge ?? forceDirectedDefaults.nodeCharge,
        nodeMass: algorithm?.nodeMass ?? forceDirectedDefaults.nodeMass,
        edgeEquilibriumLength:
          algorithm?.edgeEquilibriumLength ??
          forceDirectedDefaults.edgeEquilibriumLength,
        effectiveDistance: forceDirectedDefaults.effectiveDistance,
        edgeStiffness:
          algorithm?.edgeStiffness ?? forceDirectedDefaults.edgeStiffness,
        convergenceDelta:
          algorithm?.convergenceDelta ?? forceDirectedDefaults.convergenceDelta,
        convergenceVelocity:
          algorithm?.convergenceVelocity ??
          forceDirectedDefaults.convergenceVelocity,
        maxForce: algorithm?.maxForce ?? forceDirectedDefaults.maxForce,
        nodeForceCoefficient:
          algorithm?.nodeForceCoefficient ??
          forceDirectedDefaults.nodeForceCoefficient,
        barnesHutTheta:
          algorithm?.barnesHut?.theta ?? forceDirectedDefaults.barnesHutTheta,
        barnesHutAreaRadiusThreshold:
          algorithm?.barnesHut?.areaRadiusThreshold ??
          forceDirectedDefaults.barnesHutAreaRadiusThreshold,
      });
    }
  }
};
