import { Canvas, PatchMatrixRequest } from "@/canvas";
import { TransformOptions } from "./options";
import { createOptions } from "./options/create-options";
import { Options } from "./options/options";
import { isPointOnElement, isPointOnWindow, setCursor } from "../utils";
import { Viewport } from "@/viewport";
import { move, scale } from "./transformations";
import { processTouch, TouchState } from "./process-touch";

/**
 * Responsibility: Configures canvas to have viewport transformable by user
 */
export class UserTransformableViewportConfigurator {
  private readonly viewport: Viewport;

  private prevTouches: TouchState | null = null;

  private wheelFinishTimer: ReturnType<typeof setTimeout> | null = null;

  private transformInProgress = false;

  private readonly onBeforeDestroy = (): void => {
    this.removeMouseDragListeners();
    this.removeTouchDragListeners();
    this.observer.unobserve(this.element);
    this.element.removeEventListener("mousedown", this.onMouseDown);
    this.element.removeEventListener("wheel", this.onWheelScroll);
    this.element.removeEventListener("touchstart", this.onTouchStart);
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
  };

  private readonly onMouseDown: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (this.element === null || !this.options.mouseDownEventVerifier(event)) {
      return;
    }
    setCursor(this.element, this.options.shiftCursor);
    this.win.addEventListener("mousemove", this.onWindowMouseMove);
    this.win.addEventListener("mouseup", this.onWindowMouseUp);
    this.startRegisteredTransform();
  };

  private readonly onWindowMouseMove: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (
      this.element === null ||
      !isPointOnElement(this.element, event.clientX, event.clientY) ||
      !isPointOnWindow(this.win, event.clientX, event.clientY)
    ) {
      this.stopMouseDrag();
      return;
    }

    const deltaViewX = -event.movementX;
    const deltaViewY = -event.movementY;

    this.moveViewport(deltaViewX, deltaViewY);
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

    const { left, top } = this.element.getBoundingClientRect();
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

    this.scaleViewport(deltaViewScale, centerX, centerY);

    if (this.wheelFinishTimer !== null) {
      clearTimeout(this.wheelFinishTimer);
    }

    this.wheelFinishTimer = setTimeout(() => {
      if (!this.transformInProgress) {
        this.options.onTransformFinished();
      }

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
    this.win.addEventListener("touchmove", this.onWindowTouchMove);
    this.win.addEventListener("touchend", this.onWindowTouchFinish);
    this.win.addEventListener("touchcancel", this.onWindowTouchFinish);
    this.startRegisteredTransform();
  };

  private readonly onWindowTouchMove: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    const currentTouches = processTouch(event);
    const isEvery = currentTouches.touches.every(
      (t) =>
        isPointOnElement(this.element, t[0], t[1]) &&
        isPointOnWindow(this.win, t[0], t[1]),
    );

    if (!isEvery) {
      this.stopTouchDrag();
      return;
    }

    if (currentTouches.touchesCnt === 1 || currentTouches.touchesCnt === 2) {
      this.moveViewport(
        -(currentTouches.x - this.prevTouches!.x),
        -(currentTouches.y - this.prevTouches!.y),
      );
    }

    if (currentTouches.touchesCnt === 2) {
      const { left, top } = this.element.getBoundingClientRect();
      const x = this.prevTouches!.x - left;
      const y = this.prevTouches!.y - top;
      const deltaScale = currentTouches.scale / this.prevTouches!.scale;
      const deltaViewScale = 1 / deltaScale;
      this.scaleViewport(deltaViewScale, x, y);
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
    const prevTransform = this.viewport.getViewportMatrix();
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
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly win: Window,
    transformOptions: TransformOptions,
  ) {
    this.options = createOptions(transformOptions);

    this.viewport = canvas.viewport;
    this.observer.observe(this.element);
    this.element.addEventListener("mousedown", this.onMouseDown);
    this.element.addEventListener("wheel", this.onWheelScroll);
    this.element.addEventListener("touchstart", this.onTouchStart);

    canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    element: HTMLElement,
    win: Window,
    transformOptions: TransformOptions,
  ): void {
    new UserTransformableViewportConfigurator(
      canvas,
      element,
      win,
      transformOptions,
    );
  }

  private moveViewport(dx: number, dy: number): void {
    const prevTransform = this.viewport.getViewportMatrix();
    const nextTransform = move(prevTransform, dx, dy);
    const { width, height } = this.element.getBoundingClientRect();
    const transform = this.options.transformPreprocessor({
      prevTransform,
      nextTransform,
      canvasWidth: width,
      canvasHeight: height,
    });

    this.performTransform(transform);
  }

  private scaleViewport(s2: number, cx: number, cy: number): void {
    const prevTransform = this.canvas.viewport.getViewportMatrix();
    const nextTransform = scale(prevTransform, s2, cx, cy);
    const { width, height } = this.element.getBoundingClientRect();
    const transform = this.options.transformPreprocessor({
      prevTransform,
      nextTransform,
      canvasWidth: width,
      canvasHeight: height,
    });

    this.performTransform(transform);
  }

  private stopMouseDrag(): void {
    setCursor(this.element, null);
    this.removeMouseDragListeners();
    this.finishRegisteredTransform();
  }

  private removeMouseDragListeners(): void {
    this.win.removeEventListener("mousemove", this.onWindowMouseMove);
    this.win.removeEventListener("mouseup", this.onWindowMouseUp);
  }

  private stopTouchDrag(): void {
    this.prevTouches = null;
    this.removeTouchDragListeners();
    this.finishRegisteredTransform();
  }

  private removeTouchDragListeners(): void {
    this.win.removeEventListener("touchmove", this.onWindowTouchMove);
    this.win.removeEventListener("touchend", this.onWindowTouchFinish);
    this.win.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }

  private performTransform(viewportTransform: PatchMatrixRequest): void {
    this.options.onBeforeTransformChange();
    this.canvas.patchViewportMatrix(viewportTransform);
    this.options.onTransformChange();
  }

  private startRegisteredTransform(): void {
    this.transformInProgress = true;
    this.options.onTransformStarted();
  }

  private finishRegisteredTransform(): void {
    this.transformInProgress = false;
    this.options.onTransformFinished();
  }
}
