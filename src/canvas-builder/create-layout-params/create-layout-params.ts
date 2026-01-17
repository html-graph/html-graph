import { LayoutParams } from "@/configurators";
import { LayoutConfig } from "./layout-config";
import { resolveLayoutApplyOn } from "./resolve-layout-apply-on";
import { resolveLayoutAlgorithm } from "./resolve-layout-algorithm";
import { defaults } from "./defaults";

export const createLayoutParams = (
  config: LayoutConfig | undefined,
): LayoutParams => {
  return {
    algorithm: resolveLayoutAlgorithm(config?.algorithm),
    applyOn: resolveLayoutApplyOn(config?.applyOn),
    staticNodeResolver:
      config?.staticNodeResolver ?? defaults.staticNodeResolver,
  };
};
