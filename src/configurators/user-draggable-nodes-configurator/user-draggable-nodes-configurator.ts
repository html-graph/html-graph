import { Canvas } from "@/canvas";
import { isPointInside, setCursor } from "../shared";
import { Point } from "@/point";
import { Graph } from "@/canvas";
import { transformPoint } from "@/transform-point";
import { DraggableNodesParams } from "./draggable-nodes-params";
import { GrabbedNodeState } from "./grabbed-node-state";
import { Identifier } from "@/identifier";

export class UserDraggableNodesConfigurator {
  private grabbedNode: GrabbedNodeState | null = null;

  private maxNodePriority = 0;

  private readonly graph: Graph;

  private readonly onAfterNodeAdded = (nodeId: Identifier): void => {
    this.updateMaxNodePriority(nodeId);
    const node = this.graph.getNode(nodeId)!;

    node.element.addEventListener("mousedown", this.onMouseDown, {
      passive: true,
    });
    node.element.addEventListener("touchstart", this.onTouchStart, {
      passive: true,
    });
  };

  private readonly onAfterNodeUpdated = (nodeId: Identifier): void => {
    this.updateMaxNodePriority(nodeId);
  };

  private readonly onBeforeNodeRemoved = (nodeId: Identifier): void => {
    const node = this.graph.getNode(nodeId)!;

    node.element.removeEventListener("mousedown", this.onMouseDown);
    node.element.removeEventListener("touchstart", this.onTouchStart);
  };

  private readonly onBeforeDestroy = (): void => {
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
    if (!this.params.mouseDownEventVerifier(event)) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    const nodeId = this.graph.getElementNodeId(element)!;
    const node = this.graph.getNode(nodeId)!;

    const isDragAllowed = this.params.nodeDragVerifier(nodeId);

    if (!isDragAllowed) {
      return;
    }

    event.stopPropagation();

    const cursorContent = this.calculateContentPoint({
      x: event.clientX,
      y: event.clientY,
    });

    this.grabbedNode = {
      nodeId,
      dx: cursorContent.x - node.x,
      dy: cursorContent.y - node.y,
    };

    setCursor(this.element, this.params.dragCursor);

    this.moveNodeOnTop(nodeId);

    this.window.addEventListener("mousemove", this.onWindowMouseMove, {
      passive: true,
    });

    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
  };

  private readonly onTouchStart: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (event.touches.length !== 1) {
      return;
    }

    event.stopPropagation();

    const touch = event.touches[0];

    const element = event.currentTarget as HTMLElement;
    const nodeId = this.canvas.graph.getElementNodeId(element)!;
    const node = this.graph.getNode(nodeId)!;

    const isDragAllowed = this.params.nodeDragVerifier({
      nodeId: nodeId,
      element: node.element,
      x: node.x,
      y: node.y,
    });

    if (!isDragAllowed) {
      return;
    }

    const cursorContent = this.calculateContentPoint({
      x: touch.clientX,
      y: touch.clientY,
    });

    this.grabbedNode = {
      nodeId,
      dx: cursorContent.x - node.x,
      dy: cursorContent.y - node.y,
    };
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

    if (this.grabbedNode !== null) {
      this.moveNode(this.grabbedNode, {
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  private readonly onWindowMouseUp = (event: MouseEvent): void => {
    if (!this.params.mouseUpEventVerifier(event)) {
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

    if (this.grabbedNode !== null) {
      this.moveNode(this.grabbedNode, {
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  };

  private readonly onWindowTouchFinish = (): void => {
    this.cancelTouchDrag();
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    private readonly params: DraggableNodesParams,
  ) {
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
    config: DraggableNodesParams,
  ): void {
    new UserDraggableNodesConfigurator(canvas, element, win, config);
  }

  private moveNode(state: GrabbedNodeState, cursor: Point): void {
    const node = this.graph.getNode(state.nodeId)!;

    if (node === null) {
      return;
    }

    const contentPoint = this.calculateContentPoint(cursor);

    const newCoords: Point = {
      x: contentPoint.x - state.dx,
      y: contentPoint.y - state.dy,
    };

    const adjustedCoords: Point = this.adjustNodeCoords(newCoords);

    this.canvas.updateNode(state.nodeId, {
      x: adjustedCoords.x,
      y: adjustedCoords.y,
    });

    this.params.onNodeDrag(state.nodeId);
  }

  private moveNodeOnTop(nodeId: Identifier): void {
    if (!this.params.moveOnTop) {
      return;
    }

    this.maxNodePriority++;

    if (this.params.moveEdgesOnTop) {
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
    if (this.grabbedNode !== null) {
      const node = this.graph.getNode(this.grabbedNode.nodeId);

      if (node !== null) {
        this.params.onNodeDragFinished(this.grabbedNode.nodeId);
      }
    }

    this.grabbedNode = null;
    setCursor(this.element, null);
    this.removeMouseDragListeners();
  }

  private removeMouseDragListeners(): void {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }

  private cancelTouchDrag(): void {
    if (this.grabbedNode !== null) {
      const node = this.graph.getNode(this.grabbedNode.nodeId);

      if (node !== null) {
        this.params.onNodeDragFinished({
          nodeId: this.grabbedNode.nodeId,
          element: node.element,
          x: node.x,
          y: node.y,
        });
      }
    }

    this.grabbedNode = null;
    this.removeTouchDragListeners();
  }

  private removeTouchDragListeners(): void {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }

  private updateMaxNodePriority(nodeId: Identifier): void {
    const priority = this.graph.getNode(nodeId)!.priority;

    this.maxNodePriority = Math.max(this.maxNodePriority, priority);
  }

  private calculateContentPoint(clientPoint: Point): Point {
    const rect = this.element.getBoundingClientRect();
    const viewportPoint: Point = {
      x: clientPoint.x - rect.x,
      y: clientPoint.y - rect.y,
    };

    const viewportMatrix = this.canvas.viewport.getViewportMatrix();
    const contentPoint = transformPoint(viewportMatrix, viewportPoint);

    return contentPoint;
  }

  private adjustNodeCoords(coords: Point): Point {
    const gridSize = this.params.gridSize;

    if (gridSize !== null) {
      const half = gridSize / 2;

      return {
        x: Math.floor((coords.x + half) / gridSize) * gridSize,
        y: Math.floor((coords.y + half) / gridSize) * gridSize,
      };
    }

    return coords;
  }
}
