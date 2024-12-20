import { IdGenerator } from "@/id-generator";
import {
  AddConnectionRequest,
  AddNodeRequest,
  MarkPortRequest,
  PatchViewportRequest,
  Canvas,
  UpdateConnectionRequest,
} from "../canvas";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { DragOptions } from "./drag-options";
import { NodeDragPayload } from "./node-drag-payload";

export class UserDraggableNodesCanvas implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  private readonly nodes = new Map<
    string,
    {
      readonly element: HTMLElement;
      readonly onMouseDown: (event: MouseEvent) => void;
      readonly onTouchStart: (event: TouchEvent) => void;
      x: number;
      y: number;
    }
  >();

  private grabbedNodeId: string | null = null;

  private onNodeDrag: (payload: NodeDragPayload) => void;

  private onBeforeNodeDrag: (payload: NodeDragPayload) => boolean;

  private readonly nodeIdGenerator = new IdGenerator();

  private element: HTMLElement | null = null;

  private readonly onCanvasMouseUp: () => void = () => {
    this.setCursor(null);
    this.grabbedNodeId = null;
  };

  private readonly onCanvasMouseMove: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (this.grabbedNodeId !== null) {
      event.stopPropagation();
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
    if (
      this.grabbedNodeId === null ||
      event.touches.length !== 1 ||
      this.previousTouchCoords === null
    ) {
      return;
    }

    event.stopImmediatePropagation();

    const [dx, dy] = [
      event.touches[0].clientX - this.previousTouchCoords[0],
      event.touches[0].clientY - this.previousTouchCoords[1],
    ];

    this.dragNode(this.grabbedNodeId, dx, dy);
    this.previousTouchCoords = [
      event.touches[0].clientX,
      event.touches[0].clientY,
    ];
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
      this.previousTouchCoords = null;
      this.grabbedNodeId = null;
    }
  };

  private previousTouchCoords: [number, number] | null = null;

  public constructor(
    private readonly canvas: Canvas,
    dragOptions?: DragOptions,
  ) {
    this.transformation = this.canvas.transformation;

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
  }

  public addNode(node: AddNodeRequest): UserDraggableNodesCanvas {
    let nodeId = node.id;

    if (nodeId === undefined) {
      do {
        nodeId = this.nodeIdGenerator.next();
      } while (this.nodes.has(nodeId));
    }

    this.canvas.addNode(node);

    const onMouseDown: (event: MouseEvent) => void = (event: MouseEvent) => {
      const isDragAllowed = this.onBeforeNodeDrag({
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
      this.setCursor("grab");
      this.canvas.moveNodeOnTop(nodeId);
    };

    const onTouchStart: (event: TouchEvent) => void = (event: TouchEvent) => {
      const isDragAllowed = this.onBeforeNodeDrag({
        nodeId,
        element: node.element,
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
      this.canvas.moveNodeOnTop(nodeId);
    };

    this.nodes.set(nodeId, {
      element: node.element,
      onMouseDown,
      onTouchStart,
      x: node.x,
      y: node.y,
    });

    node.element.addEventListener("mousedown", onMouseDown);
    node.element.addEventListener("touchstart", onTouchStart);

    return this;
  }

  public removeNode(nodeId: string): UserDraggableNodesCanvas {
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

  public updatePortConnections(portId: string): UserDraggableNodesCanvas {
    this.canvas.updatePortConnections(portId);

    return this;
  }

  public unmarkPort(portId: string): UserDraggableNodesCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addConnection(
    connection: AddConnectionRequest,
  ): UserDraggableNodesCanvas {
    this.canvas.addConnection(connection);

    return this;
  }

  public removeConnection(connectionId: string): UserDraggableNodesCanvas {
    this.canvas.removeConnection(connectionId);

    return this;
  }

  public patchViewportState(
    request: PatchViewportRequest,
  ): UserDraggableNodesCanvas {
    this.canvas.patchViewportState(request);

    return this;
  }

  public moveToNodes(nodeIds: readonly string[]): UserDraggableNodesCanvas {
    this.canvas.moveToNodes(nodeIds);

    return this;
  }

  public updateNodeCoordinates(
    nodeId: string,
    x: number,
    y: number,
  ): UserDraggableNodesCanvas {
    this.canvas.updateNodeCoordinates(nodeId, x, y);

    return this;
  }

  public updateConnection(
    connectionId: string,
    request: UpdateConnectionRequest,
  ): UserDraggableNodesCanvas {
    this.canvas.updateConnection(connectionId, request);

    return this;
  }

  public moveNodeOnTop(nodeId: string): UserDraggableNodesCanvas {
    this.canvas.moveNodeOnTop(nodeId);

    return this;
  }

  public clear(): UserDraggableNodesCanvas {
    this.canvas.clear();

    this.nodes.forEach((value) => {
      value.element.removeEventListener("mousedown", value.onMouseDown);
      value.element.removeEventListener("touchstart", value.onTouchStart);
    });

    this.nodes.clear();

    return this;
  }

  public attach(element: HTMLElement): UserDraggableNodesCanvas {
    this.detach();
    this.element = element;

    this.canvas.attach(this.element);
    this.element.addEventListener("mouseup", this.onCanvasMouseUp);
    this.element.addEventListener("mousemove", this.onCanvasMouseMove);
    this.element.addEventListener("touchstart", this.onCanvasTouchStart);
    this.element.addEventListener("touchmove", this.onCanvasTouchMove);
    this.element.addEventListener("touchend", this.onCanvasTouchEnd);
    this.element.addEventListener("touchcancel", this.onCanvasTouchEnd);

    return this;
  }

  public detach(): UserDraggableNodesCanvas {
    this.canvas.detach();

    if (this.element !== null) {
      this.element.removeEventListener("mouseup", this.onCanvasMouseUp);
      this.element.removeEventListener("mousemove", this.onCanvasMouseMove);
      this.element.removeEventListener("touchstart", this.onCanvasTouchStart);
      this.element.removeEventListener("touchmove", this.onCanvasTouchMove);
      this.element.removeEventListener("touchend", this.onCanvasTouchEnd);
      this.element.removeEventListener("touchcancel", this.onCanvasTouchEnd);

      this.element = null;
    }

    return this;
  }

  public destroy(): void {
    this.detach();

    this.nodes.forEach((value) => {
      value.element.removeEventListener("mousedown", value.onMouseDown);
      value.element.removeEventListener("touchstart", value.onTouchStart);
    });

    this.nodes.clear();

    this.canvas.destroy();
  }

  private setCursor(type: string | null): void {
    if (this.element === null) {
      return;
    }

    if (type !== null) {
      this.element.style.cursor = type;
    } else {
      this.element.style.removeProperty("cursor");
    }
  }

  private dragNode(nodeId: string, dx: number, dy: number): void {
    const node = this.nodes.get(nodeId);

    if (node === undefined) {
      throw new Error("failed to drag nonexisting node");
    }

    const [xv, yv] = this.transformation.getViewCoords(node.x, node.y);

    const nodeX = xv + dx;
    const nodeY = yv + dy;

    const [xa, ya] = this.transformation.getAbsCoords(nodeX, nodeY);
    node.x = xa;
    node.y = ya;

    this.canvas.updateNodeCoordinates(nodeId, xa, ya);

    this.onNodeDrag({
      nodeId,
      element: node.element,
      x: node.x,
      y: node.y,
    });
  }
}
