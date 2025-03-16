import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { TransformOptions } from "./options";
import { isPointOnElement, isPointOnWindow, setCursor } from "../utils";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { createOptions } from "./options/create-options";
import { Options } from "./options/options";
import { processTouch, TouchState } from "./process-touch";
import { move, scale } from "./transformations";

export class UserTransformableViewportCanvas implements Canvas {
  public readonly graph: Graph;

  public readonly model: Graph;

  public readonly viewport: Viewport;

  public readonly transformation: Viewport;

  private element: HTMLElement | null = null;

  private prevTouches: TouchState | null = null;

  private window = window;

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

    this.options.onBeforeTransformChange();
    this.scaleViewport(this.element!, deltaViewScale, centerX, centerY);
    this.options.onTransformChange();
  };

  private readonly onTouchStart: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
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

    this.options.onBeforeTransformChange();
    this.canvas.patchViewportMatrix(transform);
    this.options.onTransformChange();
  });

  private readonly options: Options;

  public constructor(
    private readonly canvas: Canvas,
    transformOptions?: TransformOptions,
  ) {
    this.options = createOptions(transformOptions);

    this.viewport = this.canvas.viewport;
    this.transformation = this.viewport;
    this.graph = this.canvas.graph;
    this.model = this.graph;
  }

  public attach(element: HTMLElement): Canvas {
    this.detach();
    this.element = element;
    this.observer.observe(this.element);
    this.element.addEventListener("mousedown", this.onMouseDown);
    this.element.addEventListener("wheel", this.onWheelScroll);
    this.element.addEventListener("touchstart", this.onTouchStart);

    this.canvas.attach(this.element);

    return this;
  }

  public detach(): Canvas {
    this.canvas.detach();

    if (this.element !== null) {
      this.observer.unobserve(this.element);
      this.element.removeEventListener("mousedown", this.onMouseDown);
      this.element.removeEventListener("wheel", this.onWheelScroll);
      this.element.removeEventListener("touchstart", this.onTouchStart);

      this.element = null;
    }

    return this;
  }

  public addNode(node: AddNodeRequest): Canvas {
    this.canvas.addNode(node);

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): Canvas {
    this.canvas.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: unknown): Canvas {
    this.canvas.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): Canvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(portId: string, request?: UpdatePortRequest): Canvas {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): Canvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): Canvas {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): Canvas {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): Canvas {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): Canvas {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): Canvas {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): Canvas {
    this.canvas.clear();

    return this;
  }

  public destroy(): void {
    this.detach();

    this.removeMouseDragListeners();
    this.removeTouchDragListeners();

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

    this.options.onBeforeTransformChange();
    this.canvas.patchViewportMatrix(transform);
    this.options.onTransformChange();
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

    this.options.onBeforeTransformChange();
    this.canvas.patchViewportMatrix(transform);
    this.options.onTransformChange();
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
}
