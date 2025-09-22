import { LayourApplyOnParam } from "@/configurators";
import { LayoutApplyOn } from "../layout-apply-on";
import { EventSubject } from "@/event-subject";

export const resolveLayoutApplyOn = (
  applyOn: LayoutApplyOn,
): LayourApplyOnParam => {
  if (applyOn instanceof EventSubject) {
    return {
      type: "manual",
      trigger: applyOn,
    };
  }

  return {
    type: "topologyChangeTimeout",
  };
};
