import { LayoutApplyOnParam } from "@/configurators";
import { LayoutApplyOn } from "../layout-apply-on";
import { EventSubject } from "@/event-subject";

export const resolveLayoutApplyOn = (
  applyOn: LayoutApplyOn | undefined,
): LayoutApplyOnParam => {
  if (applyOn instanceof EventSubject) {
    return {
      type: "manual",
      trigger: applyOn,
    };
  }

  if (applyOn?.type === "topologyChangeMacrotask") {
    return {
      type: "topologyChangeMacrotask",
    };
  }

  return {
    type: "topologyChangeMicrotask",
  };
};
