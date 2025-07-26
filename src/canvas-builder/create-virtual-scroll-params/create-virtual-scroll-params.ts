import { VirtualScrollParams } from "@/configurators";
import { VirtualScrollConfig } from "./virtual-scroll-config";

export const createVirtualScrollParams = (
  config: VirtualScrollConfig,
): VirtualScrollParams => {
  return {
    nodeVerticalRadius: config.nodeContainingRadius.vertical,
    nodeHorizontalRadius: config.nodeContainingRadius.horizontal,
  };
};
