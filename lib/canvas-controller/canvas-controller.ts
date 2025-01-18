import { CenterFn } from "@/center-fn";
import { EdgeShapeFactory, EdgeType } from "@/edges";
import { AddNodePorts } from "@/canvas/canvas";
import { GraphStore } from "@/graph-store";
import { HtmlController } from "@/html-controller";
import { ViewportTransformer } from "@/viewport-transformer";
import { IdGenerator } from "@/id-generator";
import { UpdatePortRequest } from "@/canvas/canvas/update-port-request";
import { PriorityFn } from "@/priority";

export class CanvasController {
  private readonly nodeIdGenerator = new IdGenerator((nodeId) => {
    return this.graphStore.getNode(nodeId) !== undefined;
  });

  private readonly portIdGenerator = new IdGenerator((portId) => {
    return this.graphStore.getPort(portId) !== undefined;
  });

  private readonly edgeIdGenerator = new IdGenerator((edgeId) => {
    return this.graphStore.getEdge(edgeId) !== undefined;
  });

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly htmlController: HtmlController,
    private readonly viewportTransformer: ViewportTransformer,
    private readonly nodesCenterFn: CenterFn,
    private readonly portsCenterFn: CenterFn,
    private readonly portsDirection: number,
    private readonly nodesPriorityFn: PriorityFn,
    private readonly edgesPriorityFn: PriorityFn,
  ) {}

  public addNode(
    nodeId: unknown | undefined,
    element: HTMLElement,
    x: number,
    y: number,
    ports: AddNodePorts | undefined,
    centerFn: CenterFn | undefined,
    priority: number | undefined,
  ): void {
    nodeId = this.nodeIdGenerator.create(nodeId);

    if (this.graphStore.getNode(nodeId) !== undefined) {
      throw new Error("failed to add node with existing id");
    }

    this.graphStore.addNode(
      nodeId,
      element,
      x,
      y,
      centerFn ?? this.nodesCenterFn,
      priority ?? this.nodesPriorityFn(),
    );

    this.htmlController.attachNode(nodeId);

    Array.from(ports ?? []).forEach((element) => {
      this.markPort(
        element.id,
        element.element,
        nodeId,
        element.centerFn ?? this.portsCenterFn,
        element.direction ?? this.portsDirection,
      );
    });
  }

  public updateNode(
    nodeId: unknown,
    x: number | undefined,
    y: number | undefined,
    priority: number | undefined,
    centerFn: CenterFn | undefined,
  ): void {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      throw new Error("failed to update nonexisting node");
    }

    node.x = x ?? node.x;
    node.y = y ?? node.y;
    node.centerFn = centerFn ?? node.centerFn;

    this.htmlController.updateNodeCoordinates(nodeId);

    if (priority !== undefined) {
      node.priority = priority;
      this.htmlController.updateNodePriority(nodeId);
    }
  }

  public removeNode(nodeId: unknown): void {
    if (this.graphStore.getNode(nodeId) === undefined) {
      throw new Error("failed to remove nonexisting node");
    }

    this.htmlController.detachNode(nodeId);
    this.graphStore.removeNode(nodeId);
  }

  public markPort(
    portId: unknown | undefined,
    element: HTMLElement,
    nodeId: unknown,
    centerFn: CenterFn | undefined,
    dir: number | undefined,
  ): void {
    portId = this.portIdGenerator.create(portId);

    if (this.graphStore.getNode(nodeId) === undefined) {
      throw new Error("failed to set port on nonexisting node");
    }

    if (this.graphStore.getPort(portId) !== undefined) {
      throw new Error("failed to add port with existing id");
    }

    this.graphStore.addPort(
      portId,
      element,
      nodeId,
      centerFn ?? this.portsCenterFn,
      dir ?? 0,
    );
  }

  public updatePort(
    portId: string,
    request: UpdatePortRequest | undefined,
  ): void {
    const port = this.graphStore.getPort(portId);

    if (port === undefined) {
      throw new Error("failed to unset nonexisting port");
    }

    port.direction = request?.direction ?? port.direction;
    port.centerFn = request?.centerFn ?? port.centerFn;

    this.htmlController.updatePortEdges(portId);
  }

  public unmarkPort(portId: string): void {
    if (this.graphStore.getPort(portId) === undefined) {
      throw new Error("failed to unset nonexisting port");
    }

    this.graphStore.getPortAdjacentEdges(portId).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });

    this.graphStore.removePort(portId);
  }

  public addEdge(
    edgeId: unknown | undefined,
    fromPortId: string,
    toPortId: string,
    shapeFactory: EdgeShapeFactory,
    priority: number | undefined,
  ): void {
    edgeId = this.edgeIdGenerator.create(edgeId);

    if (this.graphStore.getPort(fromPortId) === undefined) {
      throw new Error("failed to add edge from nonexisting port");
    }

    if (this.graphStore.getPort(toPortId) === undefined) {
      throw new Error("failed to add edge to nonexisting port");
    }

    if (this.graphStore.getEdge(edgeId) !== undefined) {
      throw new Error("failed to add edge with existing id");
    }

    const edgeType = this.resolveEdgeType(fromPortId, toPortId);

    this.graphStore.addEdge(
      edgeId,
      fromPortId,
      toPortId,
      shapeFactory(edgeType),
      priority ?? this.edgesPriorityFn(),
    );

    this.htmlController.attachEdge(edgeId);
  }

  public updateEdge(
    edgeId: unknown,
    shape: EdgeShapeFactory | undefined,
    priority: number | undefined,
  ): void {
    const edge = this.graphStore.getEdge(edgeId);
    if (edge === undefined) {
      throw new Error("failed to update nonexisting edge");
    }

    if (shape !== undefined) {
      const edgeType = this.resolveEdgeType(edge.from, edge.to);

      this.htmlController.detachEdge(edgeId);
      edge.shape = shape(edgeType);
      this.htmlController.attachEdge(edgeId);
    }

    if (priority !== undefined) {
      edge.priority = priority;
      this.htmlController.updateEdgePriority(edgeId);
    }
  }

  public removeEdge(edgeId: unknown): void {
    if (this.graphStore.getEdge(edgeId) === undefined) {
      throw new Error("failed to remove nonexisting edge");
    }

    this.htmlController.detachEdge(edgeId);
    this.graphStore.removeEdge(edgeId);
  }

  public patchViewportMatrix(
    scale: number | null,
    dx: number | null,
    dy: number | null,
  ): void {
    this.viewportTransformer.patchViewportMatrix(scale, dx, dy);
    this.htmlController.applyTransform();
  }

  public patchContentMatrix(
    scale: number | null,
    dx: number | null,
    dy: number | null,
  ): void {
    this.viewportTransformer.patchContentMatrix(scale, dx, dy);
    this.htmlController.applyTransform();
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
    this.edgeIdGenerator.reset();
  }

  public destroy(): void {
    this.htmlController.destroy();
  }

  private resolveEdgeType(fromPortId: unknown, toPortId: unknown): EdgeType {
    let edgeType = EdgeType.Regular;

    const fromNodeId = this.graphStore.getPortNode(fromPortId);
    const toNodeId = this.graphStore.getPortNode(toPortId);

    if (fromPortId === toPortId) {
      edgeType = EdgeType.PortCycle;
    } else if (fromNodeId === toNodeId) {
      edgeType = EdgeType.NodeCycle;
    }

    return edgeType;
  }
}
