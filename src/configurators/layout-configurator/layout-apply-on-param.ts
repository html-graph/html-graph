import { EventSubject } from "@/event-subject";
import { ApplyScheduleFn } from "./apply-schedule-fn";

export type LayoutApplyOnParam =
  | {
      readonly type: "topologyChangeSchedule";
      readonly schedule: ApplyScheduleFn;
    }
  | {
      readonly type: "trigger";
      readonly trigger: EventSubject<void>;
    };
