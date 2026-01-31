import {
  ForceDirectedLayoutAlgorithm,
  HierarchicalLayoutAlgorithm,
  LayoutAlgorithm,
} from "@/layouts";
import { LayoutAlgorithmConfig } from "../layout-algorithm-config";
import { cyrb128, sfc32 } from "@/prng";
import { forceDirectedDefaults } from "../../shared";
import { defaults } from "../defaults";

export const resolveLayoutAlgorithm = (
  config: LayoutAlgorithmConfig | undefined,
): LayoutAlgorithm => {
  switch (config?.type) {
    case "custom": {
      return config.instance;
    }
    case "hierarchical": {
      return new HierarchicalLayoutAlgorithm({
        layerWidth: config.layerWidth ?? defaults.hierarchicalLayout.layerWidth,
        layerSpace: config.layerSpace ?? defaults.hierarchicalLayout.layerSpace,
        transform: { a: 1, b: 0, c: 0, d: 0, e: 1, f: 0 },
      });
    }
    default: {
      const seed = cyrb128(config?.seed ?? forceDirectedDefaults.seed);
      const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

      return new ForceDirectedLayoutAlgorithm({
        dtSec: config?.dtSec ?? forceDirectedDefaults.dtSec,
        maxIterations:
          config?.maxIterations ?? forceDirectedDefaults.maxIterations,
        rand,
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
