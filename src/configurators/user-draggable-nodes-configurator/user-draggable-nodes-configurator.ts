import { Canvas } from "@/canvas";
import {
  dragEventHandledTag,
  EventTagger,
  PointInsideVerifier,
  setCursor,
} from "../shared";
import { Point } from "@/point";
import { DraggableNodesParams } from "./draggable-nodes-params";
import { GrabbedNodeState } from "./grabbed-node-state";
import { Identifier } from "@/identifier";
import { Graph } from "@/graph";

export class UserDraggableNodesConfigurator {
  private grabbedNodeState: GrabbedNodeState | null = null;

  private maxNodePriority = 0;

  private readonly graph: Graph;

  private readonly onAfterNodeAdded = (nodeId: Identifier): void => {
    this.updateMaxNodePriority(nodeId);
    const { element } = this.graph.getNode(nodeId);

    element.addEventListener("mousedown", this.onMouseDown, {
      passive: true,
    });
    element.addEventListener("touchstart", this.onTouchStart, {
      passive: true,
    });
  };

  private readonly onAfterNodeUpdated = (nodeId: Identifier): void => {
    this.updateMaxNodePriority(nodeId);
  };

  private readonly onBeforeNodeRemoved = (nodeId: Identifier): void => {
    const { element } = this.graph.getNode(nodeId);

    element.removeEventListener("mousedown", this.onMouseDown);
    element.removeEventListener("touchstart", this.onTouchStart);
  };

  private readonly onMouseDown: EventListener = (event: Event): void => {
    if (this.eventTagger.has(event, dragEventHandledTag)) {
      return;
    }

    const mouseEvent = event as MouseEvent;

    if (!this.params.mouseDownEventVerifier(mouseEvent)) {
      return;
    }

    const element = event.currentTarget as Element;
    const nodeId = this.graph.findNodeIdByElement(element)!;
    const node = this.graph.getNode(nodeId);

    const isDragAllowed = this.params.nodeDragVerifier(nodeId);

    if (!isDragAllowed) {
      return;
    }

    this.eventTagger.tag(event, dragEventHandledTag);

    this.params.onNodeDragStarted(nodeId);

    const cursorContent = this.calculateContentPoint({
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
    });

    this.grabbedNodeState = {
      nodeId,
      dx: cursorContent.x - node.x!,
      dy: cursorContent.y - node.y!,
    };

    // TODO: make cursor behavior more flexible
    setCursor(this.element, this.params.dragCursor);

    this.moveNodeOnTop(nodeId);

    this.window.addEventListener("mousemove", this.onWindowMouseMove, {
      passive: true,
    });

    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
  };

  private readonly onTouchStart: EventListener = (event: Event) => {
    if (this.eventTagger.has(event, dragEventHandledTag)) {
      return;
    }

    const touchEvent = event as TouchEvent;

    if (touchEvent.touches.length !== 1) {
      return;
    }

    const touch = touchEvent.touches[0];

    const element = event.currentTarget as Element;
    const nodeId = this.canvas.graph.findNodeIdByElement(element)!;
    const node = this.graph.getNode(nodeId);

    const isDragAllowed = this.params.nodeDragVerifier({
      nodeId: nodeId,
      element: node.element,
      x: node.x,
      y: node.y,
    });

    if (!isDragAllowed) {
      return;
    }

    this.eventTagger.tag(event, dragEventHandledTag);

    const cursorContent = this.calculateContentPoint({
      x: touch.clientX,
      y: touch.clientY,
    });

    this.grabbedNodeState = {
      nodeId,
      dx: cursorContent.x - node.x!,
      dy: cursorContent.y - node.y!,
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
    const isInside = this.pointInsideVerifier.verify(
      event.clientX,
      event.clientY,
    );

    if (!isInside) {
      this.stopMouseDrag();
      return;
    }

    this.moveNode(this.grabbedNodeState!, {
      x: event.clientX,
      y: event.clientY,
    });
  };

  private readonly onWindowMouseUp = (event: MouseEvent): void => {
    if (!this.params.mouseUpEventVerifier(event)) {
      return;
    }

    this.stopMouseDrag();
  };

  private readonly onWindowTouchMove = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];

    const isInside = this.pointInsideVerifier.verify(
      touch.clientX,
      touch.clientY,
    );

    if (!isInside) {
      this.stopTouchDrag();
      return;
    }

    this.moveNode(this.grabbedNodeState!, {
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  private readonly onWindowTouchFinish = (): void => {
    this.stopTouchDrag();
  };

  private readonly reset = (): void => {
    this.canvas.graph.getAllNodeIds().forEach((nodeId) => {
      const { element } = this.canvas.graph.getNode(nodeId);

      element.removeEventListener("mousedown", this.onMouseDown);
      element.removeEventListener("touchstart", this.onTouchStart);
    });

    this.maxNodePriority = 0;
  };

  private readonly revert = (): void => {
    this.reset();
    this.removeMouseDragListeners();
    this.removeTouchDragListeners();
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    private readonly pointInsideVerifier: PointInsideVerifier,
    private readonly eventTagger: EventTagger,
    private readonly params: DraggableNodesParams,
  ) {
    this.graph = canvas.graph;

    this.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.graph.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated);
    this.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.graph.onBeforeClear.subscribe(this.reset);
    this.canvas.onBeforeDestroy.subscribe(this.revert);
  }

  public static configure(
    canvas: Canvas,
    element: HTMLElement,
    win: Window,
    pointInsideVerifier: PointInsideVerifier,
    eventTagger: EventTagger,
    config: DraggableNodesParams,
  ): void {
    new UserDraggableNodesConfigurator(
      canvas,
      element,
      win,
      pointInsideVerifier,
      eventTagger,
      config,
    );
  }

  private moveNode(state: GrabbedNodeState, cursor: Point): void {
    if (!this.graph.hasNode(state.nodeId)) {
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

      const edges = this.graph.getNodeAdjacentEdgeIds(nodeId);

      edges.forEach((edgeId) => {
        this.canvas.updateEdge(edgeId, { priority: edgePriority });
      });
    }

    this.canvas.updateNode(nodeId, { priority: this.maxNodePriority });
  }

  private stopMouseDrag(): void {
    this.finishDrag();
    setCursor(this.element, null);
    this.removeMouseDragListeners();
  }

  private removeMouseDragListeners(): void {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }

  private stopTouchDrag(): void {
    this.finishDrag();
    this.removeTouchDragListeners();
  }

  private removeTouchDragListeners(): void {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }

  private updateMaxNodePriority(nodeId: Identifier): void {
    const priority = this.graph.getNode(nodeId).priority;

    this.maxNodePriority = Math.max(this.maxNodePriority, priority);
  }

  private calculateContentPoint(clientPoint: Point): Point {
    const rect = this.element.getBoundingClientRect();

    const contentPoint = this.canvas.viewport.createContentCoords({
      x: clientPoint.x - rect.x,
      y: clientPoint.y - rect.y,
    });

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

  private finishDrag(): void {
    const grabbedNodeId = this.grabbedNodeState!.nodeId;

    if (this.graph.hasNode(grabbedNodeId)) {
      this.params.onNodeDragFinished(grabbedNodeId);
    }

    this.grabbedNodeState = null;
  }
}
