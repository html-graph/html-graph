import { EventSubject } from "@/event-subject";
import { LayoutAlgorithm } from "@/layout-algorithm";

export interface LayoutConfig {
  readonly algorithm: LayoutAlgorithm;
  readonly applyOn: "topologyChangeTimeout" | EventSubject<void>;
}
