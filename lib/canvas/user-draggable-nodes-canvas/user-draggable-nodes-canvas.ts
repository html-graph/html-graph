import { IdGenerator } from "@/id-generator";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { PatchMatrixRequest } from "../patch-transform-request";
import { DragOptions } from "./drag-options";
import { NodeDragPayload } from "./node-drag-payload";
import { isPointOnElement, isPointOnWindow, setCursor } from "../utils";
import { PublicGraphStore } from "@/graph-store";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { UpdatePortMarkRequest } from "../update-port-mark-request";
import { NodeState } from "./node-state";
import { Point } from "@/point";

export class UserDraggableNodesCanvas implements Canvas {
  public readonly model: PublicGraphStore;

  public readonly transformation: PublicViewportTransformer;

  private maxNodePriority = 0;

  private readonly nodes = new Map<unknown, NodeState>();

  private grabbedNodeId: unknown | null = null;

  private onNodeDrag: (payload: NodeDragPayload) => void;

  private onBeforeNodeDrag: (payload: NodeDragPayload) => boolean;

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
    if (event.button !== 0) {
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

  private readonly onWindowTouchFinish: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (event.touches.length > 0) {
      this.previousTouchCoords = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else {
      this.cancelTouchDrag();
    }
  };

  private previousTouchCoords: Point | null = null;

  private readonly freezePriority: boolean;

  private readonly window = window;

  private readonly dragCursor: string | null;

  public constructor(
    private readonly canvas: Canvas,
    dragOptions?: DragOptions,
  ) {
    this.transformation = this.canvas.transformation;
    this.model = this.canvas.model;

    this.onNodeDrag = dragOptions?.events?.onNodeDrag ?? ((): void => {});

    this.onBeforeNodeDrag =
      dragOptions?.events?.onBeforeNodeDrag ?? ((): boolean => true);

    this.freezePriority = dragOptions?.moveOnTop === false;

    this.dragCursor =
      dragOptions?.dragCursor !== undefined ? dragOptions.dragCursor : "grab";
  }

  public attach(element: HTMLElement): UserDraggableNodesCanvas {
    this.detach();
    this.element = element;

    this.canvas.attach(this.element);

    return this;
  }

  public detach(): UserDraggableNodesCanvas {
    this.canvas.detach();

    if (this.element !== null) {
      this.element = null;
    }

    return this;
  }

  public addNode(request: AddNodeRequest): UserDraggableNodesCanvas {
    const nodeId = this.nodeIdGenerator.create(request.id);

    this.canvas.addNode({ ...request, id: nodeId });

    this.updateMaxNodePriority(nodeId);

    const onMouseDown: (event: MouseEvent) => void = (event: MouseEvent) => {
      if (this.element === null || event.button !== 0) {
        return;
      }

      const node = this.model.getNode(nodeId)!;

      const isDragAllowed = this.onBeforeNodeDrag({
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
      setCursor(this.element, this.dragCursor);
      this.moveNodeOnTop(nodeId);
      this.window.addEventListener("mouseup", this.onWindowMouseUp);
      this.window.addEventListener("mousemove", this.onWindowMouseMove);
    };

    const onTouchStart: (event: TouchEvent) => void = (event: TouchEvent) => {
      event.stopImmediatePropagation();

      this.previousTouchCoords = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };

      const node = this.model.getNode(nodeId)!;

      const isDragAllowed = this.onBeforeNodeDrag({
        nodeId,
        element: request.element,
        x: node.x,
        y: node.y,
      });

      if (!isDragAllowed) {
        return;
      }

      if (event.touches.length !== 1) {
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

  public updateNode(
    nodeId: unknown,
    request?: UpdateNodeRequest,
  ): UserDraggableNodesCanvas {
    this.canvas.updateNode(nodeId, request);

    this.updateMaxNodePriority(nodeId);

    return this;
  }

  public removeNode(nodeId: unknown): UserDraggableNodesCanvas {
    const node = this.nodes.get(nodeId);

    if (node !== undefined) {
      node.element.removeEventListener("mousedown", node.onMouseDown);
      node.element.removeEventListener("touchstart", node.onTouchStart);
    }

    this.nodes.delete(nodeId);
    this.canvas.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): UserDraggableNodesCanvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(
    portId: string,
    request?: UpdatePortMarkRequest,
  ): UserDraggableNodesCanvas {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): UserDraggableNodesCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): UserDraggableNodesCanvas {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(
    edgeId: unknown,
    request?: UpdateEdgeRequest,
  ): UserDraggableNodesCanvas {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): UserDraggableNodesCanvas {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(
    request: PatchMatrixRequest,
  ): UserDraggableNodesCanvas {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(
    request: PatchMatrixRequest,
  ): UserDraggableNodesCanvas {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): UserDraggableNodesCanvas {
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
    const node = this.model.getNode(nodeId)!;

    if (node === null) {
      return;
    }

    const matrixContent = this.canvas.transformation.getContentMatrix();
    const viewportX = matrixContent.scale * node.x + matrixContent.dx;
    const viewportY = matrixContent.scale * node.y + matrixContent.dy;

    const newViewportX = viewportX + dx;
    const newViewportY = viewportY + dy;

    const matrixViewport = this.canvas.transformation.getViewportMatrix();
    const contentX = matrixViewport.scale * newViewportX + matrixViewport.dx;
    const contentY = matrixViewport.scale * newViewportY + matrixViewport.dy;
    this.canvas.updateNode(nodeId, { x: contentX, y: contentY });

    this.onNodeDrag({
      nodeId,
      element: node.element,
      x: node.x,
      y: node.y,
    });
  }

  private updateMaxNodePriority(nodeId: unknown): void {
    const priority = this.model.getNode(nodeId)!.priority;

    this.maxNodePriority = Math.max(this.maxNodePriority, priority);
  }

  private moveNodeOnTop(nodeId: unknown): void {
    if (this.freezePriority) {
      return;
    }

    this.maxNodePriority += 2;
    this.updateNode(nodeId, { priority: this.maxNodePriority });

    const edgePriority = this.maxNodePriority - 1;

    const edges = this.model.getNodeAdjacentEdgeIds(nodeId);

    edges.forEach((edgeId) => {
      this.updateEdge(edgeId, { priority: edgePriority });
    });
  }

  private cancelMouseDrag(): void {
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
    this.grabbedNodeId = null;
    this.removeTouchDragListeners();
  }

  private removeTouchDragListeners(): void {
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }
}
