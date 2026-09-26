import { EventHandler } from "@/event-subject";
import { EdgeShape } from "./edge-shape";
import { StructuredEdgeRenderModel } from "./structured-edge-render-model";
import { StructuredView } from "./structured-view";

export interface StructuredEdgeShape extends EdgeShape {
  /**
   * @deprecated
   * use view.group instead
   */
  readonly group: SVGGElement;
  /**
   * @deprecated
   * use view.line instead
   */
  readonly line: SVGPathElement;
  /**
   * @deprecated
   * use view.sourceArrow instead
   */
  readonly sourceArrow: SVGPathElement | null;
  /**
   * @deprecated
   * use view.targetArrow instead
   */
  readonly targetArrow: SVGPathElement | null;
  readonly view: StructuredView;
  readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;
}
