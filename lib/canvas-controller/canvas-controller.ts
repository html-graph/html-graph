import { CenterFn } from "@/center-fn";
import { EdgeType } from "@/edges";
import { IdGenerator } from "@/id-generator";
import { PriorityFn } from "@/priority";
import { HtmlGraphError } from "@/error";
import { HtmlController } from "@/html-controller";
import { GraphStore } from "@/graph-store";
import { ViewportTransformer } from "@/viewport-transformer";
import { AddNodeRequest } from "./add-node-request";
import { UpdateNodeRequest } from "./update-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { UpdatePortRequest } from "./update-port-request";
import { UpdateEdgeRequest } from "./update-edge-request";
import { PatchTransformRequest } from "./patch-transform-request";
import { AddEdgeRequest } from "./add-edge-request";

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
    private readonly viewportTransformer: ViewportTransformer,
    private readonly defaultNodesCenterFn: CenterFn,
    private readonly defaultPortsDirection: number,
    private readonly defaultNodesPriorityFn: PriorityFn,
    private readonly defaultEdgesPriorityFn: PriorityFn,
  ) {}

  public attach(element: HTMLElement): void {
    this.htmlController.attach(element);
  }

  public detach(): void {
    this.htmlController.detach();
  }

  public addNode(request: AddNodeRequest): void {
    const nodeId = this.nodeIdGenerator.create(request.nodeId);

    if (this.graphStore.getNode(nodeId) !== undefined) {
      throw new HtmlGraphError("failed to add node with existing id");
    }

    this.graphStore.addNode({
      nodeId,
      element: request.element,
      x: request.x,
      y: request.y,
      centerFn: request.centerFn ?? this.defaultNodesCenterFn,
      priority: request.priority ?? this.defaultNodesPriorityFn(),
    });

    this.htmlController.attachNode(nodeId);

    Array.from(request.ports ?? []).forEach((port) => {
      this.markPort({
        portId: port.id,
        element: port.element,
        nodeId,
        direction: port.direction,
      });
    });
  }

  public markPort(request: MarkPortRequest): void {
    const portId = this.portIdGenerator.create(request.portId);

    if (this.graphStore.getPort(portId) !== undefined) {
      throw new HtmlGraphError("failed to add port with existing id");
    }

    if (this.graphStore.getNode(request.nodeId) === undefined) {
      throw new HtmlGraphError("failed to set port on nonexisting node");
    }

    this.graphStore.addPort({
      portId,
      element: request.element,
      nodeId: request.nodeId,
      direction: request.direction ?? this.defaultPortsDirection,
    });
  }

  public addEdge(request: AddEdgeRequest): void {
    const edgeId = this.edgeIdGenerator.create(request.edgeId);

    if (this.graphStore.getEdge(edgeId) !== undefined) {
      throw new HtmlGraphError("failed to add edge with existing id");
    }

    if (this.graphStore.getPort(request.from) === undefined) {
      throw new HtmlGraphError("failed to add edge from nonexisting port");
    }

    if (this.graphStore.getPort(request.to) === undefined) {
      throw new HtmlGraphError("failed to add edge to nonexisting port");
    }

    const edgeType = this.resolveEdgeType(request.from, request.to);

    this.graphStore.addEdge({
      edgeId,
      from: request.from,
      to: request.to,
      shape: request.shapeFactory(edgeType),
      priority: request.priority ?? this.defaultEdgesPriorityFn(),
    });

    this.htmlController.attachEdge(edgeId);
  }

  public updateEdge(request: UpdateEdgeRequest): void {
    const edge = this.graphStore.getEdge(request.edgeId);

    if (edge === undefined) {
      throw new HtmlGraphError("failed to update nonexisting edge");
    }

    if (request.shape !== undefined) {
      const edgeType = this.resolveEdgeType(edge.from, edge.to);

      edge.shape = request.shape(edgeType);
      this.htmlController.updateEdgeShape(request.edgeId);
    }

    if (request.priority !== undefined) {
      edge.priority = request.priority;
      this.htmlController.updateEdgePriority(request.edgeId);
    }

    this.htmlController.renderEdge(request.edgeId);
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    const port = this.graphStore.getPort(portId);

    if (port === undefined) {
      throw new HtmlGraphError("failed to unset nonexisting port");
    }

    port.direction = request.direction ?? port.direction;

    const edges = this.graphStore.getPortAdjacentEdgeIds(portId);

    edges.forEach((edge) => {
      this.htmlController.renderEdge(edge);
    });
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): void {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      throw new HtmlGraphError("failed to update nonexisting node");
    }

    node.x = request?.x ?? node.x;
    node.y = request?.y ?? node.y;
    node.centerFn = request?.centerFn ?? node.centerFn;
    node.priority = request?.priority ?? node.priority;

    this.htmlController.updateNodeCoordinates(nodeId);
    this.htmlController.updateNodePriority(nodeId);

    const edges = this.graphStore.getNodeAdjacentEdgeIds(nodeId);

    edges.forEach((edge) => {
      this.htmlController.renderEdge(edge);
    });
  }

  public removeEdge(edgeId: unknown): void {
    if (this.graphStore.getEdge(edgeId) === undefined) {
      throw new HtmlGraphError("failed to remove nonexisting edge");
    }

    this.htmlController.detachEdge(edgeId);
    this.graphStore.removeEdge(edgeId);
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

  public removeNode(nodeId: unknown): void {
    if (this.graphStore.getNode(nodeId) === undefined) {
      throw new HtmlGraphError("failed to remove nonexisting node");
    }

    this.graphStore.getNodePortIds(nodeId)!.forEach((portId) => {
      this.unmarkPort(portId);
    });

    this.htmlController.detachNode(nodeId);
    this.graphStore.removeNode(nodeId);
  }

  public patchViewportMatrix(matrix: PatchTransformRequest): void {
    this.viewportTransformer.patchViewportMatrix(matrix);
    this.htmlController.applyTransform();
  }

  public patchContentMatrix(matrix: PatchTransformRequest): void {
    this.viewportTransformer.patchContentMatrix(matrix);
    this.htmlController.applyTransform();
  }

  public clear(): void {
    this.htmlController.clear();
    this.graphStore.clear();
    this.nodeIdGenerator.reset();
    this.portIdGenerator.reset();
    this.edgeIdGenerator.reset();
  }

  public destroy(): void {
    this.clear();
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
