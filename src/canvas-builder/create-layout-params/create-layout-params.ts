import { LayoutParams } from "@/configurators";
import { LayoutConfig } from "./layout-config";
import { resolveLayoutApplyOn } from "./resolve-layout-apply-on";

export const createLayoutParams = (config: LayoutConfig): LayoutParams => {
  return {
    algorithm: config.algorithm.instance,
    applyOn: resolveLayoutApplyOn(config.applyOn),
  };
};
