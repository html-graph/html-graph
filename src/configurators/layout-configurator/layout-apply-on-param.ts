import { EventSubject } from "@/event-subject";

export type LayourApplyOnParam =
  | {
      readonly type: "topologyChangeTimeout";
    }
  | {
      readonly type: "manual";
      readonly trigger: EventSubject<void>;
    };
