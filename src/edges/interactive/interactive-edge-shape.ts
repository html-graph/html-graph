import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { createEdgeGroup } from "./create-edge-group";
import { createEdgeLine } from "./create-edge-line";
import { InteractiveEdgeParams } from "./interactive-edge-params";
import { createEdgeArrow } from "./create-edge-arrow";
import { edgeConstants } from "../edge-constants";
import { InteractiveEdgeError } from "./interactive-edge-error";

/**
 * Responsibility: Providing handle for attaching interactive behavior to an
 * edge
 */
export class InteractiveEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  public readonly handle = createEdgeGroup();

  private readonly interactiveLine: SVGPathElement;

  private readonly interactiveSourceArrow: SVGPathElement | null = null;

  private readonly interactiveTargetArrow: SVGPathElement | null = null;

  public constructor(
    private readonly structuredEdge: StructuredEdgeShape,
    params?: InteractiveEdgeParams,
  ) {
    if (structuredEdge instanceof InteractiveEdgeShape) {
      throw new InteractiveEdgeError(
        "interactive edge can be configured only once",
      );
    }

    this.svg = this.structuredEdge.svg;
    this.group = this.structuredEdge.group;
    this.line = this.structuredEdge.line;
    this.sourceArrow = this.structuredEdge.sourceArrow;
    this.targetArrow = this.structuredEdge.targetArrow;

    const width = params?.width ?? edgeConstants.interactiveWidth;

    this.interactiveLine = createEdgeLine(width);
    this.handle.appendChild(this.interactiveLine);

    if (this.sourceArrow) {
      this.interactiveSourceArrow = createEdgeArrow(width);
      this.handle.appendChild(this.interactiveSourceArrow);
    }

    if (this.targetArrow) {
      this.interactiveTargetArrow = createEdgeArrow(width);
      this.handle.appendChild(this.interactiveTargetArrow);
    }

    this.group.appendChild(this.handle);
  }

  public render(params: EdgeRenderParams): void {
    this.structuredEdge.render(params);

    const linePath = this.line.getAttribute("d")!;
    this.interactiveLine.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = this.sourceArrow.getAttribute("d")!;
      this.interactiveSourceArrow!.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = this.targetArrow.getAttribute("d")!;
      this.interactiveTargetArrow!.setAttribute("d", arrowPath);
    }
  }
}
