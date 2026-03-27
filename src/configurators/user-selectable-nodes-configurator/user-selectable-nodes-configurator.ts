import { Canvas } from "@/canvas";
import { UserSelectableNodesParams } from "./user-selectable-nodes-params";
import { Identifier } from "@/identifier";
import { MouseEventVerifier } from "../shared";

export class UserSelectableNodesConfigurator {
  private readonly canvas: Canvas;

  private readonly window: Window;

  private readonly selectionCallback: (
    nodeIds: ReadonlySet<Identifier>,
  ) => void;

  private readonly mouseDownEventVerifier: MouseEventVerifier;

  private readonly mouseUpEventVerifier: MouseEventVerifier;

  private readonly selection = new Set<Identifier>();

  private readonly onAfterNodeAdded = (nodeId: Identifier): void => {
    const { element } = this.canvas.graph.getNode(nodeId);
    this.selection.add(nodeId);

    element.addEventListener("mousedown", this.onNodeMouseDown, {
      passive: true,
    });
  };

  private readonly onBeforeNodeRemoved = (nodeId: Identifier): void => {
    const { element } = this.canvas.graph.getNode(nodeId);
    this.selection.delete(nodeId);

    element.removeEventListener("mousedown", this.onNodeMouseDown);
  };

  private readonly reset = (): void => {
    this.canvas.graph.getAllNodeIds().forEach((nodeId) => {
      const { element } = this.canvas.graph.getNode(nodeId);

      element.removeEventListener("mousedown", this.onNodeMouseDown);
    });

    this.selection.clear();
  };

  private readonly restore = (): void => {
    this.reset();
    this.removeMouseDragListeners();
  };

  private readonly onNodeMouseDown: EventListener = (event): void => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseDownEventVerifier(mouseEvent)) {
      return;
    }

    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
  };

  private readonly onWindowMouseUp: EventListener = (event: Event): void => {
    const mouseEvent = event as MouseEvent;

    if (!this.mouseUpEventVerifier(mouseEvent)) {
      return;
    }

    this.selectionCallback(new Set(this.selection));
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
    this.canvas.onBeforeDestroy.subscribe(this.restore);
  }

  public static configure(params: UserSelectableNodesParams): void {
    new UserSelectableNodesConfigurator(params);
  }

  private removeMouseDragListeners(): void {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
  }
}
