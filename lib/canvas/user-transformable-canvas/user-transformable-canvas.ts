import {
  AddEdgeRequest,
  AddNodeRequest,
  MarkPortRequest,
  PatchMatrixRequest,
  Canvas,
  UpdateEdgeRequest,
  UpdateNodeRequest,
} from "../canvas";
import { TransformOptions } from "./transform-options";
import { TouchState } from "./touch-state";
import { UpdatePortRequest } from "../canvas/update-port-request";
import { TransformPreprocessorFn } from "./transform-preprocessor-fn";
import { TransformFinishedFn } from "./transform-finished-fn";
import { transformFinishedDefault } from "./transform-finished-default-fn";
import { transformPreprocessorDefault } from "./transform-preprocessor-default-fn";
import { TransformPayload } from "./transform-payload";
import { resolveTransformPreprocessor } from "./resolve-transform-preprocessor";
import { createCombinedTransformPreprocessor } from "./create-combined-transform-preprocessor";
import { isOnCanvas, isOnWindow, setCursor } from "../utils";
import { PublicGraphStore } from "@/graph-store";
import { PublicViewportTransformer } from "@/viewport-transformer";

export class UserTransformableCanvas implements Canvas {
  public readonly model: PublicGraphStore;

  public readonly transformation: PublicViewportTransformer;

  private element: HTMLElement | null = null;

  private prevTouches: TouchState | null = null;

  private readonly onTransformFinished: TransformFinishedFn;

  private readonly transformPreprocessor: TransformPreprocessorFn;

  private readonly isScalable: boolean;

  private readonly isShiftable: boolean;

  private readonly wheelSensitivity: number;

  private window = window;

  private readonly onMouseDown: () => void = () => {
    if (this.element === null) {
      return;
    }

    setCursor(this.element, this.shiftCursor);
    this.window.addEventListener("mousemove", this.onMouseMove);
    this.window.addEventListener("mouseup", this.onMouseUp);
  };

  private readonly onMouseMove: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (!this.isShiftable || this.element === null) {
      return;
    }

    if (
      !isOnCanvas(this.element, event.clientX, event.clientY) ||
      !isOnWindow(this.window, event.clientX, event.clientY)
    ) {
      this.stopMouseDrag();
      return;
    }

    const deltaViewX = -event.movementX;
    const deltaViewY = -event.movementY;

    this.moveViewport(deltaViewX, deltaViewY);
  };

  private readonly onMouseUp: () => void = () => {
    this.stopMouseDrag();
  };

  private readonly onWheelScroll: (event: WheelEvent) => void = (
    event: WheelEvent,
  ) => {
    if (this.element === null || this.isScalable === false) {
      return;
    }

    event.preventDefault();

    const { left, top } = this.element.getBoundingClientRect();
    const centerX = event.clientX - left;
    const centerY = event.clientY - top;
    const deltaScale =
      event.deltaY < 0 ? this.wheelSensitivity : 1 / this.wheelSensitivity;
    const deltaViewScale = 1 / deltaScale;

    this.scaleViewport(deltaViewScale, centerX, centerY);
  };

  private readonly onTouchStart: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    this.prevTouches = this.getAverageTouch(event);
    this.window.addEventListener("touchmove", this.onTouchMove);
    this.window.addEventListener("touchend", this.onTouchEnd);
    this.window.addEventListener("touchcancel", this.onTouchEnd);
  };

  private readonly onTouchMove: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (
      this.prevTouches === null ||
      !this.isShiftable ||
      this.element === null
    ) {
      return;
    }

    const currentTouches = this.getAverageTouch(event);

    const isEvery = currentTouches.touches.every(
      (t) =>
        isOnCanvas(this.element!, t[0], t[1]) &&
        isOnWindow(this.window, t[0], t[1]),
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

    if (currentTouches.touchesCnt === 2 && this.isScalable) {
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
      this.prevTouches = this.getAverageTouch(event);
    } else {
      this.stopTouchDrag();
    }
  };

  private readonly observer = new ResizeObserver(() => {
    if (this.element !== null) {
      const prevTransform = this.canvas.transformation.getViewportMatrix();

      const { width, height } = this.element.getBoundingClientRect();
      const transform = this.transformPreprocessor(
        prevTransform,
        prevTransform,
        width,
        height,
      );
      this.canvas.patchViewportMatrix(transform);
      this.onTransformFinished();
    }
  });

  private readonly shiftCursor: string | null;

  public constructor(
    private readonly canvas: Canvas,
    private readonly options?: TransformOptions,
  ) {
    this.transformation = this.canvas.transformation;
    this.model = this.canvas.model;

    this.isScalable = this.options?.scale?.enabled !== false;
    this.isShiftable = this.options?.shift?.enabled !== false;

    const wheelVelocity = this.options?.scale?.wheelSensitivity;
    this.wheelSensitivity = wheelVelocity !== undefined ? wheelVelocity : 1.2;

    this.onTransformFinished =
      options?.events?.onTransformFinished ?? transformFinishedDefault;

    const preprocessors = options?.transformPreprocessor;

    if (preprocessors !== undefined) {
      if (Array.isArray(preprocessors)) {
        this.transformPreprocessor = createCombinedTransformPreprocessor(
          preprocessors.map((preprocessor) =>
            resolveTransformPreprocessor(preprocessor),
          ),
        );
      } else {
        this.transformPreprocessor =
          resolveTransformPreprocessor(preprocessors);
      }
    } else {
      this.transformPreprocessor = transformPreprocessorDefault;
    }

    this.shiftCursor =
      options?.shift?.cursor !== undefined ? options.shift.cursor : "grab";
  }

  public addNode(node: AddNodeRequest): UserTransformableCanvas {
    this.canvas.addNode(node);

    return this;
  }

  public updateNode(
    nodeId: unknown,
    request: UpdateNodeRequest,
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
    request: UpdatePortRequest,
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
    request: UpdateEdgeRequest,
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

  private getAverageTouch(event: TouchEvent): TouchState {
    const touches: [number, number][] = [];

    const cnt = event.touches.length;

    for (let i = 0; i < cnt; i++) {
      touches.push([event.touches[i].clientX, event.touches[i].clientY]);
    }

    const sum: [number, number] = touches.reduce(
      (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]],
      [0, 0],
    );

    const avg = [sum[0] / cnt, sum[1] / cnt];

    const distances = touches.map((cur) => [cur[0] - avg[0], cur[1] - avg[1]]);

    const distance = distances.reduce(
      (acc, cur) => acc + Math.sqrt(cur[0] * cur[0] + cur[1] * cur[1]),
      0,
    );

    return {
      x: avg[0],
      y: avg[1],
      scale: distance / cnt,
      touchesCnt: cnt,
      touches,
    };
  }

  private moveViewport(dx: number, dy: number): void {
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

      const transform = this.transformPreprocessor(
        prevTransform,
        nextTransform,
        width,
        height,
      );

      this.canvas.patchViewportMatrix(transform);
      this.onTransformFinished();
    }
  }

  private scaleViewport(s2: number, cx: number, cy: number): void {
    if (this.element === null) {
      return;
    }

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

    const transform = this.transformPreprocessor(
      prevTransform,
      nextTransform,
      width,
      height,
    );

    this.canvas.patchViewportMatrix(transform);
    this.onTransformFinished();
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
