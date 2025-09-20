import { LayoutParams } from "@/configurators";
import { LayoutConfig } from "./layout-config";

export const createLayoutParams = (config: LayoutConfig): LayoutParams => {
  return {
    algorithm: config.algorithm,
    applyOn: config.applyOn,
  };
};
