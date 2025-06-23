import { edgeConstants } from "../edge-constants";
import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { createEdgeGroup } from "./create-edge-group";
import { createEdgeLine } from "./create-edge-line";
import { InteractiveEdgeParams } from "./interactive-edge-params";

export class InteractiveEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly interactor = createEdgeGroup();

  private readonly interactiveLine: SVGPathElement;

  private readonly circleSource: SVGCircleElement;

  private readonly circleTarget: SVGCircleElement;

  private readonly clip: SVGClipPathElement;

  public constructor(
    private readonly structuredEdge: StructuredEdgeShape,
    params?: InteractiveEdgeParams,
  ) {
    this.svg = this.structuredEdge.svg;
    this.group = this.structuredEdge.group;
    this.line = this.structuredEdge.line;

    const width = params?.width ?? edgeConstants.interactiveWidth;

    this.interactiveLine = createEdgeLine(width);
    this.interactiveLine.setAttribute("stroke", "red");
    this.interactiveLine.setAttribute("stroke-opacity", "0.5");
    this.interactiveLine.setAttribute("fill-rule", "evenodd");

    this.interactor.appendChild(this.interactiveLine);
    this.group.appendChild(this.interactor);

    this.circleSource = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );

    this.circleSource.setAttribute("r", "10");
    this.circleSource.setAttribute("fill", "black");

    this.interactor.appendChild(this.circleSource);

    this.circleTarget = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );

    this.circleTarget.setAttribute("r", "10");
    this.circleTarget.setAttribute("fill", "black");

    this.interactor.appendChild(this.circleTarget);

    this.clip = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "clipPath",
    );

    this.interactor.appendChild(this.clip);

    this.interactiveLine.addEventListener("click", () => {
      console.log("clicked");
    });

    // const absolutelyPositionedElement = document.querySelector('.absolutely-positioned-element');
    // const underlyingElement = document.querySelector('.underlying-element');
    // absolutelyPositionedElement.addEventListener('click', (event) => {
    //   underlyingElement.dispatchEvent(new event.constructor(event.type, event));
    // });
  }

  public render(params: EdgeRenderParams): void {
    this.structuredEdge.render(params);

    const path = this.line.getAttribute("d")!;
    this.interactiveLine.setAttribute("d", path);

    this.circleSource.setAttribute("cx", "0");
    this.circleSource.setAttribute("cy", "0");
    this.circleTarget.setAttribute("cx", `${this.svg.clientWidth}`);
    this.circleTarget.setAttribute("cy", `${this.svg.clientHeight}`);
  }
}
