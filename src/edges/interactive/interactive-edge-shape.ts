import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { createEdgeGroup } from "./create-edge-group";
import { createEdgeLine } from "./create-edge-line";
import { InteractiveEdgeParams } from "./interactive-edge-params";

export class InteractiveEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  private readonly interactor = createEdgeGroup();

  private readonly interactiveLine: SVGPathElement;

  private readonly onInteraction = (): void => {};

  private mouseDownHandler = (event: MouseEvent): void => {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);

    const nextElement = elements.find(
      (element) =>
        element !== event.currentTarget && element !== this.interactiveLine,
    );

    if (nextElement !== undefined) {
      event.stopPropagation();
      nextElement.dispatchEvent(new MouseEvent(event.type, event));
    }

    this.onInteraction();
  };

  private touchStartHandler = (event: TouchEvent): void => {
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

      const newEvent = new TouchEvent(event.type, {
        bubbles: event.bubbles,
        touches: this.arrayFromTouches(event.touches),
        targetTouches: this.arrayFromTouches(event.targetTouches),
        changedTouches: this.arrayFromTouches(event.changedTouches),
      });

      nextElement.dispatchEvent(newEvent);
    }

    this.onInteraction();
  };

  public constructor(
    private readonly structuredEdge: StructuredEdgeShape,
    params: InteractiveEdgeParams,
  ) {
    this.svg = this.structuredEdge.svg;
    this.group = this.structuredEdge.group;
    this.line = this.structuredEdge.line;
    this.sourceArrow = this.structuredEdge.sourceArrow;
    this.targetArrow = this.structuredEdge.targetArrow;

    this.onInteraction = params.onInteraction;

    this.interactiveLine = createEdgeLine(params.width);
    this.interactiveLine.setAttribute("stroke", "red");
    this.interactiveLine.setAttribute("stroke-opacity", "0.5");
    this.interactiveLine.setAttribute("fill-rule", "evenodd");

    this.interactor.appendChild(this.interactiveLine);
    this.group.appendChild(this.interactor);

    this.interactiveLine.addEventListener("mousedown", this.mouseDownHandler, {
      passive: true,
    });

    this.interactiveLine.addEventListener(
      "touchstart",
      this.touchStartHandler,
      { passive: true },
    );
  }

  public render(params: EdgeRenderParams): void {
    this.structuredEdge.render(params);

    const path = this.line.getAttribute("d")!;
    this.interactiveLine.setAttribute("d", path);
  }

  private arrayFromTouches(touches: TouchList): Touch[] {
    const res: Touch[] = [];

    for (let i = 0; i < touches.length; i++) {
      res.push(touches[i]);
    }

    return res;
  }
}
