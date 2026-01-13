import { EventSubject } from "@/event-subject";

export type LayoutApplyOn =
  | {
      /**
       * @deprecated
       * use "topologyChangeMacrotask" instead
       */
      type: "topologyChangeTimeout";
    }
  | {
      type: "topologyChangeMacrotask";
    }
  | {
      type: "topologyChangeMicrotask";
    }
  | EventSubject<void>;
