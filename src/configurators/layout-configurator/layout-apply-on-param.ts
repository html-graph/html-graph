import { EventSubject } from "@/event-subject";
import { ScheduleFn } from "@/schedule-fn";

export type LayoutApplyOnParam =
  | {
      readonly type: "topologyChangeSchedule";
      readonly schedule: ScheduleFn;
    }
  | {
      readonly type: "trigger";
      readonly trigger: EventSubject<void>;
    };
