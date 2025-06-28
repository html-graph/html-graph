import { Canvas } from "@/canvas";
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

  private readonly interactiveGroup = createEdgeGroup();

  private readonly interactiveLine: SVGPathElement;

  private readonly interactiveSourceArrow: SVGPathElement | null = null;

  private readonly interactiveTargetArrow: SVGPathElement | null = null;

  private readonly onInteraction: () => void;

  private mouseDownHandler = (): void => {
    console.log(this.canvas.graph);
    // const elements = document.elementsFromPoint(event.clientX, event.clientY);

    // const nextElement = elements.find(
    //   (element) =>
    //     element !== event.currentTarget && element !== this.interactiveLine,
    // );

    // if (nextElement !== undefined) {
    //   event.stopPropagation();
    //   nextElement.dispatchEvent(new MouseEvent(event.type, event));
    // }

    this.onInteraction();
  };

  private touchStartHandler = (): void => {
    // console.log(this.canvas.graph);
    // if (event.touches.length !== 1) {
    //   return;
    // }

    // const touch = event.touches[0];
    // const elements = document.elementsFromPoint(touch.clientX, touch.clientY);

    // const nextElement = elements.find(
    //   (element) =>
    //     element !== event.currentTarget && element !== this.interactiveLine,
    // );

    // if (nextElement !== undefined) {
    //   event.stopPropagation();

    //   const newEvent = new TouchEvent(event.type, {
    //     bubbles: event.bubbles,
    //     touches: this.arrayFromTouches(event.touches),
    //     targetTouches: this.arrayFromTouches(event.targetTouches),
    //     changedTouches: this.arrayFromTouches(event.changedTouches),
    //   });

    //   nextElement.dispatchEvent(newEvent);
    // }

    this.onInteraction();
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

    this.onInteraction = params.onInteraction;

    this.interactiveLine = createEdgeLine(params.width);
    this.interactiveLine.setAttribute("stroke", "red");
    this.interactiveLine.setAttribute("stroke-opacity", "0.5");
    this.interactiveGroup.appendChild(this.interactiveLine);

    if (this.sourceArrow) {
      this.interactiveSourceArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      this.interactiveSourceArrow.setAttribute("stroke-linejoin", "bevel");
      this.interactiveSourceArrow.setAttribute(
        "stroke-width",
        `${params.width}`,
      );
      this.interactiveSourceArrow.setAttribute("fill", "transparent");
      this.interactiveSourceArrow.setAttribute("stroke", "red");
      this.interactiveSourceArrow.setAttribute("stroke-opacity", "0.5");
      this.interactiveGroup.appendChild(this.interactiveSourceArrow);
    }

    if (this.targetArrow) {
      this.interactiveTargetArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      this.interactiveTargetArrow.setAttribute("fill", "transparent");
      this.interactiveTargetArrow.setAttribute("stroke-linejoin", "round");
      this.interactiveTargetArrow.setAttribute(
        "stroke-width",
        `${params.width}`,
      );
      this.interactiveTargetArrow.setAttribute("stroke", "red");
      this.interactiveTargetArrow.setAttribute("stroke-opacity", "0.5");
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

  // private arrayFromTouches(touches: TouchList): Touch[] {
  //   const res: Touch[] = [];

  //   for (let i = 0; i < touches.length; i++) {
  //     res.push(touches[i]);
  //   }

  //   return res;
  // }
}
