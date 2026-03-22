import { LayoutParams } from "@/configurators";
import { CanvasDefaults } from "../shared";
import { ViewportControllerParams } from "@/viewport-controller";
import { immediateScheduleFn, ScheduleFn } from "@/schedule-fn";
import { resolveLayoutFocusSchedule } from "./resolve-layout-focus-schedule";

export const createViewportControllerParams = (params: {
  readonly canvasDefaults: CanvasDefaults;
  readonly hasLayout: boolean;
  readonly layoutParams: LayoutParams;
}): ViewportControllerParams => {
  const { canvasDefaults } = params;

  const schedule: ScheduleFn = params.hasLayout
    ? resolveLayoutFocusSchedule(params.layoutParams)
    : immediateScheduleFn;

  return {
    focus: {
      contentOffset: canvasDefaults.focus?.contentOffset ?? 100,
      minContentScale: canvasDefaults.focus?.minContentScale ?? 0,
      schedule,
      animationDuration: canvasDefaults.focus?.animationDuration ?? 0,
    },
  };
};
