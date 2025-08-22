import { VirtualScrollHtmlViewParams } from "@/html-view";
import { VirtualScrollConfig } from "../create-virtual-scroll-params";

export const createVirtualScrollHtmlViewParams = (
  config: VirtualScrollConfig | undefined,
): VirtualScrollHtmlViewParams => {
  return {
    onAfterNodeDetached:
      config?.events?.onAfterNodeDetached ?? ((): void => {}),
    onBeforeNodeAttached:
      config?.events?.onBeforeNodeAttached ?? ((): void => {}),
  };
};
