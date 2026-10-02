import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { createEdgeGroup } from "./create-edge-group";
import { createEdgeLine } from "./create-edge-line";
import { InteractiveEdgeParams } from "./interactive-edge-params";
import { createEdgeArrow } from "./create-edge-arrow";
import { edgeConstants } from "../edge-constants";
import { InteractiveEdgeError } from "./interactive-edge-error";
import { EventHandler } from "@/event-subject";
import { StructuredEdgeRenderModel } from "../structured-edge-render-model";
import { EdgeElement } from "@/element";
import { StructuredEdgeView } from "../structured-view";
import { StructuredEdgeModel } from "../structured-edge-shape-model";

/**
 * @deprecated
 * use interactiveDistance parameter instead
 */
export class InteractiveEdgeShape implements StructuredEdgeShape {
  public readonly element: EdgeElement;

  /**
   * @deprecated
   * use view.group instead
   */
  public readonly group: SVGGElement;

  /**
   * @deprecated
   * use view.line instead
   */
  public readonly line: SVGPathElement;

  /**
   * @deprecated
   * use view.sourceArrow instead
   */
  public readonly sourceArrow: SVGPathElement | null;

  /**
   * @deprecated
   * use view.targetArrow instead
   */
  public readonly targetArrow: SVGPathElement | null;

  public readonly view: StructuredEdgeView;

  private readonly handle = createEdgeGroup();

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  public readonly onModelChange: EventHandler<StructuredEdgeModel>;

  private readonly interactiveLine: SVGPathElement;

  private readonly interactiveSourceArrow: SVGPathElement | null = null;

  private readonly interactiveTargetArrow: SVGPathElement | null = null;

  public constructor(
    private readonly baseShape: StructuredEdgeShape,
    params?: InteractiveEdgeParams | undefined,
  ) {
    if (baseShape instanceof InteractiveEdgeShape) {
      throw new InteractiveEdgeError(
        "interactive edge can be configured only once",
      );
    }

    this.element = this.baseShape.element;
    this.group = this.baseShape.group;
    this.line = this.baseShape.line;
    this.sourceArrow = this.baseShape.sourceArrow;
    this.targetArrow = this.baseShape.targetArrow;
    this.view = this.baseShape.view;
    this.onAfterRender = this.baseShape.onAfterRender;
    this.onModelChange = this.baseShape.onModelChange;

    const width = params?.distance ?? edgeConstants.interactiveWidth;

    this.interactiveLine = createEdgeLine(width);
    this.handle.appendChild(this.interactiveLine);

    if (this.sourceArrow !== null) {
      this.interactiveSourceArrow = createEdgeArrow(width);
      this.handle.appendChild(this.interactiveSourceArrow);
    }

    if (this.targetArrow !== null) {
      this.interactiveTargetArrow = createEdgeArrow(width);
      this.handle.appendChild(this.interactiveTargetArrow);
    }

    this.group.appendChild(this.handle);

    this.baseShape.onAfterRender.subscribe((model) => {
      this.interactiveLine.setAttribute("d", model.edgePath.path);

      if (this.interactiveSourceArrow !== null) {
        this.interactiveSourceArrow.setAttribute("d", model.sourceArrowPath!);
      }

      if (this.interactiveTargetArrow !== null) {
        this.interactiveTargetArrow.setAttribute("d", model.targetArrowPath!);
      }
    });
  }

  public render(params: EdgeRenderParams): void {
    this.baseShape.render(params);
  }
}
