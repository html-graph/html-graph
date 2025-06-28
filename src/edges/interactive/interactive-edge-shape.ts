import { Canvas } from "@/canvas";
import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { createEdgeGroup } from "./create-edge-group";
import { createEdgeLine } from "./create-edge-line";
import { InteractiveEdgeParams } from "./interactive-edge-params";
import { createEdgeArrow } from "./create-edge-arrow";
import { Point } from "@/point";

export class InteractiveEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  private readonly interactiveGroup = createEdgeGroup();

  private readonly interactiveLine: SVGPathElement;

  private readonly interactiveSourceArrow: SVGPathElement | null = null;

  private readonly interactiveTargetArrow: SVGPathElement | null = null;

  private readonly onInteractionStart: () => void;

  private readonly mouseDownHandler = (event: MouseEvent): void => {
    event.stopPropagation();

    const portElement = this.findPortElementForPoint({
      x: event.clientX,
      y: event.clientY,
    });

    if (portElement !== null) {
      portElement.dispatchEvent(new MouseEvent(event.type, event));
    } else {
      this.onInteractionStart();
    }
  };

  private readonly touchStartHandler = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];

    event.stopPropagation();

    const portElement = this.findPortElementForPoint({
      x: touch.clientX,
      y: touch.clientY,
    });

    if (portElement !== null) {
      const newEvent = new TouchEvent(event.type, {
        bubbles: event.bubbles,
        touches: this.arrayFromTouches(event.touches),
        targetTouches: this.arrayFromTouches(event.targetTouches),
        changedTouches: this.arrayFromTouches(event.changedTouches),
      });

      portElement.dispatchEvent(newEvent);
    } else {
      this.onInteractionStart();
    }
  };

  public constructor(
    private readonly structuredEdge: StructuredEdgeShape,
    params: InteractiveEdgeParams,
    private readonly canvas: Canvas,
  ) {
    this.svg = this.structuredEdge.svg;
    this.group = this.structuredEdge.group;
    this.line = this.structuredEdge.line;
    this.sourceArrow = this.structuredEdge.sourceArrow;
    this.targetArrow = this.structuredEdge.targetArrow;

    this.onInteractionStart = params.onInteractionStart;

    this.interactiveLine = createEdgeLine(params.width);
    this.interactiveGroup.appendChild(this.interactiveLine);

    if (this.sourceArrow) {
      this.interactiveSourceArrow = createEdgeArrow(params.width);
      this.interactiveGroup.appendChild(this.interactiveSourceArrow);
    }

    if (this.targetArrow) {
      this.interactiveTargetArrow = createEdgeArrow(params.width);
      this.interactiveGroup.appendChild(this.interactiveTargetArrow);
    }

    this.group.appendChild(this.interactiveGroup);

    this.interactiveGroup.addEventListener("mousedown", this.mouseDownHandler, {
      passive: true,
    });

    this.interactiveGroup.addEventListener(
      "touchstart",
      this.touchStartHandler,
      { passive: true },
    );
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

  private findPortElementForPoint(point: Point): HTMLElement | null {
    const elements = document.elementsFromPoint(point.x, point.y);

    for (const element of elements) {
      const portElement = this.findPortElementForElement(
        element as HTMLElement,
      );

      if (portElement) {
        return portElement;
      }
    }

    return null;
  }

  private findPortElementForElement(element: HTMLElement): HTMLElement | null {
    let elementBuf: HTMLElement | null = element;

    while (elementBuf !== null) {
      const portIds = this.canvas.graph.getElementPortsIds(elementBuf);

      if (portIds.length > 0) {
        return elementBuf;
      }

      elementBuf = elementBuf.parentElement;
    }

    return null;
  }

  private arrayFromTouches(touches: TouchList): Touch[] {
    const res: Touch[] = [];

    for (let i = 0; i < touches.length; i++) {
      res.push(touches[i]);
    }

    return res;
  }
}
