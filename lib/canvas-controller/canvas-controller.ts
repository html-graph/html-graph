import { CenterFn } from "@/center-fn";
import { EdgeShapeFactory, EdgeType } from "@/edges";
import { AddNodePorts } from "@/canvas/canvas";
import { AbstractViewportTransformer } from "@/viewport-transformer";
import { IdGenerator } from "@/id-generator";
import { PriorityFn } from "@/priority";
import { HtmlGraphError } from "@/error";
import { HtmlController } from "@/html-controller";
import { GraphStore } from "@/graph-store";

export class CanvasController {
  private readonly nodeIdGenerator = new IdGenerator(
    (nodeId) => this.graphStore.getNode(nodeId) !== undefined,
  );

  private readonly portIdGenerator = new IdGenerator(
    (portId) => this.graphStore.getPort(portId) !== undefined,
  );

  private readonly edgeIdGenerator = new IdGenerator(
    (edgeId) => this.graphStore.getEdge(edgeId) !== undefined,
  );

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly htmlController: HtmlController,
    private readonly viewportTransformer: AbstractViewportTransformer,
    private readonly defaultNodesCenterFn: CenterFn,
    private readonly defaultPortsCenterFn: CenterFn,
    private readonly defaultPortsDirection: number,
    private readonly defaultNodesPriorityFn: PriorityFn,
    private readonly defaultEdgesPriorityFn: PriorityFn,
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
      throw new HtmlGraphError("failed to add node with existing id");
    }

    this.graphStore.addNode({
      nodeId,
      element,
      x,
      y,
      centerFn: centerFn ?? this.defaultNodesCenterFn,
      priority: priority ?? this.defaultNodesPriorityFn(),
    });

    this.htmlController.attachNode(nodeId);

    Array.from(ports ?? []).forEach((port) => {
      this.markPort(
        port.id,
        port.element,
        nodeId,
        port.centerFn ?? this.defaultPortsCenterFn,
        port.direction ?? this.defaultPortsDirection,
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
      throw new HtmlGraphError("failed to update nonexisting node");
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
      throw new HtmlGraphError("failed to remove nonexisting node");
    }

    (this.graphStore.getNodePortIds(nodeId) ?? []).forEach((portId) => {
      this.unmarkPort(portId);
    });

    this.htmlController.detachNode(nodeId);
    this.graphStore.removeNode(nodeId);
  }

  public markPort(
    portId: unknown | undefined,
    element: HTMLElement,
    nodeId: unknown,
    centerFn: CenterFn | undefined,
    direction: number | undefined,
  ): void {
    portId = this.portIdGenerator.create(portId);

    if (this.graphStore.getNode(nodeId) === undefined) {
      throw new HtmlGraphError("failed to set port on nonexisting node");
    }

    if (this.graphStore.getPort(portId) !== undefined) {
      throw new HtmlGraphError("failed to add port with existing id");
    }

    this.graphStore.addPort({
      portId,
      element,
      nodeId,
      centerFn: centerFn ?? this.defaultPortsCenterFn,
      direction: direction ?? this.defaultPortsDirection,
    });
  }

  public updatePort(
    portId: unknown,
    direction: number | undefined,
    centerFn: CenterFn | undefined,
  ): void {
    const port = this.graphStore.getPort(portId);

    if (port === undefined) {
      throw new HtmlGraphError("failed to unset nonexisting port");
    }

    port.direction = direction ?? port.direction;
    port.centerFn = centerFn ?? port.centerFn;

    this.htmlController.updatePortEdges(portId);
  }

  public unmarkPort(portId: unknown): void {
    if (this.graphStore.getPort(portId) === undefined) {
      throw new HtmlGraphError("failed to unset nonexisting port");
    }

    this.graphStore.getPortAdjacentEdgeIds(portId).forEach((edgeId) => {
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
      throw new HtmlGraphError("failed to add edge from nonexisting port");
    }

    if (this.graphStore.getPort(toPortId) === undefined) {
      throw new HtmlGraphError("failed to add edge to nonexisting port");
    }

    if (this.graphStore.getEdge(edgeId) !== undefined) {
      throw new HtmlGraphError("failed to add edge with existing id");
    }

    const edgeType = this.resolveEdgeType(fromPortId, toPortId);

    this.graphStore.addEdge({
      edgeId,
      from: fromPortId,
      to: toPortId,
      shape: shapeFactory(edgeType),
      priority: priority ?? this.defaultEdgesPriorityFn(),
    });

    this.htmlController.attachEdge(edgeId);
  }

  public updateEdge(
    edgeId: unknown,
    shape: EdgeShapeFactory | undefined,
    priority: number | undefined,
  ): void {
    const edge = this.graphStore.getEdge(edgeId);

    if (edge === undefined) {
      throw new HtmlGraphError("failed to update nonexisting edge");
    }

    if (shape !== undefined) {
      const edgeType = this.resolveEdgeType(edge.from, edge.to);

      edge.shape = shape(edgeType);
      this.htmlController.updateEdgeShape(edgeId);
    }

    if (priority !== undefined) {
      edge.priority = priority;
      this.htmlController.updateEdgePriority(edgeId);
    }
  }

  public removeEdge(edgeId: unknown): void {
    if (this.graphStore.getEdge(edgeId) === undefined) {
      throw new HtmlGraphError("failed to remove nonexisting edge");
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
    if (fromPortId === toPortId) {
      return EdgeType.PortCycle;
    }

    const fromNodeId = this.graphStore.getPortNodeId(fromPortId);
    const toNodeId = this.graphStore.getPortNodeId(toPortId);

    if (fromNodeId === toNodeId) {
      return EdgeType.NodeCycle;
    }

    return EdgeType.Regular;
  }
}
