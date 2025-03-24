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
import { CanvasController } from "../canvas-controller";
import { UpdatePortRequest } from "../update-port-request";
import { NodeState } from "./node-state";
import { Point } from "@/point";
import { createOptions, Options } from "./create-options";

export class UserDraggableNodesCanvasController implements CanvasController {
  public readonly graph: Graph;

  public readonly viewport: Viewport;

  private maxNodePriority = 0;

  private readonly nodes = new Map<unknown, NodeState>();

  private grabbedNodeId: unknown | null = null;

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
    private readonly canvas: CanvasController,
    dragOptions?: DragOptions,
  ) {
    this.viewport = this.canvas.viewport;
    this.graph = this.canvas.graph;

    this.options = createOptions(dragOptions ?? {});
  }

  public attach(element: HTMLElement): void {
    this.detach();
    this.element = element;

    this.canvas.attach(this.element);
  }

  public detach(): void {
    this.canvas.detach();

    if (this.element !== null) {
      this.element = null;
    }
  }

  public addNode(request: AddNodeRequest): void {
    this.canvas.addNode(request);

    this.updateMaxNodePriority(request.id);

    const onMouseDown: (event: MouseEvent) => void = (event: MouseEvent) => {
      if (
        this.element === null ||
        !this.options.mouseDownEventVerifier(event)
      ) {
        return;
      }

      const node = this.graph.getNode(request.id)!;

      const isDragAllowed = this.options.onBeforeNodeDrag({
        nodeId: request.id,
        element: request.element,
        x: node.x,
        y: node.y,
      });

      if (!isDragAllowed) {
        return;
      }

      event.stopImmediatePropagation();
      this.grabbedNodeId = request.id;
      setCursor(this.element, this.options.dragCursor);
      this.moveNodeOnTop(request.id);
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

      const node = this.graph.getNode(request.id)!;

      const isDragAllowed = this.options.onBeforeNodeDrag({
        nodeId: request.id,
        element: request.element,
        x: node.x,
        y: node.y,
      });

      if (!isDragAllowed) {
        return;
      }

      this.grabbedNodeId = request.id;
      this.moveNodeOnTop(request.id);
      this.window.addEventListener("touchmove", this.onWindowTouchMove);
      this.window.addEventListener("touchend", this.onWindowTouchFinish);
      this.window.addEventListener("touchcancel", this.onWindowTouchFinish);
    };

    this.nodes.set(request.id, {
      element: request.element,
      onMouseDown,
      onTouchStart,
    });

    request.element.addEventListener("mousedown", onMouseDown);
    request.element.addEventListener("touchstart", onTouchStart);
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): void {
    this.canvas.updateNode(nodeId, request);

    this.updateMaxNodePriority(nodeId);
  }

  public removeNode(nodeId: unknown): void {
    const node = this.nodes.get(nodeId);

    if (node !== undefined) {
      node.element.removeEventListener("mousedown", node.onMouseDown);
      node.element.removeEventListener("touchstart", node.onTouchStart);
    }

    this.nodes.delete(nodeId);
    this.canvas.removeNode(nodeId);
  }

  public markPort(port: MarkPortRequest): void {
    this.canvas.markPort(port);
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    this.canvas.updatePort(portId, request);
  }

  public unmarkPort(portId: unknown): void {
    this.canvas.unmarkPort(portId);
  }

  public addEdge(edge: AddEdgeRequest): void {
    this.canvas.addEdge(edge);
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void {
    this.canvas.updateEdge(edgeId, request);
  }

  public removeEdge(edgeId: unknown): void {
    this.canvas.removeEdge(edgeId);
  }

  public patchViewportMatrix(request: PatchMatrixRequest): void {
    this.canvas.patchViewportMatrix(request);
  }

  public patchContentMatrix(request: PatchMatrixRequest): void {
    this.canvas.patchContentMatrix(request);
  }

  public clear(): void {
    this.canvas.clear();

    this.nodes.forEach((value) => {
      value.element.removeEventListener("mousedown", value.onMouseDown);
      value.element.removeEventListener("touchstart", value.onTouchStart);
    });

    this.nodes.clear();
    this.maxNodePriority = 0;
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
