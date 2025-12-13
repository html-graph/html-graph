import { LayoutParams } from "@/configurators";
import { LayoutConfig } from "./layout-config";
import { resolveLayoutApplyOn } from "./resolve-layout-apply-on";
import { resolveLayoutAlgorithm } from "./resolve-layout-algorithm";

export const createLayoutParams = (
  config: LayoutConfig | undefined,
): LayoutParams => {
  return {
    algorithm: resolveLayoutAlgorithm(config?.algorithm),
    applyOn: resolveLayoutApplyOn(config?.applyOn),
  };
};
