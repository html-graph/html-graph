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
import { StructuredView } from "../structured-view";

export class InteractiveEdgeShape implements StructuredEdgeShape {
  public readonly element: EdgeElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  public readonly view: StructuredView;

  private readonly handle = createEdgeGroup();

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly interactiveLine: SVGPathElement;

  private readonly interactiveSourceArrow: SVGPathElement | null = null;

  private readonly interactiveTargetArrow: SVGPathElement | null = null;

  public constructor(
    private readonly baseEdge: StructuredEdgeShape,
    params?: InteractiveEdgeParams | undefined,
  ) {
    if (baseEdge instanceof InteractiveEdgeShape) {
      throw new InteractiveEdgeError(
        "interactive edge can be configured only once",
      );
    }

    this.element = this.baseEdge.element;
    this.group = this.baseEdge.group;
    this.line = this.baseEdge.line;
    this.sourceArrow = this.baseEdge.sourceArrow;
    this.targetArrow = this.baseEdge.targetArrow;
    this.view = this.baseEdge.view;
    this.onAfterRender = this.baseEdge.onAfterRender;

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

    this.baseEdge.onAfterRender.subscribe((model) => {
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
    this.baseEdge.render(params);
  }
}
