import { CenterFn } from "../../models/center/center-fn";
import { ConnectionController } from "../../models/connection/connection-controller";
import { GraphEventType } from "../../models/events/graph-event-type";
import { ApiPortsPayload } from "../../models/nodes/api-ports-payload";
import { ConnectionOptions } from "../../models/options/connection-options";
import { resolveConnectionControllerFactory } from "../../utils/resolve-connection-controller-factory/resolve-connection-controller-factory";
import { DiContainer } from "../di-container/di-container";

export class Controller {
  constructor(private readonly di: DiContainer) {
    this.di.eventSubject.on(GraphEventType.GrabViewport, () => {
      this.setGrabCursor();
    });

    this.di.eventSubject.on(GraphEventType.DragViewport, (payload) => {
      this.dragViewport(payload.dx, payload.dy);
    });

    this.di.eventSubject.on(GraphEventType.ScaleViewport, (payload) => {
      this.scaleCanvas(payload.deltaY, payload.centerX, payload.centerY);
    });

    this.di.eventSubject.on(GraphEventType.SetViewportScale, (payload) => {
      this.scaleContent(payload.scale, payload.centerX, payload.centerY);
    });

    this.di.eventSubject.on(GraphEventType.GrabNode, (payload) => {
      this.grabNode(payload.nodeId);
    });

    this.di.eventSubject.on(GraphEventType.DragNode, (payload) => {
      this.dragNode(payload.nodeId, payload.dx, payload.dy);
    });

    this.di.eventSubject.on(GraphEventType.ReleaseViewport, () => {
      this.unsetGrabCursor();
    });

    this.di.eventSubject.on(GraphEventType.ReleaseNode, () => {
      this.unsetGrabCursor();
    });
  }

  setGrabCursor(): void {
    this.di.htmlController.setCursor("grab");
  }

  grabNode(nodeId: string): void {
    this.di.htmlController.setCursor("grab");

    this.di.htmlController.moveNodeOnTop(nodeId);
  }

  dragViewport(dx: number, dy: number): void {
    this.di.viewportTransformer.applyShift(-dx, -dy);
    this.di.htmlController.applyTransform();
  }

  dragNode(nodeId: string, dx: number, dy: number): void {
    if (!this.di.graphStore.hasNode(nodeId)) {
      throw new Error("failed to drag nonexisting node");
    }

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

  unsetGrabCursor(): void {
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
        nodeId = this.di.nodeIdGenerator.next();
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
            null,
          );
        } else {
          this.di.controller.markPort(
            portId,
            element.element,
            nodeId,
            element.centerFn ?? this.di.options.ports.centerFn,
            element.direction ?? null,
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
    dir: number | null | undefined,
  ): void {
    if (portId === undefined) {
      do {
        portId = this.di.portIdGenerator.next();
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
      dir ?? null,
    );
  }

  updatePortConnections(portId: string): void {
    if (!this.di.graphStore.hasPort(portId)) {
      throw new Error("failed to unset nonexisting port");
    }

    this.di.htmlController.updatePortConnections(portId);
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
        connectionId = this.di.connectionIdGenerator.next();
      } while (this.di.graphStore.hasPort(connectionId));
    }
    if (!this.di.graphStore.hasPort(fromPortId)) {
      throw new Error("failed to add connection from nonexisting port");
    }

    if (!this.di.graphStore.hasPort(toPortId)) {
      throw new Error("failed to add connection to nonexisting port");
    }

    const controllerFactory =
      options !== undefined
        ? resolveConnectionControllerFactory(options)
        : this.di.options.connections.controllerFactory;

    this.di.graphStore.addConnection(
      connectionId,
      fromPortId,
      toPortId,
      controllerFactory(),
    );

    this.di.htmlController.attachConnection(connectionId);
  }

  removeConnection(connectionId: string): void {
    if (!this.di.graphStore.hasConnection(connectionId)) {
      throw new Error("failed to remove nonexisting connection");
    }

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

  patchViewportTransform(
    scale: number | null,
    x: number | null,
    y: number | null,
  ): void {
    this.di.viewportTransformer.patchState(scale, x, y);
    this.di.htmlController.applyTransform();
  }

  moveContent(x: number, y: number): void {
    this.di.viewportTransformer.applyShift(-x, -y);
    this.di.htmlController.applyTransform();
  }

  scaleContent(scale: number, cx: number, cy: number): void {
    this.di.viewportTransformer.applyScale(1 / scale, cx, cy);
    this.di.htmlController.applyTransform();
  }

  moveToNodes(nodeIds: readonly string[]): void {
    if (nodeIds.length === 0) {
      return;
    }

    const nodes = nodeIds
      .map((nodeId) => this.di.graphStore.getNode(nodeId))
      .filter((node) => node !== undefined);

    if (nodes.length < nodeIds.length) {
      throw new Error("failed to move to nonexisting node");
    }

    const [x, y] = nodes.reduce(
      (acc, cur) => [acc[0] + cur.x, acc[1] + cur.y],
      [0, 0],
    );

    const avgX = x / nodes.length;
    const avgY = y / nodes.length;
    const [width, height] = this.di.htmlController.getViewportDimensions();
    const sa = this.di.viewportTransformer.getAbsoluteScale();

    const targetX = avgX - (sa * width) / 2;
    const targetY = avgY - (sa * height) / 2;

    this.patchViewportTransform(null, targetX, targetY);
  }

  updateNodeCoords(nodeId: string, x: number, y: number): void {
    if (!this.di.graphStore.hasNode(nodeId)) {
      throw new Error("failed to update coordinates of nonexisting node");
    }

    this.di.graphStore.updateNodeCoords(nodeId, x, y);
    this.di.htmlController.updateNodePosition(nodeId);
  }

  updateConnectionController(
    connectionId: string,
    controller: ConnectionController,
  ): void {
    if (!this.di.graphStore.hasConnection(connectionId)) {
      throw new Error("failed to update nonexisting connection controller");
    }

    this.di.htmlController.detachConnection(connectionId);
    this.di.graphStore.updateConnectionController(connectionId, controller);
    this.di.htmlController.attachConnection(connectionId);
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
