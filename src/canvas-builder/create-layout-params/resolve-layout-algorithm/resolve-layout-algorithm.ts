import { ForceDirectedLayoutAlgorithm, LayoutAlgorithm } from "@/layouts";
import { LayoutAlgorithmConfig } from "../layout-algorithm-config";
import { cyrb128, sfc32 } from "@/prng";
import { forceDirectedDefaults } from "@/canvas-builder/layout-defaults";

export const resolveLayoutAlgorithm = (
  config: LayoutAlgorithmConfig | undefined,
): LayoutAlgorithm => {
  switch (config?.type) {
    case "custom": {
      return config.instance;
    }
    default: {
      const seed = cyrb128(forceDirectedDefaults.seed);
      const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

      return new ForceDirectedLayoutAlgorithm({
        dtSec: 0.02,
        maxIterations: 100,
        rand,
        maxTimeDeltaSec: 0.1,
        nodeCharge: 1e5,
        nodeMass: 1,
        edgeEquilibriumLength: 300,
        edgeStiffness: 1e3,
        effectiveDistance: 1e3,
      });
    }
  }
};
