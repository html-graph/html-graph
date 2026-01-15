import { Canvas } from "@/canvas";
import { isPointInside } from "../is-point-inside";
import { DraggablePortsParams } from "./draggable-ports-params";
import { Identifier } from "@/identifier";

export class DraggablePortsConfigurator {
  private readonly onAfterPortMarked = (portId: Identifier): void => {
    const port = this.canvas.graph.getPort(portId)!;
    const elementPortIds = this.canvas.graph.findPortIdsByElement(port.element);

    if (elementPortIds.length === 1) {
      this.hookPortEvents(port.element);
    }
  };

  private readonly onBeforePortUnmarked = (portId: Identifier): void => {
    const port = this.canvas.graph.getPort(portId)!;
    const elementPortIds = this.canvas.graph.findPortIdsByElement(port.element);

    if (elementPortIds.length === 1) {
      this.unhookPortEvents(port.element);
    }
  };

  private readonly onPortMouseDown = (event: MouseEvent): void => {
    if (!this.params.mouseDownEventVerifier(event)) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const portId = this.canvas.graph.findPortIdsByElement(target)[0]!;

    const accepted = this.params.onPortPointerDown(portId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (!accepted) {
      return;
    }

    event.stopPropagation();

    this.window.addEventListener("mousemove", this.onWindowMouseMove, {
      passive: true,
    });
    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
  };

  private readonly onWindowMouseMove = (event: MouseEvent): void => {
    const isInside = isPointInside(
      this.window,
      this.element,
      event.clientX,
      event.clientY,
    );

    if (!isInside) {
      this.stopMouseDrag();
      return;
    }

    this.params.onPointerMove({ x: event.clientX, y: event.clientY });
  };

  private readonly onWindowMouseUp = (event: MouseEvent): void => {
    if (!this.params.mouseUpEventVerifier(event)) {
      return;
    }

    this.params.onPointerUp({ x: event.clientX, y: event.clientY });
    this.stopMouseDrag();
  };

  private readonly onPortTouchStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    const target = event.currentTarget as HTMLElement;
    const portId = this.canvas.graph.findPortIdsByElement(target)[0]!;

    const accepted = this.params.onPortPointerDown(portId, {
      x: touch.clientX,
      y: touch.clientY,
    });

    if (!accepted) {
      return;
    }

    event.stopPropagation();

    this.window.addEventListener("touchmove", this.onWindowTouchMove, {
      passive: true,
    });
    this.window.addEventListener("touchend", this.onWindowTouchFinish, {
      passive: true,
    });
    this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
      passive: true,
    });
  };

  private readonly onWindowTouchMove = (event: TouchEvent): void => {
    const touch = event.touches[0];

    const isInside = isPointInside(
      this.window,
      this.element,
      touch.clientX,
      touch.clientY,
    );

    if (!isInside) {
      this.stopTouchDrag();
      return;
    }

    this.params.onPointerMove({ x: touch.clientX, y: touch.clientY });
  };

  private readonly onWindowTouchFinish = (event: TouchEvent): void => {
    const touch = event.changedTouches[0];
    this.params.onPointerUp({ x: touch.clientX, y: touch.clientY });
    this.stopTouchDrag();
  };

  private readonly onBeforeClear = (): void => {
    this.canvas.graph.getAllPortIds().forEach((portId) => {
      const port = this.canvas.graph.getPort(portId)!;
      this.unhookPortEvents(port.element);
    });
  };

  private readonly onBeforeDestroy = (): void => {
    this.params.onStopDrag();
    this.removeWindowMouseListeners();
    this.removeWindowTouchListeners();
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    private readonly params: DraggablePortsParams,
  ) {
    this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked);
    this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    element: HTMLElement,
    win: Window,
    params: DraggablePortsParams,
  ): void {
    new DraggablePortsConfigurator(canvas, element, win, params);
  }

  private hookPortEvents(element: HTMLElement): void {
    element.addEventListener("mousedown", this.onPortMouseDown, {
      passive: true,
    });
    element.addEventListener("touchstart", this.onPortTouchStart, {
      passive: true,
    });
  }

  private unhookPortEvents(element: HTMLElement): void {
    element.removeEventListener("mousedown", this.onPortMouseDown);
    element.removeEventListener("touchstart", this.onPortTouchStart);
  }

  private stopMouseDrag(): void {
    this.params.onStopDrag();
    this.removeWindowMouseListeners();
  }

  private stopTouchDrag(): void {
    this.params.onStopDrag();
    this.removeWindowTouchListeners();
  }

  private removeWindowMouseListeners(): void {
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }

  private removeWindowTouchListeners(): void {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
}
