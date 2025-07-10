import { EventHandler } from "@/event-subject";
import { EdgeShape } from "./edge-shape";
import { StructuredEdgeRenderModel } from "./structure-render-model";

// Responsibility: Specifying EdgeShape with a standard visual structure
export interface StructuredEdgeShape extends EdgeShape {
  readonly group: SVGGElement;
  readonly line: SVGPathElement;
  readonly sourceArrow: SVGPathElement | null;
  readonly targetArrow: SVGPathElement | null;
  readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;
}
