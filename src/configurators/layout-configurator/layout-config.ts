import { EventSubject } from "@/event-subject";
import { LayoutAlgorithm } from "@/layout-algorithm";

export interface LayoutParams {
  readonly algorithm: LayoutAlgorithm;
  readonly applyOn: "topologyChangeTimeout" | EventSubject<void>;
}
