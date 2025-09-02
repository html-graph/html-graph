import { EventHandler } from "@/event-subject";
import { LayoutAlgorithm, TransformationMatrix } from "@/layout-algorithm";

export interface LayoutConfig {
  readonly algorithm: LayoutAlgorithm;
  readonly applyOn:
    | {
        readonly type: "topologyChange";
      }
    | {
        readonly type: "manual";
        readonly trigger: EventHandler<void>;
      };
  readonly transform?: TransformationMatrix | undefined;
}
