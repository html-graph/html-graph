import { EventSubject } from "@/event-subject";

export type LayoutApplyOn =
  | {
      type: "topologyChangeTimeout";
    }
  | EventSubject<void>;
