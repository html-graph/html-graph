import { BoxHtmlViewParams } from "@/html-view";
import { VirtualScrollConfig } from "../create-virtual-scroll-params";

export const createBoxHtmlViewParams = (
  config: VirtualScrollConfig | undefined,
): BoxHtmlViewParams => {
  return {
    onAfterNodeDetached:
      config?.events?.onAfterNodeDetached ?? ((): void => {}),
    onBeforeNodeAttached:
      config?.events?.onBeforeNodeAttached ?? ((): void => {}),
  };
};
