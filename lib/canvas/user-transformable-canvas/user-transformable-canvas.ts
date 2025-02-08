import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-transform-request";
import { TransformOptions } from "./options";
import { TransformPayload } from "./preprocessors";
import { isPointOnElement, isPointOnWindow, setCursor } from "../utils";
import { PublicGraphStore } from "@/graph-store";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { createOptions } from "./options/create-options";
import { Options } from "./options/options";
import { processTouch, TouchState } from "./process-touch";

export class UserTransformableCanvas implements Canvas {
  public readonly model: PublicGraphStore;

  public readonly transformation: PublicViewportTransformer;

  private element: HTMLElement | null = null;

  private prevTouches: TouchState | null = null;

  private window = window;

  private readonly onMouseDown: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (this.element === null || event.button !== 0) {
      return;
    }

    setCursor(this.element, this.options.shiftCursor);
    this.window.addEventListener("mousemove", this.onMouseMove);
    this.window.addEventListener("mouseup", this.onMouseUp);
  };

  private readonly onMouseMove: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (this.element === null) {
      return;
    }

    if (
      !isPointOnElement(this.element, event.clientX, event.clientY) ||
      !isPointOnWindow(this.window, event.clientX, event.clientY)
    ) {
      this.stopMouseDrag();
      return;
    }

    const deltaViewX = -event.movementX;
    const deltaViewY = -event.movementY;

    this.moveViewport(deltaViewX, deltaViewY);
  };

  private readonly onMouseUp: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (event.button !== 0) {
      return;
    }

    this.stopMouseDrag();
  };

  private readonly onWheelScroll: (event: WheelEvent) => void = (
    event: WheelEvent,
  ) => {
    if (this.element === null) {
      return;
    }

    event.preventDefault();

    const { left, top } = this.element.getBoundingClientRect();
    const centerX = event.clientX - left;
    const centerY = event.clientY - top;
    const deltaScale =
      event.deltaY < 0
        ? this.options.wheelSensitivity
        : 1 / this.options.wheelSensitivity;
    const deltaViewScale = 1 / deltaScale;

    this.scaleViewport(deltaViewScale, centerX, centerY);
  };

  private readonly onTouchStart: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    this.prevTouches = processTouch(event);
    this.window.addEventListener("touchmove", this.onTouchMove);
    this.window.addEventListener("touchend", this.onTouchEnd);
    this.window.addEventListener("touchcancel", this.onTouchEnd);
  };

  private readonly onTouchMove: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (this.prevTouches === null || this.element === null) {
      return;
    }

    const currentTouches = processTouch(event);

    const isEvery = currentTouches.touches.every(
      (t) =>
        isPointOnElement(this.element!, t[0], t[1]) &&
        isPointOnWindow(this.window, t[0], t[1]),
    );

    if (!isEvery) {
      this.stopTouchDrag();
      return;
    }

    if (currentTouches.touchesCnt === 1 || currentTouches.touchesCnt === 2) {
      this.moveViewport(
        -(currentTouches.x - this.prevTouches.x),
        -(currentTouches.y - this.prevTouches.y),
      );
    }

    if (currentTouches.touchesCnt === 2) {
      const { left, top } = this.element.getBoundingClientRect();
      const x = this.prevTouches.x - left;
      const y = this.prevTouches.y - top;
      const deltaScale = currentTouches.scale / this.prevTouches.scale;
      const deltaViewScale = 1 / deltaScale;

      this.scaleViewport(deltaViewScale, x, y);
    }

    this.prevTouches = currentTouches;
  };

  private readonly onTouchEnd: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (event.touches.length > 0) {
      this.prevTouches = processTouch(event);
    } else {
      this.stopTouchDrag();
    }
  };

  private readonly observer = new ResizeObserver(() => {
    if (this.element !== null) {
      const prevTransform = this.canvas.transformation.getViewportMatrix();

      const { width, height } = this.element.getBoundingClientRect();
      const transform = this.options.transformPreprocessor({
        prevTransform,
        nextTransform: prevTransform,
        canvasWidth: width,
        canvasHeight: height,
      });
      this.canvas.patchViewportMatrix(transform);
      this.options.onTransformFinished();
    }
  });

  private readonly options: Options;

  public constructor(
    private readonly canvas: Canvas,
    transformOptions?: TransformOptions,
  ) {
    this.options = createOptions(transformOptions ?? {});

    this.transformation = this.canvas.transformation;
    this.model = this.canvas.model;
  }

  public addNode(node: AddNodeRequest): UserTransformableCanvas {
    this.canvas.addNode(node);

    return this;
  }

  public updateNode(
    nodeId: unknown,
    request?: UpdateNodeRequest,
  ): UserTransformableCanvas {
    this.canvas.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: unknown): UserTransformableCanvas {
    this.canvas.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): UserTransformableCanvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(
    portId: string,
    request?: UpdatePortRequest,
  ): UserTransformableCanvas {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): UserTransformableCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): UserTransformableCanvas {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(
    edgeId: unknown,
    request?: UpdateEdgeRequest,
  ): UserTransformableCanvas {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): UserTransformableCanvas {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(
    request: PatchMatrixRequest,
  ): UserTransformableCanvas {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(
    request: PatchMatrixRequest,
  ): UserTransformableCanvas {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): UserTransformableCanvas {
    this.canvas.clear();

    return this;
  }

  public attach(element: HTMLElement): UserTransformableCanvas {
    this.detach();
    this.element = element;
    this.observer.observe(this.element);
    this.element.addEventListener("mousedown", this.onMouseDown);
    this.element.addEventListener("wheel", this.onWheelScroll);
    this.element.addEventListener("touchstart", this.onTouchStart);

    this.canvas.attach(this.element);

    return this;
  }

  public detach(): UserTransformableCanvas {
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

  public destroy(): void {
    this.detach();

    this.removeMouseDragListeners();
    this.removeTouchDragListeners();

    this.canvas.destroy();
  }

  private moveViewport(dx: number, dy: number): void {
    this.options.onBeforeTransformStarted();

    /**
     * dx2 - traslate x
     * dy2 - traslate y
     *
     * direct transform
     *  s1  0   dx1     1   0   dx2
     *  0   s1  dy1     0   1   dy2
     *  0   0   1       0   0   1
     *
     * [s, dx, dy] = [s1, s * dx2 + dx1, s * dy2 + dy1]
     */
    const prevTransform = this.transformation.getViewportMatrix();

    const nextTransform: TransformPayload = {
      scale: prevTransform.scale,
      dx: prevTransform.dx + prevTransform.scale * dx,
      dy: prevTransform.dy + prevTransform.scale * dy,
    };

    if (this.element !== null) {
      const { width, height } = this.element.getBoundingClientRect();

      const transform = this.options.transformPreprocessor({
        prevTransform,
        nextTransform,
        canvasWidth: width,
        canvasHeight: height,
      });

      this.canvas.patchViewportMatrix(transform);
      this.options.onTransformFinished();
    }
  }

  private scaleViewport(s2: number, cx: number, cy: number): void {
    if (this.element === null) {
      return;
    }

    this.options.onBeforeTransformStarted();

    const prevTransform = this.canvas.transformation.getViewportMatrix();

    /**
     * s2 - scale
     * cx - scale center x
     * cy - scale center y
     *
     *  s1  0   dx1     s2  0   (1 - s2) * cx
     *  0   s1  dy1     0   s2  (1 - s2) * cy
     *  0   0   1       0   0   1
     *
     * [s, dx, dy] = [s1 * s2, s1 * (1 - s2) * cx + dx1, s1 * (1 - s2) * cy + dy1]
     */
    const nextTransform: TransformPayload = {
      scale: prevTransform.scale * s2,
      dx: prevTransform.scale * (1 - s2) * cx + prevTransform.dx,
      dy: prevTransform.scale * (1 - s2) * cy + prevTransform.dy,
    };

    const { width, height } = this.element.getBoundingClientRect();

    const transform = this.options.transformPreprocessor({
      prevTransform,
      nextTransform,
      canvasWidth: width,
      canvasHeight: height,
    });

    this.canvas.patchViewportMatrix(transform);
    this.options.onTransformFinished();
  }

  private stopMouseDrag(): void {
    if (this.element !== null) {
      setCursor(this.element, null);
    }

    this.removeMouseDragListeners();
  }

  private removeMouseDragListeners(): void {
    this.window.removeEventListener("mousemove", this.onMouseMove);
    this.window.removeEventListener("mouseup", this.onMouseUp);
  }

  private stopTouchDrag(): void {
    this.prevTouches = null;
    this.removeTouchDragListeners();
  }

  private removeTouchDragListeners(): void {
    this.window.removeEventListener("touchmove", this.onTouchMove);
    this.window.removeEventListener("touchend", this.onTouchEnd);
    this.window.removeEventListener("touchcancel", this.onTouchEnd);
  }
}
