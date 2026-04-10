import { Canvas } from "@/canvas";
import { UserSelectableNodesParams } from "./user-selectable-nodes-params";
import { Identifier } from "@/identifier";
import {
  EventTagger,
  MouseEventVerifier,
  PointInsideVerifier,
  selectionHandled,
} from "../shared";
import { Point } from "@/point";

export class UserSelectableNodesConfigurator {
  private readonly onNodeSelected: (nodeId: Identifier) => void;

  private readonly mouseDownEventVerifier: MouseEventVerifier;

  private readonly mouseUpEventVerifier: MouseEventVerifier;

  private readonly movementThreshold: number;

  private readonly selectionHandledTag = selectionHandled;

  private selectionCandidateNodeId: Identifier | null = null;

  private movedDistance = 0;

  private previousMouse: Point | null = null;

  private previousTouch: Touch | null = null;

  private readonly onAfterNodeAdded = (nodeId: Identifier): void => {
    const { element } = this.canvas.graph.getNode(nodeId);

    element.addEventListener("mousedown", this.onNodeMouseDown, {
      passive: true,
    });

    element.addEventListener("touchstart", this.onNodeTouchStart, {
      passive: true,
    });
  };

  private readonly onBeforeNodeRemoved = (nodeId: Identifier): void => {
    const { element } = this.canvas.graph.getNode(nodeId);

    element.removeEventListener("mousedown", this.onNodeMouseDown);
    element.removeEventListener("touchstart", this.onNodeTouchStart);
  };

  private readonly reset = (): void => {
    this.canvas.graph.getAllNodeIds().forEach((nodeId) => {
      const { element } = this.canvas.graph.getNode(nodeId);

      element.removeEventListener("mousedown", this.onNodeMouseDown);
      element.removeEventListener("touchstart", this.onNodeTouchStart);
    });
  };

  private readonly revert = (): void => {
    this.reset();
    this.removeWindowMouseListeners();
    this.removeWindowTouchListeners();
  };

  private readonly onNodeMouseDown: EventListener = (event): void => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseDownEventVerifier(mouseEvent)) {
      return;
    }

    const nodeId = this.canvas.graph.findNodeIdByElement(
      event.currentTarget as Element,
    )!;

    this.selectionCandidateNodeId = nodeId;
    this.previousMouse = { x: mouseEvent.clientX, y: mouseEvent.clientY };
    this.movedDistance = 0;

    this.window.addEventListener("mousemove", this.onWindowMouseMove, {
      passive: true,
    });

    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
  };

  private readonly onNodeTouchStart: EventListener = (event: Event): void => {
    const touchEvent = event as TouchEvent;

    if (touchEvent.touches.length !== 1) {
      return;
    }

    const nodeId = this.canvas.graph.findNodeIdByElement(
      touchEvent.currentTarget as Element,
    )!;

    this.selectionCandidateNodeId = nodeId;
    this.previousTouch = touchEvent.touches[0];
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

  private readonly onWindowMouseMove = (event: Event): void => {
    const mouseEvent = event as MouseEvent;

    const previousMouse = this.previousMouse!;
    const x = mouseEvent.clientX - previousMouse.x;
    const y = mouseEvent.clientY - previousMouse.y;

    if (
      !this.pointInsideVerifier.verify(mouseEvent.clientX, mouseEvent.clientY)
    ) {
      this.removeWindowMouseListeners();
      return;
    }

    this.processMoveThresholdVerification(x, y, () => {
      this.removeWindowMouseListeners();
    });

    this.previousMouse = { x: mouseEvent.clientX, y: mouseEvent.clientY };
  };

  private readonly onWindowTouchMove: EventListener = (event: Event): void => {
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

    const previousTouch = this.previousTouch!;
    const x = touch.clientX - previousTouch.clientX;
    const y = touch.clientY - previousTouch.clientY;

    this.processMoveThresholdVerification(x, y, () => {
      this.removeWindowTouchListeners();
    });

    this.previousTouch = touch;
  };

  private readonly onWindowMouseUp: EventListener = (event: Event): void => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseUpEventVerifier(mouseEvent)) {
      return;
    }

    this.removeWindowMouseListeners();
    this.trySelectNode(event);
  };

  private readonly onWindowTouchEnd: EventListener = (event: Event): void => {
    this.removeWindowTouchListeners();
    this.trySelectNode(event);
  };

  private readonly onWindowTouchCancel: EventListener = (): void => {
    this.removeWindowTouchListeners();
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly window: Window,
    private readonly pointInsideVerifier: PointInsideVerifier,
    private readonly eventTagger: EventTagger,
    params: UserSelectableNodesParams,
  ) {
    this.mouseDownEventVerifier = params.mouseDownEventVerifier;
    this.mouseUpEventVerifier = params.mouseUpEventVerifier;
    this.onNodeSelected = params.onNodeSelected;
    this.movementThreshold = params.movementThreshold;

    this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.canvas.graph.onBeforeClear.subscribe(this.reset);
    this.canvas.onBeforeDestroy.subscribe(this.revert);
  }

  public static configure(
    canvas: Canvas,
    window: Window,
    pointInsideVerifier: PointInsideVerifier,
    eventTagger: EventTagger,
    params: UserSelectableNodesParams,
  ): void {
    new UserSelectableNodesConfigurator(
      canvas,
      window,
      pointInsideVerifier,
      eventTagger,
      params,
    );
  }

  private removeWindowMouseListeners(): void {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }

  private removeWindowTouchListeners(): void {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchEnd);
    this.window.removeEventListener("touchcancel", this.onWindowTouchCancel);
  }

  private trySelectNode(event: Event): void {
    const nodeId = this.selectionCandidateNodeId!;

    if (this.canvas.graph.hasNode(nodeId)) {
      this.onNodeSelected(nodeId);
      this.eventTagger.tag(event, this.selectionHandledTag);
    }
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
