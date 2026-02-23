import { LayoutParams } from "@/configurators";
import { immediateScheduleFn, ScheduleFn } from "@/schedule-fn";

export const resolveLayoutFocusSchedule = (
  layoutParams: LayoutParams,
): ScheduleFn => {
  if (layoutParams.applyOn.type === "topologyChangeSchedule") {
    return layoutParams.applyOn.schedule;
  }

  return immediateScheduleFn;
};
