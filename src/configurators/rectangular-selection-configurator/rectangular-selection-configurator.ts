import { Canvas } from "@/canvas";
import { createHost } from "./create-host";
import { createSelectionRectangleWrapper } from "./create-selection-rectangle-wrapper";
import { Point } from "@/point";

export class RectangularSelectionConfigurator {
  private readonly host = createHost();

  private readonly selectionRectangleWrapper =
    createSelectionRectangleWrapper();

  private initialContentPoint: Point | null = null;

  private draggingViewportPoint: Point | null = null;

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

    this.initialContentPoint =
      this.canvas.viewport.createContentCoords(cursorViewportCoords);
    this.draggingViewportPoint = cursorViewportCoords;

    this.updateSelectionRectangle();
    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated);

    this.host.appendChild(this.selectionRectangleWrapper);
    this.win.addEventListener("mousemove", this.onWindowMouseMove);
    this.win.addEventListener("mouseup", this.onWindowMouseUp);
  };

  private readonly onWindowMouseMove: EventListener = (event: Event) => {
    const mouseEvent = event as MouseEvent;
    const rect = this.mainElement.getBoundingClientRect();

    const cursorViewportCoords: Point = {
      x: mouseEvent.clientX - rect.x,
      y: mouseEvent.clientY - rect.y,
    };

    this.draggingViewportPoint = cursorViewportCoords;
    this.updateSelectionRectangle();
  };

  private readonly onWindowMouseUp: EventListener = () => {
    this.host.removeChild(this.selectionRectangleWrapper);
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
    const initialViewportPoint = this.canvas.viewport.createViewportCoords(
      this.initialContentPoint!,
    );
    const draggingViewportPoint = this.draggingViewportPoint!;
    const m = this.canvas.viewport.getContentMatrix();

    const originX = Math.min(initialViewportPoint.x, draggingViewportPoint.x);
    const originY = Math.min(initialViewportPoint.y, draggingViewportPoint.y);
    const width = Math.abs(draggingViewportPoint.x - initialViewportPoint.x);
    const height = Math.abs(draggingViewportPoint.y - initialViewportPoint.y);

    const { style } = this.selectionRectangleWrapper;

    style.left = `${originX + m.x}px`;
    style.top = `${originY + m.y}px`;
    style.width = `${width}px`;
    style.height = `${height}px`;
  }
}
