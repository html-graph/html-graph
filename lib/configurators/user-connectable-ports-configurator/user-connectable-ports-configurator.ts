import { Canvas } from "@/canvas";
import { isPointOnElement, isPointOnWindow } from "../utils";
import { Point } from "@/point";

/**
 * Responsibility: Configuring ports connectable via drag
 */
export class UserConnectablePortsConfigurator {
  private readonly ports = new Map<HTMLElement, unknown>();

  private readonly window = window;

  private previousTouchCoordinates: Point | null = null;

  private readonly onPortMouseDown = (event: MouseEvent): void => {
    event.stopImmediatePropagation();

    this.handlePortGrab(event.currentTarget as HTMLElement);
    this.window.addEventListener("mousemove", this.onWindowMouseMove);
    this.window.addEventListener("mouseup", this.onWindowMouseUp);
  };

  private readonly onWindowMouseMove = (event: MouseEvent): void => {
    if (
      !isPointOnElement(this.element, event.clientX, event.clientY) ||
      !isPointOnWindow(this.window, event.clientX, event.clientY)
    ) {
      this.stopMouseDrag();
      return;
    }

    // drag port
  };

  private readonly onWindowMouseUp = (): void => {
    this.stopMouseDrag();
  };

  private readonly onPortTouchStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      this.stopTouchDrag();
      return;
    }

    event.stopImmediatePropagation();

    this.previousTouchCoordinates = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    this.handlePortGrab(event.currentTarget as HTMLElement);
    this.window.addEventListener("touchmove", this.onWindowTouchMove);
    this.window.addEventListener("touchend", this.onWindowTouchFinish);
    this.window.addEventListener("touchcancel", this.onWindowTouchFinish);
  };

  private readonly onWindowTouchMove = (event: TouchEvent): void => {
    const touch = event.touches[0];

    if (
      !isPointOnElement(this.element, touch.clientX, touch.clientY) ||
      !isPointOnWindow(this.window, touch.clientX, touch.clientY)
    ) {
      this.stopMouseDrag();
      return;
    }

    console.log(this.previousTouchCoordinates);
    // drag port
  };

  private readonly onWindowTouchFinish = (): void => {
    this.stopTouchDrag();
  };

  private readonly onAfterPortMarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;

    this.hookPortElement(port.element);

    this.ports.set(port.element, portId);
  };

  private readonly onBeforePortUnmarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;

    this.unhookPortElement(port.element);

    this.ports.delete(port.element);
  };

  private readonly onBeforeClear = (): void => {
    this.ports.forEach((_portId, element) => {
      this.unhookPortElement(element);
    });

    this.ports.clear();
  };

  private readonly onBeforeDestroy = (): void => {
    this.canvas.graph.onAfterPortMarked.unsubscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.unsubscribe(
      this.onBeforePortUnmarked,
    );
    this.canvas.graph.onBeforeClear.unsubscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
    this.stopMouseDrag();
    this.stopTouchDrag();
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
  ) {
    this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked);
    this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(canvas: Canvas, element: HTMLElement): void {
    new UserConnectablePortsConfigurator(canvas, element);
  }

  private hookPortElement(element: HTMLElement): void {
    element.addEventListener("mousedown", this.onPortMouseDown);
    element.addEventListener("touchstart", this.onPortTouchStart);
  }

  private unhookPortElement(element: HTMLElement): void {
    element.removeEventListener("mousedown", this.onPortMouseDown);
    element.removeEventListener("touchstart", this.onPortTouchStart);
  }

  private handlePortGrab(portElement: HTMLElement): void {
    const portId = this.ports.get(portElement);

    const edges = this.canvas.graph.getPortAdjacentEdgeIds(portId)!;

    console.log(edges);
  }

  private stopMouseDrag(): void {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }

  private stopTouchDrag(): void {
    this.previousTouchCoordinates = null;
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
}
