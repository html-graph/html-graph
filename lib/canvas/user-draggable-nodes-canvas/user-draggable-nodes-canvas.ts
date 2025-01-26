import { IdGenerator } from "@/id-generator";
import {
  AddEdgeRequest,
  AddNodeRequest,
  MarkPortRequest,
  PatchMatrixRequest,
  Canvas,
  UpdateEdgeRequest,
  UpdateNodeRequest,
} from "../canvas";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { DragOptions } from "./drag-options";
import { NodeDragPayload } from "./node-drag-payload";
import { UpdatePortRequest } from "../canvas/update-port-request";
import { AbstractPublicGraphStore } from "@/graph-store";
import { isOnCanvas, isOnWindow, setCursor } from "../utils";
import { HtmlGraphError } from "@/error";

export class UserDraggableNodesCanvas implements Canvas {
  public readonly model: AbstractPublicGraphStore;

  public readonly transformation: PublicViewportTransformer;

  private maxNodePriority = 0;

  private readonly nodes = new Map<
    unknown,
    {
      readonly element: HTMLElement;
      readonly onMouseDown: (event: MouseEvent) => void;
      readonly onTouchStart: (event: TouchEvent) => void;
    }
  >();

  private grabbedNodeId: unknown | null = null;

  private onNodeDrag: (payload: NodeDragPayload) => void;

  private onBeforeNodeDrag: (payload: NodeDragPayload) => boolean;

  private readonly nodeIdGenerator = new IdGenerator((nodeId) =>
    this.nodes.has(nodeId),
  );

  private element: HTMLElement | null = null;

  private readonly onCanvasMouseUp: () => void = () => {
    this.cancelMouseDrag();
  };

  private readonly onCanvasMouseMove: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (
      this.element !== null &&
      (!isOnCanvas(this.element, event.clientX, event.clientY) ||
        !isOnWindow(this.window, event.clientX, event.clientY))
    ) {
      this.cancelMouseDrag();
      return;
    }

    if (this.grabbedNodeId !== null) {
      this.dragNode(this.grabbedNodeId, event.movementX, event.movementY);
    }
  };

  private readonly onCanvasTouchStart: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    this.previousTouchCoords = [
      event.touches[0].clientX,
      event.touches[0].clientY,
    ];
  };

  private readonly onCanvasTouchMove: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (event.touches.length === 1) {
      const t = event.touches[0];

      if (
        this.element !== null &&
        (!isOnCanvas(this.element, t.clientX, t.clientY) ||
          !isOnWindow(this.window, t.clientX, t.clientY))
      ) {
        this.cancelTouchDrag();
        return;
      }

      if (this.grabbedNodeId !== null && this.previousTouchCoords !== null) {
        event.stopImmediatePropagation();
        const dx = t.clientX - this.previousTouchCoords[0];
        const dy = t.clientY - this.previousTouchCoords[1];

        this.dragNode(this.grabbedNodeId, dx, dy);
        this.previousTouchCoords = [
          event.touches[0].clientX,
          event.touches[0].clientY,
        ];
      }
    }
  };

  private readonly onCanvasTouchEnd: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (event.touches.length > 0) {
      this.previousTouchCoords = [
        event.touches[0].clientX,
        event.touches[0].clientY,
      ];
    } else {
      this.cancelTouchDrag();
    }
  };

  private previousTouchCoords: [number, number] | null = null;

  private readonly freezePriority: boolean;

  private readonly window = window;

  private readonly dragCursor: string | null;

  public constructor(
    private readonly canvas: Canvas,
    dragOptions?: DragOptions,
  ) {
    this.transformation = this.canvas.transformation;
    this.model = this.canvas.model;

    const onNodeDragDefault: (payload: NodeDragPayload) => void = () => {
      // no implementation by default
    };

    this.onNodeDrag = dragOptions?.events?.onNodeDrag ?? onNodeDragDefault;

    const onBeforeNodeDragDefault: (
      payload: NodeDragPayload,
    ) => boolean = () => {
      return true;
    };

    this.onBeforeNodeDrag =
      dragOptions?.events?.onBeforeNodeDrag ?? onBeforeNodeDragDefault;

    this.freezePriority = dragOptions?.grabPriorityStrategy === "freeze";

    this.dragCursor =
      dragOptions?.dragCursor !== undefined ? dragOptions.dragCursor : "grab";
  }

  public addNode(request: AddNodeRequest): UserDraggableNodesCanvas {
    const nodeId = this.nodeIdGenerator.create(request.id);

    this.canvas.addNode({ ...request, id: nodeId });

    this.updateMaxNodePriority(nodeId);

    const onMouseDown: (event: MouseEvent) => void = (event: MouseEvent) => {
      if (this.element === null) {
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
      this.window.addEventListener("mouseup", this.onCanvasMouseUp);
      this.window.addEventListener("mousemove", this.onCanvasMouseMove);
    };

    const onTouchStart: (event: TouchEvent) => void = (event: TouchEvent) => {
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
      this.window.addEventListener("touchmove", this.onCanvasTouchMove);
      this.window.addEventListener("touchend", this.onCanvasTouchEnd);
      this.window.addEventListener("touchcancel", this.onCanvasTouchEnd);
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
    request: UpdateNodeRequest,
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

    this.canvas.removeNode(nodeId);
    this.nodes.delete(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): UserDraggableNodesCanvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(
    portId: string,
    request?: UpdatePortRequest,
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
    request: UpdateEdgeRequest,
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

  public attach(element: HTMLElement): UserDraggableNodesCanvas {
    this.detach();
    this.element = element;

    this.element.addEventListener("touchstart", this.onCanvasTouchStart);
    this.canvas.attach(this.element);

    return this;
  }

  public detach(): UserDraggableNodesCanvas {
    this.canvas.detach();

    if (this.element !== null) {
      this.element.removeEventListener("touchstart", this.onCanvasTouchStart);
      this.element = null;
    }

    return this;
  }

  public destroy(): void {
    this.detach();

    this.removeMouseDragListeners();
    this.removeTouchDragListeners();

    this.nodes.forEach((value) => {
      value.element.removeEventListener("mousedown", value.onMouseDown);
      value.element.removeEventListener("touchstart", value.onTouchStart);
    });

    this.nodes.clear();

    this.canvas.destroy();
  }

  private dragNode(nodeId: unknown, dx: number, dy: number): void {
    const node = this.model.getNode(nodeId);

    if (node === null) {
      throw new HtmlGraphError("failed to drag nonexisting node");
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
    this.window.removeEventListener("mouseup", this.onCanvasMouseUp);
    this.window.removeEventListener("mousemove", this.onCanvasMouseMove);
  }

  private cancelTouchDrag(): void {
    this.previousTouchCoords = null;
    this.grabbedNodeId = null;
    this.removeTouchDragListeners();
  }

  private removeTouchDragListeners(): void {
    this.window.removeEventListener("touchmove", this.onCanvasTouchMove);
    this.window.removeEventListener("touchend", this.onCanvasTouchEnd);
    this.window.removeEventListener("touchcancel", this.onCanvasTouchEnd);
  }
}
