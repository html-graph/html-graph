import { Canvas } from "@/canvas";
import { UserSelectableNodesParams } from "./user-selectable-nodes-params";
import { Identifier } from "@/identifier";
import { MouseEventVerifier } from "../shared";

export class UserSelectableNodesConfigurator {
  private readonly canvas: Canvas;

  private readonly window: Window;

  private readonly onSelectionChange: (
    nodeIds: ReadonlySet<Identifier>,
  ) => void;

  private readonly mouseDownEventVerifier: MouseEventVerifier;

  private readonly mouseUpEventVerifier: MouseEventVerifier;

  private selectionCandidateNodeId: Identifier | null = null;

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
    this.removeMouseDragListeners();
    this.removeTouchDragListeners();
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

    this.window.addEventListener("touchend", this.onWindowTouchEnd, {
      passive: true,
    });
  };

  private readonly onWindowMouseUp: EventListener = (event: Event): void => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseUpEventVerifier(mouseEvent)) {
      return;
    }

    this.removeMouseDragListeners();

    const nodeId = this.selectionCandidateNodeId;

    if (nodeId !== null && this.canvas.graph.hasNode(nodeId)) {
      this.onSelectionChange(new Set([nodeId]));
    }
  };

  private readonly onWindowTouchEnd: EventListener = (): void => {
    const nodeId = this.selectionCandidateNodeId;

    this.removeTouchDragListeners();

    if (nodeId !== null && this.canvas.graph.hasNode(nodeId)) {
      this.onSelectionChange(new Set([nodeId]));
    }
  };

  private constructor(params: UserSelectableNodesParams) {
    this.canvas = params.canvas;
    this.window = params.window;
    this.mouseDownEventVerifier = params.mouseDownEventVerifier;
    this.mouseUpEventVerifier = params.mouseUpEventVerifier;
    this.onSelectionChange = params.onSelectionChange;

    this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.canvas.graph.onBeforeClear.subscribe(this.reset);
    this.canvas.onBeforeDestroy.subscribe(this.revert);
  }

  public static configure(params: UserSelectableNodesParams): void {
    new UserSelectableNodesConfigurator(params);
  }

  private removeMouseDragListeners(): void {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }

  private removeTouchDragListeners(): void {
    this.window.removeEventListener("touchend", this.onWindowTouchEnd);
  }
}
