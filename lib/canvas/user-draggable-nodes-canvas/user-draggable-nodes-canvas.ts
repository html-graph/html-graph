import { IdGenerator } from "@/id-generator";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { DragOptions } from "./create-options";
import { isPointOnElement, isPointOnWindow, setCursor } from "../utils";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { UpdatePortRequest } from "../update-port-request";
import { NodeState } from "./node-state";
import { Point } from "@/point";
import { createOptions, Options } from "./create-options";

export class UserDraggableNodesCanvas implements Canvas {
  public readonly graph: Graph;

  public readonly viewport: Viewport;

  private maxNodePriority = 0;

  private readonly nodes = new Map<unknown, NodeState>();

  private grabbedNodeId: unknown | null = null;

  private readonly nodeIdGenerator = new IdGenerator((nodeId) =>
    this.nodes.has(nodeId),
  );

  private element: HTMLElement | null = null;

  private readonly onWindowMouseMove: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (
      this.element !== null &&
      (!isPointOnElement(this.element, event.clientX, event.clientY) ||
        !isPointOnWindow(this.window, event.clientX, event.clientY))
    ) {
      this.cancelMouseDrag();
      return;
    }

    if (this.grabbedNodeId !== null) {
      this.dragNode(this.grabbedNodeId, event.movementX, event.movementY);
    }
  };

  private readonly onWindowMouseUp: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (!this.options.mouseUpEventVerifier(event)) {
      return;
    }

    this.cancelMouseDrag();
  };

  private readonly onWindowTouchMove: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (event.touches.length !== 1) {
      return;
    }

    const t = event.touches[0];

    if (
      this.element !== null &&
      (!isPointOnElement(this.element, t.clientX, t.clientY) ||
        !isPointOnWindow(this.window, t.clientX, t.clientY))
    ) {
      this.cancelTouchDrag();
      return;
    }

    if (this.grabbedNodeId !== null && this.previousTouchCoords !== null) {
      const dx = t.clientX - this.previousTouchCoords.x;
      const dy = t.clientY - this.previousTouchCoords.y;

      this.dragNode(this.grabbedNodeId, dx, dy);
      this.previousTouchCoords = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  };

  private readonly onWindowTouchFinish: (event: TouchEvent) => void = () => {
    this.previousTouchCoords = null;
    this.cancelTouchDrag();
  };

  private previousTouchCoords: Point | null = null;

  private readonly window = window;

  private readonly options: Options;

  public constructor(
    private readonly canvas: Canvas,
    dragOptions?: DragOptions,
  ) {
    this.viewport = this.canvas.viewport;
    this.graph = this.canvas.graph;

    this.options = createOptions(dragOptions ?? {});
  }

  public attach(element: HTMLElement): Canvas {
    this.detach();
    this.element = element;

    this.canvas.attach(this.element);

    return this;
  }

  public detach(): Canvas {
    this.canvas.detach();

    if (this.element !== null) {
      this.element = null;
    }

    return this;
  }

  public addNode(request: AddNodeRequest): Canvas {
    const nodeId = this.nodeIdGenerator.create(request.id);

    this.canvas.addNode({ ...request, id: nodeId });

    this.updateMaxNodePriority(nodeId);

    const onMouseDown: (event: MouseEvent) => void = (event: MouseEvent) => {
      if (
        this.element === null ||
        !this.options.mouseDownEventVerifier(event)
      ) {
        return;
      }

      const node = this.graph.getNode(nodeId)!;

      const isDragAllowed = this.options.onBeforeNodeDrag({
        nodeId,
        element: request.element,
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

    const onTouchStart: (event: TouchEvent) => void = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        return;
      }

      event.stopImmediatePropagation();

      this.previousTouchCoords = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };

      const node = this.graph.getNode(nodeId)!;

      const isDragAllowed = this.options.onBeforeNodeDrag({
        nodeId,
        element: request.element,
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

    this.nodes.set(nodeId, {
      element: request.element,
      onMouseDown,
      onTouchStart,
    });

    request.element.addEventListener("mousedown", onMouseDown);
    request.element.addEventListener("touchstart", onTouchStart);

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): Canvas {
    this.canvas.updateNode(nodeId, request);

    this.updateMaxNodePriority(nodeId);

    return this;
  }

  public removeNode(nodeId: unknown): Canvas {
    const node = this.nodes.get(nodeId);

    if (node !== undefined) {
      node.element.removeEventListener("mousedown", node.onMouseDown);
      node.element.removeEventListener("touchstart", node.onTouchStart);
    }

    this.nodes.delete(nodeId);
    this.canvas.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): Canvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(portId: string, request?: UpdatePortRequest): Canvas {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): Canvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): Canvas {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): Canvas {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): Canvas {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): Canvas {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): Canvas {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): Canvas {
    this.canvas.clear();

    this.nodes.forEach((value) => {
      value.element.removeEventListener("mousedown", value.onMouseDown);
      value.element.removeEventListener("touchstart", value.onTouchStart);
    });

    this.nodes.clear();
    this.maxNodePriority = 0;

    return this;
  }

  public destroy(): void {
    this.detach();
    this.clear();

    this.removeMouseDragListeners();
    this.removeTouchDragListeners();

    this.canvas.destroy();
  }

  private dragNode(nodeId: unknown, dx: number, dy: number): void {
    const node = this.graph.getNode(nodeId)!;

    if (node === null) {
      return;
    }

    const contentMatrix = this.canvas.viewport.getContentMatrix();
    const viewportX = contentMatrix.scale * node.x + contentMatrix.x;
    const viewportY = contentMatrix.scale * node.y + contentMatrix.y;

    const newViewportX = viewportX + dx;
    const newViewportY = viewportY + dy;

    const viewportMatrix = this.canvas.viewport.getViewportMatrix();
    const contentX = viewportMatrix.scale * newViewportX + viewportMatrix.x;
    const contentY = viewportMatrix.scale * newViewportY + viewportMatrix.y;
    this.canvas.updateNode(nodeId, { x: contentX, y: contentY });

    this.options.onNodeDrag({
      nodeId,
      element: node.element,
      x: contentX,
      y: contentY,
    });
  }

  private updateMaxNodePriority(nodeId: unknown): void {
    const priority = this.graph.getNode(nodeId)!.priority;

    this.maxNodePriority = Math.max(this.maxNodePriority, priority);
  }

  private moveNodeOnTop(nodeId: unknown): void {
    if (this.options.freezePriority) {
      return;
    }

    this.maxNodePriority += 2;
    this.updateNode(nodeId, { priority: this.maxNodePriority });

    const edgePriority = this.maxNodePriority - 1;

    const edges = this.graph.getNodeAdjacentEdgeIds(nodeId)!;

    edges.forEach((edgeId) => {
      this.updateEdge(edgeId, { priority: edgePriority });
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

    if (this.element !== null) {
      setCursor(this.element, null);
    }

    this.removeMouseDragListeners();
  }

  private removeMouseDragListeners(): void {
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }

  private cancelTouchDrag(): void {
    this.previousTouchCoords = null;
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
}
