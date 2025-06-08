import { Canvas, CanvasDefaults } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView, HtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { isPointInside } from "../utils";
import { Point } from "@/point";

/**
 * Responsibility: Configuring ports connectable via drag
 */
export class UserConnectablePortsConfigurator {
  private readonly graphStore: GraphStore;

  private readonly htmlView: HtmlView;

  private readonly overlayCanvas: Canvas;

  private readonly ports = new Map<HTMLElement, unknown>();

  private sourcePort: unknown | null = null;

  private readonly onAfterPortMarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;

    this.hookPortEvents(port.element);

    this.ports.set(port.element, portId);
  };

  private readonly onBeforePortUnmarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;

    this.unhookPortEvents(port.element);

    this.ports.delete(port.element);
  };

  private readonly onPortMouseDown = (event: MouseEvent): void => {
    event.stopPropagation();

    this.grabPort(event.currentTarget as HTMLElement);
    this.window.addEventListener("mousemove", this.onWindowMouseMove);
    this.window.addEventListener("mouseup", this.onWindowMouseUp);
  };

  private readonly onWindowMouseMove = (event: MouseEvent): void => {
    const isInside = isPointInside(
      this.window,
      this.overlayLayer,
      event.clientX,
      event.clientY,
    );

    if (!isInside) {
      this.stopMouseDrag();
      return;
    }

    this.moveEndNode({ x: event.clientX, y: event.clientY });
  };

  private readonly onWindowMouseUp = (event: MouseEvent): void => {
    this.tryCreateConnection({ x: event.clientX, y: event.clientY });
    this.stopMouseDrag();
  };

  private readonly onPortTouchStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      this.stopTouchDrag();
      return;
    }

    event.stopPropagation();

    this.grabPort(event.currentTarget as HTMLElement);
    this.window.addEventListener("touchmove", this.onWindowTouchMove);
    this.window.addEventListener("touchend", this.onWindowTouchFinish);
    this.window.addEventListener("touchcancel", this.onWindowTouchFinish);
  };

  private readonly onWindowTouchMove = (event: TouchEvent): void => {
    const touch = event.touches[0];

    const isInside = isPointInside(
      this.window,
      this.overlayLayer,
      touch.clientX,
      touch.clientY,
    );

    if (!isInside) {
      this.stopMouseDrag();
      return;
    }

    this.moveEndNode({ x: touch.clientX, y: touch.clientY });
  };

  private readonly onWindowTouchFinish = (event: TouchEvent): void => {
    const touch = event.changedTouches[0];
    this.tryCreateConnection({ x: touch.clientX, y: touch.clientY });
    this.stopTouchDrag();
  };

  private readonly onBeforeClear = (): void => {
    this.ports.forEach((_portId, element) => {
      this.unhookPortEvents(element);
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
    private readonly overlayLayer: HTMLElement,
    private readonly viewportStore: ViewportStore,
    private readonly window: Window,
    defaults: CanvasDefaults,
  ) {
    this.graphStore = new GraphStore();

    this.htmlView = new CoreHtmlView(
      this.graphStore,
      this.viewportStore,
      this.overlayLayer,
    );

    this.overlayCanvas = new Canvas(
      this.overlayLayer,
      this.graphStore,
      this.viewportStore,
      this.htmlView,
      defaults,
    );

    this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked);
    this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    overlayLayer: HTMLElement,
    viewportStore: ViewportStore,
    win: Window,
    defaults: CanvasDefaults,
  ): void {
    new UserConnectablePortsConfigurator(
      canvas,
      overlayLayer,
      viewportStore,
      win,
      defaults,
    );
  }

  private grabPort(portElement: HTMLElement): void {
    const portId = this.ports.get(portElement)!;

    this.sourcePort = portId;

    const rect = portElement.getBoundingClientRect();

    const portX = rect.x + rect.width / 2;
    const portY = rect.y + rect.height / 2;

    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const portViewCoords: Point = {
      x: portX - canvasRect.x,
      y: portY - canvasRect.y,
    };
    const m = this.canvas.viewport.getViewportMatrix();

    const portContentCoords: Point = {
      x: m.scale * portViewCoords.x + m.x,
      y: m.scale * portViewCoords.y + m.y,
    };

    const elementBegin = document.createElement("div");
    const elementEnd = document.createElement("div");

    this.overlayCanvas.addNode({
      id: "begin",
      element: elementBegin,
      x: portContentCoords.x,
      y: portContentCoords.y,
      ports: [
        {
          id: "begin",
          element: elementBegin,
        },
      ],
    });

    this.overlayCanvas.addNode({
      id: "end",
      element: elementEnd,
      x: portContentCoords.x,
      y: portContentCoords.y,
      ports: [
        {
          id: "end",
          element: elementEnd,
        },
      ],
    });

    this.overlayCanvas.addEdge({ from: "begin", to: "end" });
  }

  private hookPortEvents(element: HTMLElement): void {
    element.addEventListener("mousedown", this.onPortMouseDown);
    element.addEventListener("touchstart", this.onPortTouchStart);
  }

  private unhookPortEvents(element: HTMLElement): void {
    element.removeEventListener("mousedown", this.onPortMouseDown);
    element.removeEventListener("touchstart", this.onPortTouchStart);
  }

  private stopMouseDrag(): void {
    this.resetDragState();
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }

  private stopTouchDrag(): void {
    this.resetDragState();
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }

  private resetDragState(): void {
    this.sourcePort = null;
    this.overlayCanvas.clear();
  }

  private tryCreateConnection(cursor: Point): void {
    const element = document.elementFromPoint(cursor.x, cursor.y);

    if (element === null || !(element instanceof HTMLElement)) {
      return;
    }

    const targetPort = this.ports.get(element);

    if (targetPort === undefined) {
      return;
    }

    this.canvas.addEdge({ from: this.sourcePort, to: targetPort });
  }

  private moveEndNode(to: Point): void {
    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const nodeViewCoords: Point = {
      x: to.x - canvasRect.x,
      y: to.y - canvasRect.y,
    };

    const m = this.canvas.viewport.getViewportMatrix();

    const nodeContentCoords: Point = {
      x: m.scale * nodeViewCoords.x + m.x,
      y: m.scale * nodeViewCoords.y + m.y,
    };

    this.overlayCanvas.updateNode("end", {
      x: nodeContentCoords.x,
      y: nodeContentCoords.y,
    });
  }
}
