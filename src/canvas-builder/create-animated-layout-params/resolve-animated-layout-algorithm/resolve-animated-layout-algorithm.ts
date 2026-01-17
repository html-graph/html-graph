import { forceDirectedDefaults } from "../../layout-defaults";
import {
  AnimatedLayoutAlgorithm,
  ForceDirectedAnimatedLayoutAlgorithm,
} from "@/layouts";
import { cyrb128, sfc32 } from "@/prng";
import { AnimatedLayoutAlgorithmConfig } from "../animated-layout-algorithm-config";

export const resolveAnimatedLayoutAlgorithm = (
  config: AnimatedLayoutAlgorithmConfig,
): AnimatedLayoutAlgorithm => {
  switch (config?.type) {
    case "custom": {
      return config.instance;
    }

    default: {
      const seed = cyrb128(config?.seed ?? forceDirectedDefaults.seed);
      const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

      return new ForceDirectedAnimatedLayoutAlgorithm({
        rand,
        maxTimeDeltaSec:
          config?.maxTimeDeltaSec ?? forceDirectedDefaults.maxTimeDeltaSec,
        nodeCharge: config?.nodeCharge ?? forceDirectedDefaults.nodeCharge,
        nodeMass: config?.nodeMass ?? forceDirectedDefaults.nodeMass,
        edgeEquilibriumLength:
          config?.edgeEquilibriumLength ??
          forceDirectedDefaults.edgeEquilibriumLength,
        edgeStiffness:
          config?.edgeStiffness ?? forceDirectedDefaults.edgeStiffness,
        convergenceVelocity:
          config?.convergenceVelocity ??
          forceDirectedDefaults.convergenceVelocity,
        maxForce: config?.maxForce ?? forceDirectedDefaults.maxForce,
        nodeForceCoefficient:
          config?.nodeForceCoefficient ??
          forceDirectedDefaults.nodeForceCoefficient,
        barnesHutTheta:
          config?.barnesHut?.theta ?? forceDirectedDefaults.barnesHutTheta,
        barnesHutAreaRadiusThreshold:
          config?.barnesHut?.areaRadiusThreshold ??
          forceDirectedDefaults.barnesHutAreaRadiusThreshold,
      });
    }
  }
};
