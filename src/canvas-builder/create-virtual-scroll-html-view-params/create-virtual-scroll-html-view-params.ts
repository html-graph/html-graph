import { VirtualScrollHtmlViewParams } from "@/html-view";
import { VirtualScrollConfig } from "../create-virtual-scroll-params";
import { noopFn } from "../shared";

export const createVirtualScrollHtmlViewParams = (
  config: VirtualScrollConfig | undefined,
): VirtualScrollHtmlViewParams => {
  return {
    onAfterNodeDetached: config?.events?.onAfterNodeDetached ?? noopFn,
    onBeforeNodeAttached: config?.events?.onBeforeNodeAttached ?? noopFn,
  };
};
