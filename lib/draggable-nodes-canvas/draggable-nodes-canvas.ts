import { IdGenerator } from "../components/id-generator/id-generator";
import { ApiConnection } from "../models/connection/api-connection";
import { ApiUpdateConnection } from "../models/connection/api-update-connection";
import { ApiNode } from "../models/nodes/api-node";
import { ApiPort } from "../models/port/api-port";
import { ApiContentMoveTransform } from "../models/transform/api-content-move-transform";
import { ApiContentScaleTransform } from "../models/transform/api-content-scale-transform";
import { ApiTransform } from "../models/transform/api-transform";
import { Canvas } from "../canvas/canvas";

export class DraggableNodesCanvas implements Canvas {
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

  constructor(private readonly canvas: Canvas) {}

  addNode(node: ApiNode): Canvas {
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

  removeNode(nodeId: string): Canvas {
    const node = this.nodes.get(nodeId);

    if (node !== undefined) {
      node.el.removeEventListener("mousedown", node.onMouseDown);
      node.el.removeEventListener("touchstart", node.onTouchStart);
    }

    this.canvas.removeNode(nodeId);
    this.nodes.delete(nodeId);

    return this;
  }

  markPort(port: ApiPort): Canvas {
    this.canvas.markPort(port);

    return this;
  }

  updatePortConnections(portId: string): Canvas {
    this.canvas.updatePortConnections(portId);

    return this;
  }

  unmarkPort(portId: string): Canvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  addConnection(connection: ApiConnection): Canvas {
    this.canvas.addConnection(connection);

    return this;
  }

  removeConnection(connectionId: string): Canvas {
    this.canvas.removeConnection(connectionId);

    return this;
  }

  patchViewportTransform(apiTransform: ApiTransform): Canvas {
    this.canvas.patchViewportTransform(apiTransform);

    return this;
  }

  moveContent(apiTransform: ApiContentMoveTransform): Canvas {
    this.canvas.moveContent(apiTransform);

    return this;
  }

  scaleContent(apiTransform: ApiContentScaleTransform): Canvas {
    this.canvas.scaleContent(apiTransform);

    return this;
  }

  moveToNodes(nodeIds: readonly string[]): Canvas {
    this.canvas.moveToNodes(nodeIds);

    return this;
  }

  updateNodeCoords(nodeId: string, x: number, y: number): Canvas {
    this.canvas.updateNodeCoords(nodeId, x, y);

    return this;
  }

  updateConnectionOptions(
    connectionId: string,
    options: ApiUpdateConnection,
  ): Canvas {
    this.canvas.updateConnectionOptions(connectionId, options);

    return this;
  }

  dragNode(nodeId: string, dx: number, dy: number): Canvas {
    this.canvas.dragNode(nodeId, dx, dy);

    return this;
  }

  moveNodeOnTop(nodeId: string): Canvas {
    this.canvas.moveNodeOnTop(nodeId);

    return this;
  }

  clear(): Canvas {
    this.canvas.clear();

    this.nodes.forEach((value) => {
      value.el.removeEventListener("mousedown", value.onMouseDown);
      value.el.removeEventListener("touchstart", value.onTouchStart);
    });

    return this;
  }

  attach(element: HTMLElement): Canvas {
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

  detach(): Canvas {
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

  destroy(): void {
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
