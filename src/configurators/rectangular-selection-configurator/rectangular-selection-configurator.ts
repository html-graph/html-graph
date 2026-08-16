import { Canvas } from "@/canvas";
import { createHost } from "./create-host";
import { createSelectionRectangleWrapper } from "./create-selection-rectangle-wrapper";
import { Point } from "@/point";

export class RectangularSelectionConfigurator {
  private readonly host = createHost();

  private readonly selectionRectangleWrapper =
    createSelectionRectangleWrapper();

  private initialPoint: Point | null = null;

  private draggingPoint: Point | null = null;

  private readonly onAfterViewportUpdated = (): void => {
    this.updateSelectionRectangle();
  };

  private readonly onCanvasMouseDown: EventListener = (event: Event) => {
    const mouseEvent = event as MouseEvent;

    const rect = this.mainElement.getBoundingClientRect();

    const cursorViewportCoords: Point = {
      x: mouseEvent.clientX - rect.x,
      y: mouseEvent.clientY - rect.y,
    };

    this.initialPoint = cursorViewportCoords;
    this.draggingPoint = cursorViewportCoords;

    this.updateSelectionRectangle();
    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated);

    this.host.append(this.selectionRectangleWrapper);
    this.win.addEventListener("mousemove", this.onWindowMouseMove);
  };

  private readonly onWindowMouseMove: EventListener = (event: Event) => {
    const mouseEvent = event as MouseEvent;
    const rect = this.mainElement.getBoundingClientRect();

    const cursorViewportCoords: Point = {
      x: mouseEvent.clientX - rect.x,
      y: mouseEvent.clientY - rect.y,
    };

    this.draggingPoint = cursorViewportCoords;
    this.updateSelectionRectangle();
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly mainElement: HTMLElement,
    private readonly overlayLayer: HTMLElement,
    private readonly win: Window,
  ) {
    this.overlayLayer.appendChild(this.host);

    this.mainElement.addEventListener("mousedown", this.onCanvasMouseDown);
  }

  public static configure(
    canvas: Canvas,
    mainElement: HTMLElement,
    overlayLayer: HTMLElement,
    win: Window,
  ): void {
    new RectangularSelectionConfigurator(
      canvas,
      mainElement,
      overlayLayer,
      win,
    );
  }

  private updateSelectionRectangle(): void {
    const initialPoint = this.initialPoint!;
    const draggingPoint = this.draggingPoint!;
    const m = this.canvas.viewport.getContentMatrix();

    const { style } = this.selectionRectangleWrapper;

    style.left = `${m.x + initialPoint.x}px`;
    style.top = `${m.y + initialPoint.y}px`;
    style.width = `${draggingPoint.x - initialPoint.x}px`;
    style.height = `${draggingPoint.y - initialPoint.y}px`;
  }
}
