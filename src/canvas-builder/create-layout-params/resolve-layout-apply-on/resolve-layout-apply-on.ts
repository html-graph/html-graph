import { LayoutApplyOnParam } from "@/configurators";
import { LayoutApplyOn } from "../layout-apply-on";
import { EventSubject } from "@/event-subject";
import { macrotaskScheduleFn, microtaskScheduleFn } from "@/schedule-fn";

export const resolveLayoutApplyOn = (
  applyOn: LayoutApplyOn | undefined,
): LayoutApplyOnParam => {
  if (applyOn instanceof EventSubject) {
    return {
      type: "trigger",
      trigger: applyOn,
    };
  }

  if (applyOn === "topologyChangeMicrotask") {
    return {
      type: "topologyChangeSchedule",
      schedule: microtaskScheduleFn,
    };
  }

  if (applyOn?.type === "topologyChangeMacrotask") {
    return {
      type: "topologyChangeSchedule",
      schedule: macrotaskScheduleFn,
    };
  }

  return {
    type: "topologyChangeSchedule",
    schedule: microtaskScheduleFn,
  };
};
