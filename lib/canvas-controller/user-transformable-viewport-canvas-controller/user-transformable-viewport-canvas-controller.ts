import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { TransformOptions } from "./options";
import { isPointOnElement, isPointOnWindow, setCursor } from "../utils";
import { CanvasController } from "../canvas-controller";
import { createOptions } from "./options/create-options";
import { Options } from "./options/options";
import { processTouch, TouchState } from "./process-touch";
import { move, scale } from "./transformations";

export class UserTransformableViewportCanvasController
  implements CanvasController
{
  public readonly graph: Graph;

  public readonly viewport: Viewport;

  private prevTouches: TouchState | null = null;

  private window = window;

  private wheelFinishTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly onMouseDown: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (this.element === null || !this.options.mouseDownEventVerifier(event)) {
      return;
    }

    setCursor(this.element, this.options.shiftCursor);
    this.window.addEventListener("mousemove", this.onWindowMouseMove);
    this.window.addEventListener("mouseup", this.onWindowMouseUp);
    this.options.onTransformStarted();
  };

  private readonly onWindowMouseMove: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (
      this.element === null ||
      !isPointOnElement(this.element, event.clientX, event.clientY) ||
      !isPointOnWindow(this.window, event.clientX, event.clientY)
    ) {
      this.stopMouseDrag();
      return;
    }

    const deltaViewX = -event.movementX;
    const deltaViewY = -event.movementY;

    this.moveViewport(this.element, deltaViewX, deltaViewY);
  };

  private readonly onWindowMouseUp: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (this.element === null || !this.options.mouseUpEventVerifier(event)) {
      return;
    }

    this.stopMouseDrag();
  };

  private readonly onWheelScroll: (event: WheelEvent) => void = (
    event: WheelEvent,
  ) => {
    if (!this.options.mouseWheelEventVerifier(event)) {
      return;
    }

    event.preventDefault();

    const { left, top } = this.element!.getBoundingClientRect();
    const centerX = event.clientX - left;
    const centerY = event.clientY - top;
    const deltaScale =
      event.deltaY < 0
        ? this.options.wheelSensitivity
        : 1 / this.options.wheelSensitivity;
    const deltaViewScale = 1 / deltaScale;

    if (this.wheelFinishTimer === null) {
      this.options.onTransformStarted();
    }

    this.scaleViewport(this.element!, deltaViewScale, centerX, centerY);

    if (this.wheelFinishTimer !== null) {
      clearTimeout(this.wheelFinishTimer);
    }

    this.wheelFinishTimer = setTimeout(() => {
      this.options.onTransformFinished();
      this.wheelFinishTimer = null;
    }, this.options.scaleWheelFinishTimeout);
  };

  private readonly onTouchStart: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (this.prevTouches !== null) {
      this.prevTouches = processTouch(event);
      return;
    }

    this.prevTouches = processTouch(event);
    this.window.addEventListener("touchmove", this.onWindowTouchMove);
    this.window.addEventListener("touchend", this.onWindowTouchFinish);
    this.window.addEventListener("touchcancel", this.onWindowTouchFinish);
    this.options.onTransformStarted();
  };

  private readonly onWindowTouchMove: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    const element = this.element;

    if (element === null) {
      return;
    }

    const currentTouches = processTouch(event);

    const isEvery = currentTouches.touches.every(
      (t) =>
        isPointOnElement(element, t[0], t[1]) &&
        isPointOnWindow(this.window, t[0], t[1]),
    );

    if (!isEvery) {
      this.stopTouchDrag();
      return;
    }

    if (currentTouches.touchesCnt === 1 || currentTouches.touchesCnt === 2) {
      this.moveViewport(
        element,
        -(currentTouches.x - this.prevTouches!.x),
        -(currentTouches.y - this.prevTouches!.y),
      );
    }

    if (currentTouches.touchesCnt === 2) {
      const { left, top } = element.getBoundingClientRect();
      const x = this.prevTouches!.x - left;
      const y = this.prevTouches!.y - top;
      const deltaScale = currentTouches.scale / this.prevTouches!.scale;
      const deltaViewScale = 1 / deltaScale;

      this.scaleViewport(element, deltaViewScale, x, y);
    }

    this.prevTouches = currentTouches;
  };

  private readonly onWindowTouchFinish: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (event.touches.length > 0) {
      this.prevTouches = processTouch(event);
    } else {
      this.stopTouchDrag();
    }
  };

  private readonly observer = new ResizeObserver(() => {
    const prevTransform = this.canvas.viewport.getViewportMatrix();

    const { width, height } = this.element!.getBoundingClientRect();
    const transform = this.options.transformPreprocessor({
      prevTransform,
      nextTransform: prevTransform,
      canvasWidth: width,
      canvasHeight: height,
    });

    this.options.onResizeTransformStarted();
    this.canvas.patchViewportMatrix(transform);
    this.options.onResizeTransformFinished();
  });

  private readonly options: Options;

  public constructor(
    private readonly canvas: CanvasController,
    private readonly element: HTMLElement,
    transformOptions?: TransformOptions,
  ) {
    this.options = createOptions(transformOptions);

    this.viewport = this.canvas.viewport;
    this.graph = this.canvas.graph;

    this.observer.observe(this.element);
    this.element.addEventListener("mousedown", this.onMouseDown);
    this.element.addEventListener("wheel", this.onWheelScroll);
    this.element.addEventListener("touchstart", this.onTouchStart);
  }

  public addNode(node: AddNodeRequest): void {
    this.canvas.addNode(node);
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): void {
    this.canvas.updateNode(nodeId, request);
  }

  public removeNode(nodeId: unknown): void {
    this.canvas.removeNode(nodeId);
  }

  public markPort(port: MarkPortRequest): void {
    this.canvas.markPort(port);
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    this.canvas.updatePort(portId, request);
  }

  public unmarkPort(portId: unknown): void {
    this.canvas.unmarkPort(portId);
  }

  public addEdge(edge: AddEdgeRequest): void {
    this.canvas.addEdge(edge);
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void {
    this.canvas.updateEdge(edgeId, request);
  }

  public removeEdge(edgeId: unknown): void {
    this.canvas.removeEdge(edgeId);
  }

  public patchViewportMatrix(request: PatchMatrixRequest): void {
    this.canvas.patchViewportMatrix(request);
  }

  public patchContentMatrix(request: PatchMatrixRequest): void {
    this.canvas.patchContentMatrix(request);
  }

  public clear(): void {
    this.canvas.clear();
  }

  public destroy(): void {
    this.removeMouseDragListeners();
    this.removeTouchDragListeners();

    this.observer.unobserve(this.element);
    this.element.removeEventListener("mousedown", this.onMouseDown);
    this.element.removeEventListener("wheel", this.onWheelScroll);
    this.element.removeEventListener("touchstart", this.onTouchStart);

    this.canvas.destroy();
  }

  private moveViewport(element: HTMLElement, dx: number, dy: number): void {
    const prevTransform = this.viewport.getViewportMatrix();
    const nextTransform = move(prevTransform, dx, dy);
    const { width, height } = element.getBoundingClientRect();

    const transform = this.options.transformPreprocessor({
      prevTransform,
      nextTransform,
      canvasWidth: width,
      canvasHeight: height,
    });

    this.performTransform(transform);
  }

  private scaleViewport(
    element: HTMLElement,
    s2: number,
    cx: number,
    cy: number,
  ): void {
    const prevTransform = this.canvas.viewport.getViewportMatrix();
    const nextTransform = scale(prevTransform, s2, cx, cy);
    const { width, height } = element.getBoundingClientRect();

    const transform = this.options.transformPreprocessor({
      prevTransform,
      nextTransform,
      canvasWidth: width,
      canvasHeight: height,
    });

    this.performTransform(transform);
  }

  private stopMouseDrag(): void {
    if (this.element !== null) {
      setCursor(this.element, null);
    }

    this.removeMouseDragListeners();
    this.options.onTransformFinished();
  }

  private removeMouseDragListeners(): void {
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }

  private stopTouchDrag(): void {
    this.prevTouches = null;
    this.removeTouchDragListeners();
    this.options.onTransformFinished();
  }

  private removeTouchDragListeners(): void {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }

  private performTransform(viewportTransform: PatchMatrixRequest): void {
    this.options.onBeforeTransformChange();
    this.canvas.patchViewportMatrix(viewportTransform);
    this.options.onTransformChange();
  }
}
