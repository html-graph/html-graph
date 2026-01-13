import { EventSubject } from "@/event-subject";

export type LayoutApplyOnParam =
  | {
      readonly type: "topologyChangeMicrotask";
    }
  | {
      readonly type: "topologyChangeMacrotask";
    }
  | {
      readonly type: "manual";
      readonly trigger: EventSubject<void>;
    };
