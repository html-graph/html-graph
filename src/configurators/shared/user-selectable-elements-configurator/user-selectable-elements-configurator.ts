import { PointInsideVerifier } from "../point-inside-verifier";
import { MouseEventVerifier } from "../mouse-event-verifier";
import { UserSelectableElementsParams } from "./user-selectable-elements-params";
import { Point } from "@/point";

export class UserSelectableElementsConfigurator {
  private readonly onSelected: (element: Element) => void;

  private readonly mouseDownEventVerifier: MouseEventVerifier;

  private readonly mouseUpEventVerifier: MouseEventVerifier;

  private readonly movementThreshold: number;

  private selectionCandidate: Element | null = null;

  private previousMouse: Point | null = null;

  private previousTouch: Touch | null = null;

  private movedDistance = 0;

  private readonly onElementMouseDown: EventListener = (event): void => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseDownEventVerifier(mouseEvent)) {
      return;
    }

    this.selectionCandidate = mouseEvent.currentTarget as Element;
    this.previousMouse = { x: mouseEvent.clientX, y: mouseEvent.clientY };
    this.movedDistance = 0;

    this.window.addEventListener("mousemove", this.onWindowMouseMove, {
      passive: true,
    });

    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
  };

  private readonly onElementTouchStart: EventListener = (
    event: Event,
  ): void => {
    const touchEvent = event as TouchEvent;
    const touches = touchEvent.touches;

    if (touches.length !== 1) {
      return;
    }

    this.selectionCandidate = touchEvent.currentTarget as Element;
    this.previousTouch = touches[0];

    this.window.addEventListener("touchend", this.onWindowTouchEnd, {
      passive: true,
    });

    this.window.addEventListener("touchmove", this.onWindowTouchMove, {
      passive: true,
    });

    this.window.addEventListener("touchcancel", this.onWindowTouchCancel, {
      passive: true,
    });
  };

  private readonly onWindowMouseMove = (event: Event): void => {
    const mouseEvent = event as MouseEvent;

    const inside = this.pointInsideVerifier.verify(
      mouseEvent.clientX,
      mouseEvent.clientY,
    );

    if (!inside) {
      this.removeWindowMouseListeners();
      return;
    }

    const previousMouse = this.previousMouse!;
    const x = mouseEvent.clientX - previousMouse.x;
    const y = mouseEvent.clientY - previousMouse.y;
    this.previousMouse = { x: mouseEvent.clientX, y: mouseEvent.clientY };

    this.processMoveThresholdVerification(x, y, () => {
      this.removeWindowMouseListeners();
    });
  };

  private readonly onWindowMouseUp: EventListener = (event: Event): void => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseUpEventVerifier(mouseEvent)) {
      return;
    }

    this.removeWindowMouseListeners();
    this.onSelected(this.selectionCandidate!);
  };

  private readonly onWindowTouchMove: EventListener = (event: Event): void => {
    const touchEvent = event as TouchEvent;
    const touches = touchEvent.touches;

    if (touches.length !== 1) {
      this.removeWindowTouchListeners();
      return;
    }

    const touch = touches[0];

    const inside = this.pointInsideVerifier.verify(
      touch.clientX,
      touch.clientY,
    );

    if (!inside) {
      this.removeWindowTouchListeners();
      return;
    }

    const previousTouch = this.previousTouch!;
    const x = touch.clientX - previousTouch.clientX;
    const y = touch.clientY - previousTouch.clientY;
    this.previousTouch = touch;

    this.processMoveThresholdVerification(x, y, () => {
      this.removeWindowTouchListeners();
    });
  };

  private readonly onWindowTouchEnd: EventListener = (): void => {
    this.removeWindowTouchListeners();
    this.onSelected(this.selectionCandidate!);
  };

  private readonly onWindowTouchCancel: EventListener = (): void => {
    this.removeWindowTouchListeners();
  };

  public constructor(
    private readonly window: Window,
    private readonly pointInsideVerifier: PointInsideVerifier,
    params: UserSelectableElementsParams,
  ) {
    this.mouseDownEventVerifier = params.mouseDownEventVerifier;
    this.mouseUpEventVerifier = params.mouseUpEventVerifier;
    this.onSelected = params.onSelected;
    this.movementThreshold = params.movementThreshold;
  }

  public enable(element: Element): void {
    element.addEventListener("mousedown", this.onElementMouseDown);
    element.addEventListener("touchstart", this.onElementTouchStart);
  }

  public disable(element: Element): void {
    element.removeEventListener("mousedown", this.onElementMouseDown);
    element.removeEventListener("touchstart", this.onElementTouchStart);

    if (element === this.selectionCandidate) {
      this.removeWindowMouseListeners();
      this.removeWindowTouchListeners();
    }
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
