import { EventSubject } from "@/event-subject";

export type LayoutApplyOn =
  | {
      type: "topologyChangeMacrotask";
    }
  | {
      type: "topologyChangeMicrotask";
    }
  | EventSubject<void>;
