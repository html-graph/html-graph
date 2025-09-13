import { EventSubject } from "@/event-subject";
import { LayoutAlgorithm, TransformationMatrix } from "@/layout-algorithm";

export interface LayoutConfig {
  readonly algorithm: LayoutAlgorithm;
  readonly applyOn: "topologyChange" | EventSubject<void>;
  readonly transform?: TransformationMatrix | undefined;
}
