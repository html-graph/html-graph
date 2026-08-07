import { LayoutApplyOnParam } from "@/configurators";
import { LayoutApplyOn } from "../layout-apply-on";
import { EventSubject } from "@/event-subject";
import { microtaskScheduleFn } from "@/schedule-fn";

export const resolveLayoutApplyOn = (
  applyOn: LayoutApplyOn | undefined,
): LayoutApplyOnParam => {
  if (applyOn instanceof EventSubject) {
    return {
      type: "trigger",
      trigger: applyOn,
    };
  }

  return {
    type: "topologyChangeSchedule",
    schedule: microtaskScheduleFn,
  };
};
