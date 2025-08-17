import { Canvas, PatchMatrixRequest } from "@/canvas";
import { isPointInside, setCursor } from "../shared";
import { move, scale } from "./transformations";
import { processTouch, TouchState } from "./process-touch";
import { TransformableViewportParams } from "./transformable-viewport-params";
import { Viewport } from "@/viewport";

export class UserTransformableViewportConfigurator {
  private readonly viewport: Viewport;

  private prevTouches: TouchState | null = null;

  private wheelFinishTimer: ReturnType<typeof setTimeout> | null = null;

  private transformInProgress = false;

  private readonly onBeforeDestroy = (): void => {
    this.removeMouseDragListeners();
    this.removeTouchDragListeners();
  };

  private readonly onMouseDown: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (this.element === null || !this.params.mouseDownEventVerifier(event)) {
      return;
    }
    setCursor(this.element, this.params.shiftCursor);
    this.window.addEventListener("mousemove", this.onWindowMouseMove, {
      passive: true,
    });
    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
    this.startRegisteredTransform();
  };

  private readonly onWindowMouseMove: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    const isInside = isPointInside(
      this.window,
      this.element,
      event.clientX,
      event.clientY,
    );

    if (this.element === null || !isInside) {
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
    if (this.element === null || !this.params.mouseUpEventVerifier(event)) {
      return;
    }

    this.stopMouseDrag();
  };

  private readonly onWheelScroll: (event: WheelEvent) => void = (
    event: WheelEvent,
  ) => {
    if (!this.params.mouseWheelEventVerifier(event)) {
      return;
    }

    const { left, top } = this.element.getBoundingClientRect();
    const centerX = event.clientX - left;
    const centerY = event.clientY - top;
    const deltaScale =
      event.deltaY < 0
        ? this.params.wheelSensitivity
        : 1 / this.params.wheelSensitivity;

    const deltaViewScale = 1 / deltaScale;

    if (this.wheelFinishTimer === null) {
      this.params.onTransformStarted();
    }

    this.scaleViewport(deltaViewScale, centerX, centerY);

    if (this.wheelFinishTimer !== null) {
      clearTimeout(this.wheelFinishTimer);
    }

    this.wheelFinishTimer = setTimeout(() => {
      if (!this.transformInProgress) {
        this.params.onTransformFinished();
      }

      this.wheelFinishTimer = null;
    }, this.params.scaleWheelFinishTimeout);
  };

  private readonly onTouchStart: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (this.prevTouches !== null) {
      this.prevTouches = processTouch(event);
      return;
    }

    this.prevTouches = processTouch(event);
    this.window.addEventListener("touchmove", this.onWindowTouchMove, {
      passive: true,
    });
    this.window.addEventListener("touchend", this.onWindowTouchFinish, {
      passive: true,
    });
    this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
      passive: true,
    });
    this.startRegisteredTransform();
  };

  private readonly onWindowTouchMove: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    const currentTouches = processTouch(event);
    const isEvery = currentTouches.touches.every((touch) =>
      isPointInside(this.window, this.element, touch[0], touch[1]),
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
    const transform = this.params.transformPreprocessor({
      prevTransform,
      nextTransform: prevTransform,
      canvasWidth: width,
      canvasHeight: height,
    });
    this.params.onResizeTransformStarted();
    this.canvas.patchViewportMatrix(transform);
    this.params.onResizeTransformFinished();
  });

  private readonly preventWheelScaleListener = (event: WheelEvent): void => {
    event.preventDefault();
  };

  public constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    private readonly params: TransformableViewportParams,
  ) {
    this.element.addEventListener("wheel", this.preventWheelScaleListener, {
      passive: false,
    });

    this.viewport = canvas.viewport;
    this.observer.observe(this.element);
    this.element.addEventListener("mousedown", this.onMouseDown, {
      passive: true,
    });
    this.element.addEventListener("wheel", this.onWheelScroll, {
      passive: true,
    });
    this.element.addEventListener("touchstart", this.onTouchStart, {
      passive: true,
    });

    canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    element: HTMLElement,
    win: Window,
    params: TransformableViewportParams,
  ): void {
    new UserTransformableViewportConfigurator(canvas, element, win, params);
  }

  private moveViewport(dx: number, dy: number): void {
    const prevTransform = this.viewport.getViewportMatrix();
    const nextTransform = move(prevTransform, dx, dy);
    const { width, height } = this.element.getBoundingClientRect();
    const transform = this.params.transformPreprocessor({
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
    const transform = this.params.transformPreprocessor({
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
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }

  private stopTouchDrag(): void {
    this.prevTouches = null;
    this.removeTouchDragListeners();
    this.finishRegisteredTransform();
  }

  private removeTouchDragListeners(): void {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }

  private performTransform(viewportTransform: PatchMatrixRequest): void {
    this.params.onBeforeTransformChange();
    this.canvas.patchViewportMatrix(viewportTransform);
    this.params.onTransformChange();
  }

  private startRegisteredTransform(): void {
    this.transformInProgress = true;
    this.params.onTransformStarted();
  }

  private finishRegisteredTransform(): void {
    this.transformInProgress = false;
    this.params.onTransformFinished();
  }
}
