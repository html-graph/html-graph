import { immediateScheduleFn } from "@/schedule-fn";
import { ViewportControllerParams } from "@/viewport-controller";

export const defaultViewportControllerParams: ViewportControllerParams = {
  focus: {
    contentOffset: 0,
    minContentScale: 0,
    schedule: immediateScheduleFn,
    animationDuration: 0,
  },
};
