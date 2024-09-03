import { CenterFn } from "../../models/center/center-fn";
import { ApiPortsPayload } from "../../models/nodes/api-ports-payload";
import { ConnectionOptions } from "../../models/options/connection-options";
import { resolveConnectionController } from "../../utils/resolve-connection-controller/resolve-connection-controller";
import { DiContainer } from "../di-container/di-container";

export class Controller {
  constructor(private readonly di: DiContainer) {}

  grabViewport(): void {
    if (this.di.options.shift.enabled === false) {
      return;
    }

    this.di.htmlController.setCursor("grab");
  }

  grabNode(nodeId: string): void {
    if (this.di.options.nodes.draggable === false) {
      return;
    }

    this.di.htmlController.setCursor("grab");

    // need to handle events for interactive elements inside node before reattaching node
    // so that events would work
    setTimeout(() => {
      this.di.htmlController.moveNodeOnTop(nodeId);
    });
  }

  dragViewport(dx: number, dy: number): void {
    this.di.viewportTransformer.applyShift(-dx, -dy);
    this.di.htmlController.applyTransform();
  }

  dragNode(nodeId: string, dx: number, dy: number): void {
    const node = this.di.graphStore.getNode(nodeId);

    const [xv, yv] = this.di.viewportTransformer.getViewportCoords(
      node.x,
      node.y,
    );

    const nodeX = xv + dx;
    const nodeY = yv + dy;

    const [xa, ya] = this.di.viewportTransformer.getAbsoluteCoords(
      nodeX,
      nodeY,
    );

    this.di.graphStore.updateNodeCoords(nodeId, xa, ya);
    this.di.htmlController.updateNodePosition(nodeId);
  }

  release(): void {
    this.di.htmlController.setCursor("default");
  }

  scaleCanvas(deltaY: number, centerX: number, centerY: number): void {
    const scaleVelocity = this.di.options.scale.velocity;
    const velocity = deltaY < 0 ? scaleVelocity : 1 / scaleVelocity;
    const viewportVelocity = 1 / velocity;

    this.di.viewportTransformer.applyScale(viewportVelocity, centerX, centerY);

    this.di.htmlController.applyTransform();
  }

  addNode(
    nodeId: string | undefined,
    element: HTMLElement,
    x: number,
    y: number,
    ports: Record<string, ApiPortsPayload> | undefined,
    centerFn: CenterFn | undefined,
  ): void {
    if (nodeId === undefined) {
      do {
        nodeId = this.di.nodeIdGenerator.generateNextId();
      } while (this.di.graphStore.hasNode(nodeId));
    }

    if (this.di.graphStore.hasNode(nodeId)) {
      throw new Error("failed to add node with existing id");
    }

    this.di.graphStore.addNode(
      nodeId,
      element,
      x,
      y,
      centerFn ?? this.di.options.nodes.centerFn,
    );
    this.di.htmlController.attachNode(nodeId);

    if (ports !== undefined) {
      Object.entries(ports).forEach(([portId, element]) => {
        if (element instanceof HTMLElement) {
          this.di.controller.markPort(
            portId,
            element,
            nodeId,
            this.di.options.ports.centerFn,
          );
        } else {
          this.di.controller.markPort(
            portId,
            element.element,
            nodeId,
            element.centerFn ?? this.di.options.ports.centerFn,
          );
        }
      });
    }
  }

  markPort(
    portId: string | undefined,
    element: HTMLElement,
    nodeId: string,
    centerFn: CenterFn | undefined,
  ): void {
    if (portId === undefined) {
      do {
        portId = this.di.portIdGenerator.generateNextId();
      } while (this.di.graphStore.hasPort(portId));
    }

    if (!this.di.graphStore.hasNode(nodeId)) {
      throw new Error("failed to set port on nonexisting node");
    }

    if (this.di.graphStore.hasPort(portId)) {
      throw new Error("failed to add port with existing id");
    }

    this.di.graphStore.addPort(
      portId,
      element,
      nodeId,
      centerFn ?? this.di.options.ports.centerFn,
    );
  }

  unmarkPort(portId: string): void {
    if (!this.di.graphStore.hasPort(portId)) {
      throw new Error("failed to unset nonexisting port");
    }

    this.di.graphStore
      .getAllAdjacentToPortConnections(portId)
      .forEach((connectionId) => {
        this.removeConnection(connectionId);
      });

    this.di.graphStore.removePort(portId);
  }

  addConnection(
    connectionId: string | undefined,
    fromPortId: string,
    toPortId: string,
    options: ConnectionOptions | undefined,
  ): void {
    if (connectionId === undefined) {
      do {
        connectionId = this.di.connectionIdGenerator.generateNextId();
      } while (this.di.graphStore.hasPort(connectionId));
    }
    if (!this.di.graphStore.hasPort(fromPortId)) {
      throw new Error("failed to add connection from nonexisting port");
    }

    if (!this.di.graphStore.hasPort(toPortId)) {
      throw new Error("failed to add connection to nonexisting port");
    }

    const controller =
      options !== undefined
        ? resolveConnectionController(options)
        : this.di.options.connections.controller;

    this.di.graphStore.addConnection(
      connectionId,
      fromPortId,
      toPortId,
      controller,
    );

    this.di.htmlController.attachConnection(connectionId);
  }

  removeConnection(connectionId: string): void {
    this.di.htmlController.detachConnection(connectionId);
    this.di.graphStore.removeConnection(connectionId);
  }

  removeNode(nodeId: string): void {
    if (!this.di.graphStore.hasNode(nodeId)) {
      throw new Error("failed to remove nonexisting node");
    }

    this.di.htmlController.detachNode(nodeId);
    this.di.graphStore.removeNode(nodeId);
  }

  clear(): void {
    this.di.htmlController.clear();
    this.di.graphStore.clear();
    this.di.nodeIdGenerator.reset();
    this.di.portIdGenerator.reset();
    this.di.connectionIdGenerator.reset();
  }

  destroy(): void {
    this.di.htmlController.destroy();
  }
}
