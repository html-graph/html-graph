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

  private readonly interactor = createEdgeGroup();

  private readonly interactiveLine: SVGPathElement;

  private readonly circleSource: SVGCircleElement;

  private readonly circleTarget: SVGCircleElement;

  private readonly clip: SVGClipPathElement;

  private readonly onInteraction = (): void => {};

  private portMouseDownHandler = (event: MouseEvent): void => {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);

    const nextElement = elements.find(
      (element) =>
        element !== event.currentTarget && element !== this.interactiveLine,
    );

    if (nextElement !== undefined) {
      event.stopPropagation();
      nextElement.dispatchEvent(new MouseEvent(event.type, event));
    }
  };

  private portTouchStartHandler = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);

    const nextElement = elements.find(
      (element) =>
        element !== event.currentTarget && element !== this.interactiveLine,
    );

    if (nextElement !== undefined) {
      event.stopPropagation();
      nextElement.dispatchEvent(new MouseEvent(event.type, event));
    }
  };

  public constructor(
    private readonly structuredEdge: StructuredEdgeShape,
    params?: InteractiveEdgeParams,
  ) {
    this.svg = this.structuredEdge.svg;
    this.group = this.structuredEdge.group;
    this.line = this.structuredEdge.line;

    const width = params?.width ?? edgeConstants.interactiveWidth;

    this.onInteraction = params?.onInteractionStart ?? ((): void => {});

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

    this.interactiveLine.addEventListener(
      "mousedown",
      (event) => {
        event.stopPropagation();
        this.onInteraction();
      },
      { passive: true },
    );

    this.interactiveLine.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1) {
          return;
        }
        event.stopPropagation();
        this.onInteraction();
      },
      { passive: true },
    );

    this.circleSource.addEventListener("mousedown", this.portMouseDownHandler, {
      passive: true,
    });

    this.circleSource.addEventListener(
      "touchstart",
      this.portTouchStartHandler,
      {
        passive: true,
      },
    );

    this.circleTarget.addEventListener("mousedown", this.portMouseDownHandler, {
      passive: true,
    });

    this.circleTarget.addEventListener(
      "touchstart",
      this.portTouchStartHandler,
      {
        passive: true,
      },
    );
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
