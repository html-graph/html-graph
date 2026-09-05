import { Canvas } from "@/canvas";
import { createHost } from "./create-host";
import { createSelectionRectangleWrapper } from "./create-selection-rectangle-wrapper";
import { Point } from "@/point";
import { RectangularSelectionParams } from "./rectangular-selection-params";
import { PointInsideVerifier } from "../shared";

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

    if (!this.params.mouseDownEventVerifier(mouseEvent)) {
      return;
    }

    this.params.onSelectionStarted();

    const rect = this.mainElement.getBoundingClientRect();

    const cursorViewportCoords: Point = {
      x: mouseEvent.clientX - rect.x,
      y: mouseEvent.clientY - rect.y,
    };

    this.initialContentPoint =
      this.canvas.viewport.createContentCoords(cursorViewportCoords);
    this.draggingViewportPoint = cursorViewportCoords;

    this.updateSelectionRectangle();
    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated); // ?

    this.host.appendChild(this.selectionRectangleWrapper);
    this.win.addEventListener("mousemove", this.onWindowMouseMove);
    this.win.addEventListener("mouseup", this.onWindowMouseUp);
  };

  private readonly onWindowMouseMove: EventListener = (event: Event) => {
    const mouseEvent = event as MouseEvent;

    if (
      !this.pointInsideVerifier.verify(mouseEvent.clientX, mouseEvent.clientY)
    ) {
      this.removeMouseListeners();
      this.interruptSelection();
      return;
    }

    const rect = this.mainElement.getBoundingClientRect();

    const cursorViewportCoords: Point = {
      x: mouseEvent.clientX - rect.x,
      y: mouseEvent.clientY - rect.y,
    };

    this.draggingViewportPoint = cursorViewportCoords;
    this.updateSelectionRectangle();

    const selectionRect =
      this.selectionRectangleWrapper.getBoundingClientRect();

    this.params.onSelectionChange(selectionRect);
  };

  private readonly onWindowMouseUp: EventListener = (event) => {
    const mouseEvent = event as MouseEvent;

    if (!this.params.mouseUpEventVerifier(mouseEvent)) {
      return;
    }

    this.removeMouseListeners();
    this.finishSelection();
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly mainElement: HTMLElement,
    private readonly overlayLayer: HTMLElement,
    private readonly pointInsideVerifier: PointInsideVerifier,
    private readonly win: Window,
    private readonly params: RectangularSelectionParams,
  ) {
    this.overlayLayer.appendChild(this.host);
    this.selectionRectangleWrapper.appendChild(this.params.rectangleElement);

    this.mainElement.addEventListener("mousedown", this.onCanvasMouseDown);

    this.canvas.onBeforeDestroy.subscribe(() => {
      this.mainElement.removeEventListener("mousedown", this.onCanvasMouseDown);
      this.removeMouseListeners();
    });
  }

  public static configure(
    canvas: Canvas,
    mainElement: HTMLElement,
    overlayLayer: HTMLElement,
    pointInsideVerifier: PointInsideVerifier,
    win: Window,
    params: RectangularSelectionParams,
  ): void {
    new RectangularSelectionConfigurator(
      canvas,
      mainElement,
      overlayLayer,
      pointInsideVerifier,
      win,
      params,
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

  private removeMouseListeners(): void {
    this.win.removeEventListener("mousemove", this.onWindowMouseMove);
    this.win.removeEventListener("mouseup", this.onWindowMouseUp);
  }

  private finishSelection(): void {
    const selectionRect =
      this.selectionRectangleWrapper.getBoundingClientRect();
    this.host.removeChild(this.selectionRectangleWrapper);
    // TODO: unsubscribe viewport update
    this.params.onSelectionFinished(selectionRect);
  }

  private interruptSelection(): void {
    const selectionRect =
      this.selectionRectangleWrapper.getBoundingClientRect();
    this.host.removeChild(this.selectionRectangleWrapper);
    // TODO: unsubscribe viewport update
    this.params.onSelectionInterrupted(selectionRect);
  }
}
