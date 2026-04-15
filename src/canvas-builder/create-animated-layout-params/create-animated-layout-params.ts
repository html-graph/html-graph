import { AnimatedLayoutConfig } from "./animated-layout-config";
import { AnimatedLayoutParams } from "@/configurators";
import { resolveAnimatedLayoutAlgorithm } from "./resolve-animated-layout-algorithm";
import { defaults } from "./defaults";
import { noopFn } from "../shared";

export const createAnimatedLayoutParams = (
  config: AnimatedLayoutConfig | undefined,
): AnimatedLayoutParams => {
  const algorithm = resolveAnimatedLayoutAlgorithm(config?.algorithm ?? {});

  return {
    algorithm,
    staticNodeResolver:
      config?.staticNodeResolver ?? defaults.staticNodeResolver,
    onBeforeApplied: config?.events?.onBeforeApplied ?? noopFn,
    onAfterApplied: config?.events?.onAfterApplied ?? noopFn,
  };
};
