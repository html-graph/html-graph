import { EventHandler } from "@/event-subject";
import { EdgeShape } from "./edge-shape";
import { StructuredEdgeView } from "./structured-view";
import { StructuredEdgeModel } from "./structured-edge-shape-model";

export interface StructuredEdgeShape extends EdgeShape {
  readonly view: StructuredEdgeView;

  readonly onModelChange: EventHandler<StructuredEdgeModel>;
}
