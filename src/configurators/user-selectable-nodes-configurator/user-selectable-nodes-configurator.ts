import { Canvas } from "@/canvas";
import { UserSelectableNodesParams } from "./user-selectable-nodes-params";
import { Identifier } from "@/identifier";
import { MouseEventVerifier } from "../shared";
import { NodeElement } from "@/element";

export class UserSelectableNodesConfigurator {
  private readonly canvas: Canvas;

  private readonly window: Window;

  private readonly selectionCallback: (
    nodeIds: ReadonlySet<Identifier>,
  ) => void;

  private readonly mouseDownEventVerifier: MouseEventVerifier;

  private readonly mouseUpEventVerifier: MouseEventVerifier;

  private selectionCandidate: Identifier | null = null;

  private readonly onAfterNodeAdded = (nodeId: Identifier): void => {
    const { element } = this.canvas.graph.getNode(nodeId);

    element.addEventListener("mousedown", this.onNodeMouseDown, {
      passive: true,
    });
  };

  private readonly onBeforeNodeRemoved = (nodeId: Identifier): void => {
    const { element } = this.canvas.graph.getNode(nodeId);
    this.selectionCandidate = null;

    element.removeEventListener("mousedown", this.onNodeMouseDown);
  };

  private readonly reset = (): void => {
    this.canvas.graph.getAllNodeIds().forEach((nodeId) => {
      const { element } = this.canvas.graph.getNode(nodeId);

      element.removeEventListener("mousedown", this.onNodeMouseDown);
    });

    this.selectionCandidate = null;
  };

  private readonly revert = (): void => {
    this.reset();
    this.removeMouseDragListeners();
  };

  private readonly onNodeMouseDown: EventListener = (event): void => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseDownEventVerifier(mouseEvent)) {
      return;
    }

    const nodeId = this.canvas.graph.findNodeIdByElement(
      event.currentTarget as NodeElement,
    )!;

    this.selectionCandidate = nodeId;

    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
  };

  private readonly onWindowMouseUp: EventListener = (event: Event): void => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseUpEventVerifier(mouseEvent)) {
      return;
    }

    if (this.selectionCandidate !== null) {
      this.selectionCallback(new Set([this.selectionCandidate]));
    }
  };

  private constructor(params: UserSelectableNodesParams) {
    this.canvas = params.canvas;
    this.window = params.window;
    this.mouseDownEventVerifier = params.mouseDownEventVerifier;
    this.mouseUpEventVerifier = params.mouseUpEventVerifier;
    this.selectionCallback = params.selectionCallback;

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
}
