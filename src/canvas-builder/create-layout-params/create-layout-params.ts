import { LayoutParams } from "@/configurators";
import { LayoutConfig } from "./layout-config";
import { resolveLayoutApplyOn } from "./resolve-layout-apply-on";
import { resolveLayoutAlgorithm } from "./resolve-layout-algorithm";
import { defaults } from "./defaults";
import { noopFn } from "../shared";

export const createLayoutParams = (config: LayoutConfig): LayoutParams => {
  return {
    algorithm: resolveLayoutAlgorithm(config.algorithm),
    applyOn: resolveLayoutApplyOn(config.applyOn),
    staticNodeResolver:
      config.staticNodeResolver ?? defaults.staticNodeResolver,
    onBeforeApplied: config.events?.onBeforeApplied ?? noopFn,
    onAfterApplied: config.events?.onAfterApplied ?? noopFn,
  };
};
