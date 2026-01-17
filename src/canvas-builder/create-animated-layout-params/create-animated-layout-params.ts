import { AnimatedLayoutConfig } from "./animated-layout-config";
import { AnimatedLayoutParams } from "@/configurators";
import { Identifier } from "@/identifier";
import { resolveAnimatedLayoutAlgorithm } from "./resolve-animated-layout-algorithm";

export const createAnimatedLayoutParams = (
  config: AnimatedLayoutConfig | undefined,
  animationStaticNodes: ReadonlySet<Identifier>,
): AnimatedLayoutParams => {
  const algorithm = resolveAnimatedLayoutAlgorithm(config?.algorithm ?? {});

  return {
    algorithm,
    staticNodeResolver: (nodeId) => animationStaticNodes.has(nodeId),
  };
};
