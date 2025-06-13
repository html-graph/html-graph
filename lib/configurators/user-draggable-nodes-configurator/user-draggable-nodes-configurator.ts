import { Canvas } from "@/canvas";
import { createOptions, DragOptions, Options } from "./create-options";
import { isPointInside, setCursor, transformPoint } from "../shared";
import { Point } from "@/point";
import { Graph } from "@/graph";

/**
 * Responsibility: Configures canvas to have nodes draggable by user
 */
export class UserDraggableNodesConfigurator {
  private grabbedNodeId: unknown | null = null;

  private maxNodePriority = 0;

  private previousTouchCoordinates: Point | null = null;

  private readonly nodeIds = new Map<HTMLElement, unknown>();

  private readonly graph: Graph;

  private readonly onAfterNodeAdded = (nodeId: unknown): void => {
    this.updateMaxNodePriority(nodeId);
    const node = this.graph.getNode(nodeId)!;

    this.nodeIds.set(node.element, nodeId);

    node.element.addEventListener("mousedown", this.onMouseDown);
    node.element.addEventListener("touchstart", this.onTouchStart);
  };

  private readonly onAfterNodeUpdated = (nodeId: unknown): void => {
    this.updateMaxNodePriority(nodeId);
  };

  private readonly onBeforeNodeRemoved = (nodeId: unknown): void => {
    const node = this.graph.getNode(nodeId)!;

    this.nodeIds.delete(node.element);

    node.element.removeEventListener("mousedown", this.onMouseDown);
    node.element.removeEventListener("touchstart", this.onTouchStart);
  };

  private readonly onBeforeDestroy = (): void => {
    this.graph.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded);
    this.graph.onAfterNodeUpdated.unsubscribe(this.onAfterNodeUpdated);
    this.graph.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved);
    this.graph.onBeforeClear.unsubscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);

    this.removeMouseDragListeners();
    this.removeTouchDragListeners();
  };

  private readonly onBeforeClear = (): void => {
    this.nodeIds.forEach((_nodeId, element) => {
      element.removeEventListener("mousedown", this.onMouseDown);
      element.removeEventListener("touchstart", this.onTouchStart);
    });

    this.nodeIds.clear();
    this.maxNodePriority = 0;
  };

  private readonly onMouseDown = (event: MouseEvent): void => {
    if (!this.options.mouseDownEventVerifier(event)) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    const nodeId = this.nodeIds.get(element);
    const node = this.graph.getNode(nodeId)!;

    const isDragAllowed = this.options.onBeforeNodeDrag({
      nodeId,
      element: node.element,
      x: node.x,
      y: node.y,
    });

    if (!isDragAllowed) {
      return;
    }

    event.stopImmediatePropagation();
    this.grabbedNodeId = nodeId;
    setCursor(this.element, this.options.dragCursor);
    this.moveNodeOnTop(nodeId);
    this.window.addEventListener("mouseup", this.onWindowMouseUp);
    this.window.addEventListener("mousemove", this.onWindowMouseMove);
  };

  private readonly onTouchStart: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (event.touches.length !== 1) {
      return;
    }

    event.stopImmediatePropagation();

    this.previousTouchCoordinates = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    const element = event.currentTarget as HTMLElement;
    const nodeId = this.nodeIds.get(element);
    const node = this.graph.getNode(nodeId)!;

    const isDragAllowed = this.options.onBeforeNodeDrag({
      nodeId: nodeId,
      element: node.element,
      x: node.x,
      y: node.y,
    });

    if (!isDragAllowed) {
      return;
    }

    this.grabbedNodeId = nodeId;
    this.moveNodeOnTop(nodeId);

    this.window.addEventListener("touchmove", this.onWindowTouchMove);
    this.window.addEventListener("touchend", this.onWindowTouchFinish);
    this.window.addEventListener("touchcancel", this.onWindowTouchFinish);
  };

  private readonly onWindowMouseMove = (event: MouseEvent): void => {
    const isInside = isPointInside(
      this.window,
      this.element,
      event.clientX,
      event.clientY,
    );

    if (!isInside) {
      this.cancelMouseDrag();
      return;
    }

    if (this.grabbedNodeId !== null) {
      this.dragNode(this.grabbedNodeId, event.movementX, event.movementY);
    }
  };

  private readonly onWindowMouseUp = (event: MouseEvent): void => {
    if (!this.options.mouseUpEventVerifier(event)) {
      return;
    }

    this.cancelMouseDrag();
  };

  private readonly onWindowTouchMove = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];

    const isInside = isPointInside(
      this.window,
      this.element,
      touch.clientX,
      touch.clientY,
    );

    if (!isInside) {
      this.cancelTouchDrag();
      return;
    }

    if (this.grabbedNodeId !== null && this.previousTouchCoordinates !== null) {
      const dx = touch.clientX - this.previousTouchCoordinates.x;
      const dy = touch.clientY - this.previousTouchCoordinates.y;

      this.dragNode(this.grabbedNodeId, dx, dy);

      this.previousTouchCoordinates = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  };

  private readonly onWindowTouchFinish = (): void => {
    this.previousTouchCoordinates = null;
    this.cancelTouchDrag();
  };

  private readonly options: Options;

  private constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    dragOptions: DragOptions,
  ) {
    this.options = createOptions(dragOptions);
    this.graph = canvas.graph;

    this.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.graph.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated);
    this.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.graph.onBeforeClear.subscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    element: HTMLElement,
    win: Window,
    options: DragOptions,
  ): void {
    new UserDraggableNodesConfigurator(canvas, element, win, options);
  }

  private dragNode(nodeId: unknown, dx: number, dy: number): void {
    const node = this.graph.getNode(nodeId)!;

    if (node === null) {
      return;
    }

    const contentMatrix = this.canvas.viewport.getContentMatrix();
    const viewportCoords = transformPoint(contentMatrix, {
      x: node.x,
      y: node.y,
    });
    const newViewportCoords = transformPoint(
      { scale: 1, x: dx, y: dy },
      viewportCoords,
    );

    const viewportMatrix = this.canvas.viewport.getViewportMatrix();
    const contentCoords = transformPoint(viewportMatrix, newViewportCoords);

    this.canvas.updateNode(nodeId, { x: contentCoords.x, y: contentCoords.y });

    this.options.onNodeDrag({
      nodeId,
      element: node.element,
      x: contentCoords.x,
      y: contentCoords.y,
    });
  }

  private moveNodeOnTop(nodeId: unknown): void {
    if (this.options.freezePriority) {
      return;
    }

    this.maxNodePriority += 2;
    this.canvas.updateNode(nodeId, { priority: this.maxNodePriority });

    const edgePriority = this.maxNodePriority - 1;

    const edges = this.graph.getNodeAdjacentEdgeIds(nodeId)!;

    edges.forEach((edgeId) => {
      this.canvas.updateEdge(edgeId, { priority: edgePriority });
    });
  }

  private cancelMouseDrag(): void {
    const node = this.graph.getNode(this.grabbedNodeId);

    if (node !== null) {
      this.options.onNodeDragFinished({
        nodeId: this.grabbedNodeId,
        element: node.element,
        x: node.x,
        y: node.y,
      });
    }

    this.grabbedNodeId = null;
    setCursor(this.element, null);
    this.removeMouseDragListeners();
  }

  private removeMouseDragListeners(): void {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }

  private cancelTouchDrag(): void {
    this.previousTouchCoordinates = null;
    const node = this.graph.getNode(this.grabbedNodeId);

    if (node !== null) {
      this.options.onNodeDragFinished({
        nodeId: this.grabbedNodeId,
        element: node.element,
        x: node.x,
        y: node.y,
      });
    }

    this.grabbedNodeId = null;
    this.removeTouchDragListeners();
  }

  private removeTouchDragListeners(): void {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }

  private updateMaxNodePriority(nodeId: unknown): void {
    const priority = this.graph.getNode(nodeId)!.priority;

    this.maxNodePriority = Math.max(this.maxNodePriority, priority);
  }
}
