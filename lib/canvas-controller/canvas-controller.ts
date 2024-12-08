import { CenterFn } from "@/center-fn";
import {
  ConnectionController,
  ConnectionControllerFactory,
  ConnectionType,
} from "@/connections";
import { MarkNodePortRequest } from "@/canvas/canvas";
import { GraphStore } from "@/graph-store";
import { HtmlController } from "@/html-controller";
import { ViewportTransformer } from "@/viewport-transformer";
import { IdGenerator } from "@/id-generator";

export class CanvasController {
  private readonly nodeIdGenerator = new IdGenerator();

  private readonly portIdGenerator = new IdGenerator();

  private readonly connectionIdGenerator = new IdGenerator();

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly htmlController: HtmlController,
    private readonly viewportTransformer: ViewportTransformer,
    private readonly nodesCenterFn: CenterFn,
    private readonly portsCenterFn: CenterFn,
  ) {}

  public moveNodeOnTop(nodeId: string): void {
    if (!this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to move on top nonexisting node");
    }

    this.htmlController.moveNodeOnTop(nodeId);
  }

  public dragNode(nodeId: string, dx: number, dy: number): void {
    if (!this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to drag nonexisting node");
    }

    const node = this.graphStore.getNode(nodeId);

    const [xv, yv] = this.viewportTransformer.getViewCoords(node.x, node.y);

    const nodeX = xv + dx;
    const nodeY = yv + dy;

    const [xa, ya] = this.viewportTransformer.getAbsCoords(nodeX, nodeY);

    this.graphStore.updateNodeCoords(nodeId, xa, ya);
    this.htmlController.updateNodePosition(nodeId);
  }

  public addNode(
    nodeId: string | undefined,
    element: HTMLElement,
    x: number,
    y: number,
    ports: Record<string, MarkNodePortRequest> | undefined,
    centerFn: CenterFn | undefined,
  ): void {
    if (nodeId === undefined) {
      do {
        nodeId = this.nodeIdGenerator.next();
      } while (this.graphStore.hasNode(nodeId));
    }

    if (this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to add node with existing id");
    }

    this.graphStore.addNode(
      nodeId,
      element,
      x,
      y,
      centerFn ?? this.nodesCenterFn,
    );

    this.htmlController.attachNode(nodeId);

    if (ports !== undefined) {
      Object.entries(ports).forEach(([portId, element]) => {
        if (element instanceof HTMLElement) {
          this.markPort(portId, element, nodeId, this.portsCenterFn, null);
        } else {
          this.markPort(
            portId,
            element.element,
            nodeId,
            element.centerFn ?? this.portsCenterFn,
            element.direction ?? null,
          );
        }
      });
    }
  }

  public markPort(
    portId: string | undefined,
    element: HTMLElement,
    nodeId: string,
    centerFn: CenterFn | undefined,
    dir: number | null | undefined,
  ): void {
    if (portId === undefined) {
      do {
        portId = this.portIdGenerator.next();
      } while (this.graphStore.hasPort(portId));
    }

    if (!this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to set port on nonexisting node");
    }

    if (this.graphStore.hasPort(portId)) {
      throw new Error("failed to add port with existing id");
    }

    this.graphStore.addPort(
      portId,
      element,
      nodeId,
      centerFn ?? this.portsCenterFn,
      dir ?? null,
    );
  }

  public updatePortConnections(portId: string): void {
    if (!this.graphStore.hasPort(portId)) {
      throw new Error("failed to unset nonexisting port");
    }

    this.htmlController.updatePortConnections(portId);
  }

  public unmarkPort(portId: string): void {
    if (!this.graphStore.hasPort(portId)) {
      throw new Error("failed to unset nonexisting port");
    }

    this.graphStore
      .getPortAdjacentConnections(portId)
      .forEach((connectionId) => {
        this.removeConnection(connectionId);
      });

    this.graphStore.removePort(portId);
  }

  public addConnection(
    connectionId: string | undefined,
    fromPortId: string,
    toPortId: string,
    controllerFactory: ConnectionControllerFactory,
  ): void {
    if (connectionId === undefined) {
      do {
        connectionId = this.connectionIdGenerator.next();
      } while (this.graphStore.hasConnection(connectionId));
    }
    if (!this.graphStore.hasPort(fromPortId)) {
      throw new Error("failed to add connection from nonexisting port");
    }

    if (!this.graphStore.hasPort(toPortId)) {
      throw new Error("failed to add connection to nonexisting port");
    }

    this.graphStore.addConnection(
      connectionId,
      fromPortId,
      toPortId,
      controllerFactory(ConnectionType.Regular),
    );

    this.htmlController.attachConnection(connectionId);
  }

  public removeConnection(connectionId: string): void {
    if (!this.graphStore.hasConnection(connectionId)) {
      throw new Error("failed to remove nonexisting connection");
    }

    this.htmlController.detachConnection(connectionId);
    this.graphStore.removeConnection(connectionId);
  }

  public removeNode(nodeId: string): void {
    if (!this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to remove nonexisting node");
    }

    this.htmlController.detachNode(nodeId);
    this.graphStore.removeNode(nodeId);
  }

  public patchViewportState(
    scale: number | null,
    x: number | null,
    y: number | null,
  ): void {
    this.viewportTransformer.patchState(scale, x, y);
    this.htmlController.applyTransform();
  }

  public moveViewport(x: number, y: number): void {
    this.viewportTransformer.applyShift(x, y);
    this.htmlController.applyTransform();
  }

  public scaleContent(scale: number, cx: number, cy: number): void {
    this.viewportTransformer.applyScale(scale, cx, cy);
    this.htmlController.applyTransform();
  }

  public moveToNodes(nodeIds: readonly string[]): void {
    if (nodeIds.length === 0) {
      return;
    }

    const nodes = nodeIds
      .map((nodeId) => this.graphStore.getNode(nodeId))
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
    const [width, height] = this.htmlController.getViewportDimensions();
    const sa = this.viewportTransformer.getAbsScale();

    const targetX = avgX - (sa * width) / 2;
    const targetY = avgY - (sa * height) / 2;

    this.patchViewportState(null, targetX, targetY);
  }

  public updateNodeCoords(nodeId: string, x: number, y: number): void {
    if (!this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to update coordinates of nonexisting node");
    }

    this.graphStore.updateNodeCoords(nodeId, x, y);
    this.htmlController.updateNodePosition(nodeId);
  }

  public updateConnectionController(
    connectionId: string,
    controller: ConnectionController,
  ): void {
    if (!this.graphStore.hasConnection(connectionId)) {
      throw new Error("failed to update nonexisting connection");
    }

    this.htmlController.detachConnection(connectionId);
    this.graphStore.updateConnectionController(connectionId, controller);
    this.htmlController.attachConnection(connectionId);
  }

  public attach(element: HTMLElement): void {
    this.htmlController.attach(element);
  }

  public detach(): void {
    this.htmlController.detach();
  }

  public clear(): void {
    this.htmlController.clear();
    this.graphStore.clear();
    this.nodeIdGenerator.reset();
    this.portIdGenerator.reset();
    this.connectionIdGenerator.reset();
  }

  public destroy(): void {
    this.htmlController.destroy();
  }
}
