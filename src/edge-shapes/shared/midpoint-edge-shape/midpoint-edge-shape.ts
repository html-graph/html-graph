import { EventHandler } from "@/event-subject";
import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeRenderModel } from "../structured-edge-render-model";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { EdgeElement } from "@/element";
import { StructuredView } from "../structured-view";

export class MidpointEdgeShape implements StructuredEdgeShape {
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

  public readonly view: StructuredView;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  public constructor(
    private readonly baseShape: StructuredEdgeShape,
    public readonly midpointElement: SVGElement,
  ) {
    this.element = this.baseShape.element;
    this.group = this.baseShape.group;
    this.line = this.baseShape.line;
    this.sourceArrow = this.baseShape.sourceArrow;
    this.targetArrow = this.baseShape.targetArrow;
    this.view = this.baseShape.view;

    this.onAfterRender = this.baseShape.onAfterRender;
    this.element.append(this.midpointElement);

    this.baseShape.onAfterRender.subscribe((model) => {
      const { midpoint } = model.edgePath;
      const transform = `translate(${midpoint.x}px, ${midpoint.y}px)`;

      this.midpointElement.style.setProperty("transform", transform);
    });
  }

  public render(params: EdgeRenderParams): void {
    this.baseShape.render(params);
  }
}
