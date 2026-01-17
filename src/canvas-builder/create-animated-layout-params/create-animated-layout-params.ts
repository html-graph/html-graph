import { AnimatedLayoutConfig } from "./animated-layout-config";
import { ForceDirectedAnimatedLayoutAlgorithm } from "@/layouts";
import { cyrb128, sfc32 } from "@/prng";
import { forceDirectedDefaults } from "../layout-defaults";
import { AnimatedLayoutParams } from "@/configurators";
import { Identifier } from "@/identifier";

export const createAnimatedLayoutParams = (
  config: AnimatedLayoutConfig | undefined,
  animationStaticNodes: ReadonlySet<Identifier>,
): AnimatedLayoutParams => {
  switch (config?.algorithm?.type) {
    case "custom": {
      return {
        algorithm: config.algorithm.instance,
        staticNodeResolver: (nodeId) => animationStaticNodes.has(nodeId),
      };
    }
    default: {
      const algorithmConfig = config?.algorithm;
      const seed = cyrb128(algorithmConfig?.seed ?? forceDirectedDefaults.seed);
      const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

      const algorithm = new ForceDirectedAnimatedLayoutAlgorithm({
        rand,
        maxTimeDeltaSec:
          algorithmConfig?.maxTimeDeltaSec ??
          forceDirectedDefaults.maxTimeDeltaSec,
        nodeCharge:
          algorithmConfig?.nodeCharge ?? forceDirectedDefaults.nodeCharge,
        nodeMass: algorithmConfig?.nodeMass ?? forceDirectedDefaults.nodeMass,
        edgeEquilibriumLength:
          algorithmConfig?.edgeEquilibriumLength ??
          forceDirectedDefaults.edgeEquilibriumLength,
        edgeStiffness:
          algorithmConfig?.edgeStiffness ?? forceDirectedDefaults.edgeStiffness,
        convergenceVelocity:
          algorithmConfig?.convergenceVelocity ??
          forceDirectedDefaults.convergenceVelocity,
        maxForce: algorithmConfig?.maxForce ?? forceDirectedDefaults.maxForce,
        nodeForceCoefficient:
          algorithmConfig?.nodeForceCoefficient ??
          forceDirectedDefaults.nodeForceCoefficient,
        barnesHutTheta:
          algorithmConfig?.barnesHut?.theta ??
          forceDirectedDefaults.barnesHutTheta,
        barnesHutAreaRadiusThreshold:
          algorithmConfig?.barnesHut?.areaRadiusThreshold ??
          forceDirectedDefaults.barnesHutAreaRadiusThreshold,
      });

      return {
        algorithm,
        staticNodeResolver: (nodeId) => animationStaticNodes.has(nodeId),
      };
    }
  }
};
