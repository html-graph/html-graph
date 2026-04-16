import { EventSubject } from "@/event-subject";

/**
 * @deprecated
 * use topologyChangeMicrotask instead
 */
type TopologyChangeMacrotask = {
  type: "topologyChangeMacrotask";
};

type TopologyChangeMicrotask = {
  type: "topologyChangeMicrotask";
};

export type LayoutApplyOn =
  | TopologyChangeMacrotask
  | TopologyChangeMicrotask
  | EventSubject<void>;
