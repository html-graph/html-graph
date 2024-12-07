import { IdGenerator } from "@/id-generator";
import {
  AddConnectionRequest,
  AddNodeRequest,
  ApiContentMoveTransform,
  ApiContentScaleTransform,
  ApiPort,
  ApiTransform,
  Canvas,
} from "..";
import { PublicGraphStore } from "@/graph-store";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { ConnectionController } from "@/connections";

export class DraggableNodesCanvas implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly nodes = new Map<
    string,
    {
      el: HTMLElement;
      onMouseDown: (event: MouseEvent) => void;
      onTouchStart: (event: TouchEvent) => void;
    }
  >();

  private grabbedNodeId: string | null = null;

  private readonly nodeIdGenerator = new IdGenerator();

  private element: HTMLElement | null = null;

  private readonly onCanvasMouseUp = () => {
    this.setCursor(null);
    this.grabbedNodeId = null;
  };

  private readonly onCanvasMouseMove = (event: MouseEvent) => {
    if (this.grabbedNodeId !== null) {
      event.stopPropagation();
      this.canvas.dragNode(
        this.grabbedNodeId,
        event.movementX,
        event.movementY,
      );
    }
  };

  private readonly onCanvasTouchStart = (event: TouchEvent) => {
    this.previousTouchCoords = [
      event.touches[0].clientX,
      event.touches[0].clientY,
    ];
  };

  private readonly onCanvasTouchMove = (event: TouchEvent) => {
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

    this.canvas.dragNode(this.grabbedNodeId, dx, dy);
    this.previousTouchCoords = [
      event.touches[0].clientX,
      event.touches[0].clientY,
    ];
  };

  private readonly onCanvasTouchEnd = () => {
    this.previousTouchCoords = null;
    this.grabbedNodeId = null;
  };

  private previousTouchCoords: [number, number] | null = null;

  public constructor(private readonly canvas: Canvas) {
    this.transformation = this.canvas.transformation;

    this.model = this.canvas.model;
  }

  public addNode(node: AddNodeRequest): DraggableNodesCanvas {
    let nodeId = node.id;

    if (nodeId === undefined) {
      do {
        nodeId = this.nodeIdGenerator.next();
      } while (this.nodes.has(nodeId));
    }

    this.canvas.addNode(node);

    const onMouseDown = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      this.grabbedNodeId = nodeId;
      this.setCursor("grab");
      this.canvas.moveNodeOnTop(nodeId);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        return;
      }

      this.grabbedNodeId = nodeId;
      this.canvas.moveNodeOnTop(nodeId);
    };

    this.nodes.set(nodeId, {
      el: node.element,
      onMouseDown,
      onTouchStart,
    });

    node.element.addEventListener("mousedown", onMouseDown);
    node.element.addEventListener("touchstart", onTouchStart);

    return this;
  }

  public removeNode(nodeId: string): DraggableNodesCanvas {
    const node = this.nodes.get(nodeId);

    if (node !== undefined) {
      node.el.removeEventListener("mousedown", node.onMouseDown);
      node.el.removeEventListener("touchstart", node.onTouchStart);
    }

    this.canvas.removeNode(nodeId);
    this.nodes.delete(nodeId);

    return this;
  }

  public markPort(port: ApiPort): DraggableNodesCanvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePortConnections(portId: string): DraggableNodesCanvas {
    this.canvas.updatePortConnections(portId);

    return this;
  }

  public unmarkPort(portId: string): DraggableNodesCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addConnection(connection: AddConnectionRequest): DraggableNodesCanvas {
    this.canvas.addConnection(connection);

    return this;
  }

  public removeConnection(connectionId: string): DraggableNodesCanvas {
    this.canvas.removeConnection(connectionId);

    return this;
  }

  public patchViewportTransform(
    apiTransform: ApiTransform,
  ): DraggableNodesCanvas {
    this.canvas.patchViewportTransform(apiTransform);

    return this;
  }

  public moveContent(
    apiTransform: ApiContentMoveTransform,
  ): DraggableNodesCanvas {
    this.canvas.moveContent(apiTransform);

    return this;
  }

  public scaleContent(
    apiTransform: ApiContentScaleTransform,
  ): DraggableNodesCanvas {
    this.canvas.scaleContent(apiTransform);

    return this;
  }

  public moveToNodes(nodeIds: readonly string[]): DraggableNodesCanvas {
    this.canvas.moveToNodes(nodeIds);

    return this;
  }

  public updateNodeCoords(
    nodeId: string,
    x: number,
    y: number,
  ): DraggableNodesCanvas {
    this.canvas.updateNodeCoords(nodeId, x, y);

    return this;
  }

  public updateConnectionController(
    connectionId: string,
    controller: ConnectionController,
  ): DraggableNodesCanvas {
    this.canvas.updateConnectionController(connectionId, controller);

    return this;
  }

  public dragNode(
    nodeId: string,
    dx: number,
    dy: number,
  ): DraggableNodesCanvas {
    this.canvas.dragNode(nodeId, dx, dy);

    return this;
  }

  public moveNodeOnTop(nodeId: string): DraggableNodesCanvas {
    this.canvas.moveNodeOnTop(nodeId);

    return this;
  }

  public clear(): DraggableNodesCanvas {
    this.canvas.clear();

    this.nodes.forEach((value) => {
      value.el.removeEventListener("mousedown", value.onMouseDown);
      value.el.removeEventListener("touchstart", value.onTouchStart);
    });

    this.nodes.clear();

    return this;
  }

  public attach(element: HTMLElement): DraggableNodesCanvas {
    this.canvas.attach(element);
    this.element = element;

    element.addEventListener("mouseup", this.onCanvasMouseUp);
    element.addEventListener("mousemove", this.onCanvasMouseMove);
    element.addEventListener("touchstart", this.onCanvasTouchStart);
    element.addEventListener("touchmove", this.onCanvasTouchMove);
    element.addEventListener("touchend", this.onCanvasTouchEnd);
    element.addEventListener("touchcancel", this.onCanvasTouchEnd);

    return this;
  }

  public detach(): DraggableNodesCanvas {
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
      value.el.removeEventListener("mousedown", value.onMouseDown);
      value.el.removeEventListener("touchstart", value.onTouchStart);
    });

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
}
