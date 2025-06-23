import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { createEdgeGroup } from "./create-edge-group";
import { createEdgeLine } from "./create-edge-line";

export class InteractiveEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  private readonly interactiveGroup = createEdgeGroup();

  private readonly interactiveLine = createEdgeLine(10);

  public constructor(private readonly structuredEdge: StructuredEdgeShape) {
    this.svg = this.structuredEdge.svg;
    this.group = this.structuredEdge.group;
    this.line = this.structuredEdge.line;

    this.interactiveGroup.appendChild(this.interactiveLine);
    this.group.appendChild(this.interactiveGroup);
    this.interactiveLine.setAttribute("stroke", "red");
    this.interactiveLine.setAttribute("stroke-opacity", "0.5");
  }

  public render(params: EdgeRenderParams): void {
    this.structuredEdge.render(params);

    const path = this.line.getAttribute("d")!;
    this.interactiveLine.setAttribute("d", path);
  }
}
