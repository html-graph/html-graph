import { Canvas } from "@/canvas";
import { createConfig, DraggableNodesConfig, Config } from "./config";
import { isPointInside, setCursor } from "../shared";
import { Point } from "@/point";
import { Graph } from "@/graph";
import { transformPoint } from "@/transform-point";

// Responsibility: Configures canvas to have nodes draggable by user
export class UserDraggableNodesConfigurator {
  private grabbedNodeId: unknown | null = null;

  private maxNodePriority = 0;

  private previousTouchCoordinates: Point | null = null;

  private readonly graph: Graph;

  private readonly onAfterNodeAdded = (nodeId: unknown): void => {
    this.updateMaxNodePriority(nodeId);
    const node = this.graph.getNode(nodeId)!;

    node.element.addEventListener("mousedown", this.onMouseDown, {
      passive: true,
    });
    node.element.addEventListener("touchstart", this.onTouchStart, {
      passive: true,
    });
  };

  private readonly onAfterNodeUpdated = (nodeId: unknown): void => {
    this.updateMaxNodePriority(nodeId);
  };

  private readonly onBeforeNodeRemoved = (nodeId: unknown): void => {
    const node = this.graph.getNode(nodeId)!;

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
    this.canvas.graph.getAllNodeIds().forEach((nodeId) => {
      const node = this.canvas.graph.getNode(nodeId)!;

      node.element.removeEventListener("mousedown", this.onMouseDown);
      node.element.removeEventListener("touchstart", this.onTouchStart);
    });

    this.maxNodePriority = 0;
  };

  private readonly onMouseDown = (event: MouseEvent): void => {
    if (!this.config.mouseDownEventVerifier(event)) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    const nodeId = this.graph.getElementNodeId(element)!;
    const node = this.graph.getNode(nodeId)!;

    const isDragAllowed = this.config.onBeforeNodeDrag({
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
    setCursor(this.element, this.config.dragCursor);
    this.moveNodeOnTop(nodeId);
    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
    this.window.addEventListener("mousemove", this.onWindowMouseMove, {
      passive: true,
    });
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
    const nodeId = this.canvas.graph.getElementNodeId(element);
    const node = this.graph.getNode(nodeId)!;

    const isDragAllowed = this.config.onBeforeNodeDrag({
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

    this.window.addEventListener("touchmove", this.onWindowTouchMove, {
      passive: true,
    });
    this.window.addEventListener("touchend", this.onWindowTouchFinish, {
      passive: true,
    });
    this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
      passive: true,
    });
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
    if (!this.config.mouseUpEventVerifier(event)) {
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

  private readonly config: Config;

  private constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    draggableNodesConfig: DraggableNodesConfig,
  ) {
    this.config = createConfig(draggableNodesConfig);
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
    config: DraggableNodesConfig,
  ): void {
    new UserDraggableNodesConfigurator(canvas, element, win, config);
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

    this.config.onNodeDrag({
      nodeId,
      element: node.element,
      x: contentCoords.x,
      y: contentCoords.y,
    });
  }

  private moveNodeOnTop(nodeId: unknown): void {
    if (!this.config.moveOnTop) {
      return;
    }

    this.maxNodePriority++;

    if (this.config.moveEdgesOnTop) {
      const edgePriority = this.maxNodePriority;

      this.maxNodePriority++;

      const edges = this.graph.getNodeAdjacentEdgeIds(nodeId)!;

      edges.forEach((edgeId) => {
        this.canvas.updateEdge(edgeId, { priority: edgePriority });
      });
    }

    this.canvas.updateNode(nodeId, { priority: this.maxNodePriority });
  }

  private cancelMouseDrag(): void {
    const node = this.graph.getNode(this.grabbedNodeId);

    if (node !== null) {
      this.config.onNodeDragFinished({
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
      this.config.onNodeDragFinished({
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
