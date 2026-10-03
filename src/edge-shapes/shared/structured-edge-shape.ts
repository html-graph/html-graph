import { EventHandler } from "@/event-subject";
import { EdgeShape } from "./edge-shape";
import { StructuredEdgeRenderModel } from "./structured-edge-render-model";
import { StructuredEdgeView } from "./structured-view";
import { StructuredEdgeModel } from "./structured-edge-shape-model";

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
  readonly view: StructuredEdgeView;

  /**
   * @deprecated
   * use onModelChange instead
   */
  readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  readonly onModelChange: EventHandler<StructuredEdgeModel>;
}
