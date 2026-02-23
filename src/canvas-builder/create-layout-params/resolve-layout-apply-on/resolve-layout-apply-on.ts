import { LayoutApplyOnParam } from "@/configurators";
import { LayoutApplyOn } from "../layout-apply-on";
import { EventSubject } from "@/event-subject";
import { microtaskScheduleFn } from "./microtask-schedule-fn";
import { macrotaskScheduleFn } from "./macrotask-schedule-fn";

export const resolveLayoutApplyOn = (
  applyOn: LayoutApplyOn | undefined,
): LayoutApplyOnParam => {
  if (applyOn instanceof EventSubject) {
    return {
      type: "trigger",
      trigger: applyOn,
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
