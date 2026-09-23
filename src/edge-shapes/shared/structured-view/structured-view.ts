import { createEdgeArrow } from "./create-edge-arrow";
import { createEdgePath } from "./create-edge-path";
import { createEdgeSvg } from "./create-edge-svg";
import { StructuredViewParams } from "./structured-view-params";

export class StructuredView {
  public readonly element: SVGSVGElement;

  public readonly group = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null = null;

  public readonly targetArrow: SVGPathElement | null = null;

  public constructor(params: StructuredViewParams) {
    this.element = createEdgeSvg(params.color);
    this.element.appendChild(this.group);
    this.line = createEdgePath(params.width);
    this.group.appendChild(this.line);

    if (params.hasSourceArrow) {
      this.sourceArrow = createEdgeArrow();
      this.group.appendChild(this.sourceArrow);
    }

    if (params.hasTargetArrow) {
      this.targetArrow = createEdgeArrow();
      this.group.appendChild(this.targetArrow);
    }
  }
}
