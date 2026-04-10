import { Canvas } from "@/canvas";
import { UserSelectableCanvasParams } from "./user-selectable-canvas-params";
import { Point } from "@/point";
import {
  EventTagger,
  MouseEventVerifier,
  PointInsideVerifier,
  selectionHandled,
} from "../shared";

export class UserSelectableCanvasConfigurator {
  private readonly onCanvasSelected: () => void;

  private readonly movementThreshold: number;

  private readonly mouseDownEventVerifier: MouseEventVerifier;

  private readonly mouseUpEventVerifier: MouseEventVerifier;

  private readonly selectionHandledTag = selectionHandled;

  private movedDistance = 0;

  private previousMouseDown: Point | null = null;

  private previousTouch: Touch | null = null;

  private readonly onMouseDown: EventListener = (event: Event) => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseDownEventVerifier(mouseEvent)) {
      return;
    }

    this.previousMouseDown = { x: mouseEvent.clientX, y: mouseEvent.clientY };
    this.movedDistance = 0;

    this.window.addEventListener("mousemove", this.onWindowMouseMove, {
      passive: true,
    });

    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
  };

  private readonly onTouchStart: EventListener = (event: Event) => {
    const touchEvent = event as TouchEvent;

    if (touchEvent.touches.length !== 1) {
      return;
    }

    const touch = touchEvent.touches[0];

    this.previousTouch = touch;
    this.movedDistance = 0;

    this.window.addEventListener("touchmove", this.onWindowTouchMove, {
      passive: true,
    });

    this.window.addEventListener("touchend", this.onWindowTouchEnd, {
      passive: true,
    });

    this.window.addEventListener("touchcancel", this.onWindowTouchCancel, {
      passive: true,
    });
  };

  private readonly onWindowMouseMove: EventListener = (event: Event) => {
    const mouseEvent = event as MouseEvent;

    if (
      !this.pointInsideVerifier.verify(mouseEvent.clientX, mouseEvent.clientY)
    ) {
      this.removeWindowMouseListeners();
      return;
    }

    const previous = this.previousMouseDown!;

    const dx = mouseEvent.clientX - previous.x;
    const dy = mouseEvent.clientY - previous.y;

    this.processMoveThresholdVerification(dx, dy, () => {
      this.removeWindowMouseListeners();
    });

    this.previousMouseDown = { x: mouseEvent.clientX, y: mouseEvent.clientY };
  };

  private readonly onWindowTouchMove: EventListener = (event: Event) => {
    const touchEvent = event as TouchEvent;

    if (touchEvent.touches.length !== 1) {
      this.removeWindowTouchListeners();
      return;
    }

    const touch = touchEvent.touches[0];

    if (!this.pointInsideVerifier.verify(touch.clientX, touch.clientY)) {
      this.removeWindowTouchListeners();
      return;
    }

    const previous = this.previousTouch!;

    const dx = touch.clientX - previous.clientX;
    const dy = touch.clientY - previous.clientY;

    this.processMoveThresholdVerification(dx, dy, () => {
      this.removeWindowTouchListeners();
    });

    this.previousTouch = touch;
  };

  private readonly onWindowMouseUp: EventListener = (event: Event) => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseUpEventVerifier(mouseEvent)) {
      return;
    }

    if (!this.eventTagger.has(event, this.selectionHandledTag)) {
      this.onCanvasSelected();
    }

    this.removeWindowMouseListeners();
  };

  private readonly onWindowTouchEnd: EventListener = () => {
    this.onCanvasSelected();

    this.removeWindowTouchListeners();
  };

  private readonly onWindowTouchCancel: EventListener = () => {
    this.removeWindowTouchListeners();
  };

  private readonly restore = (): void => {
    this.element.removeEventListener("mousedown", this.onMouseDown);
    this.element.removeEventListener("touchstart", this.onTouchStart);
    this.removeWindowMouseListeners();
    this.removeWindowTouchListeners();
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    private readonly pointInsideVerifier: PointInsideVerifier,
    private readonly eventTagger: EventTagger,
    params: UserSelectableCanvasParams,
  ) {
    this.onCanvasSelected = params.onCanvasSelected;
    this.movementThreshold = params.movementThreshold;
    this.mouseDownEventVerifier = params.mouseDownEventVerifier;
    this.mouseUpEventVerifier = params.mouseUpEventVerifier;

    this.canvas.onBeforeDestroy.subscribe(this.restore);

    this.element.addEventListener("mousedown", this.onMouseDown, {
      passive: true,
    });

    this.element.addEventListener("touchstart", this.onTouchStart, {
      passive: true,
    });
  }

  public static configure(
    canvas: Canvas,
    element: HTMLElement,
    window: Window,
    pointInsideVerifier: PointInsideVerifier,
    eventTagger: EventTagger,
    params: UserSelectableCanvasParams,
  ): void {
    new UserSelectableCanvasConfigurator(
      canvas,
      element,
      window,
      pointInsideVerifier,
      eventTagger,
      params,
    );
  }

  private removeWindowMouseListeners(): void {
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }

  private removeWindowTouchListeners(): void {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchEnd);
    this.window.removeEventListener("touchcancel", this.onWindowTouchCancel);
  }

  private processMoveThresholdVerification(
    x: number,
    y: number,
    thresholdReachedCallback: () => void,
  ): void {
    const distance = Math.sqrt(x * x + y * y);
    this.movedDistance += distance;

    if (this.movedDistance > this.movementThreshold) {
      thresholdReachedCallback();
    }
  }
}
