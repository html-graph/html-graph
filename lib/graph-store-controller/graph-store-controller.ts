import { IdGenerator } from "@/id-generator";
import { HtmlGraphError } from "@/error";
import { GraphStore } from "@/graph-store";
import { AddNodeRequest } from "./add-node-request";
import { UpdateNodeRequest } from "./update-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { UpdatePortRequest } from "./update-port-request";
import { UpdateEdgeRequest } from "./update-edge-request";
import { AddEdgeRequest } from "./add-edge-request";
import { GraphStoreControllerDefaults } from "./graph-store-controller-defaults";
import { GraphStoreControllerEvents } from "./graph-store-controller-events";

/**
 * This entity is responsible for keeping consistent state of graph when
 * nodes, ports and edges get added, updated or removed
 */
export class GraphStoreController {
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
    private readonly options: GraphStoreControllerDefaults,
    private readonly events: GraphStoreControllerEvents,
  ) {}

  public addNode(request: AddNodeRequest): void {
    const nodeId = this.nodeIdGenerator.create(request.id);

    if (this.graphStore.getNode(nodeId) !== undefined) {
      throw new HtmlGraphError("failed to add node with existing id");
    }

    this.graphStore.addNode({
      nodeId,
      element: request.element,
      x: request.x,
      y: request.y,
      centerFn: request.centerFn ?? this.options.nodes.centerFn,
      priority: request.priority ?? this.options.nodes.priorityFn(),
    });

    this.events.onAfterNodeAdded(nodeId);

    Array.from(request.ports ?? []).forEach((port) => {
      this.markPort({
        id: port.id,
        element: port.element,
        nodeId,
        direction: port.direction,
      });
    });
  }

  public markPort(request: MarkPortRequest): void {
    const portId = this.portIdGenerator.create(request.id);

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
      direction: request.direction ?? this.options.ports.direction,
    });
  }

  public addEdge(request: AddEdgeRequest): void {
    const edgeId = this.edgeIdGenerator.create(request.id);

    if (this.graphStore.getEdge(edgeId) !== undefined) {
      throw new HtmlGraphError("failed to add edge with existing id");
    }

    if (this.graphStore.getPort(request.from) === undefined) {
      throw new HtmlGraphError("failed to add edge from nonexisting port");
    }

    if (this.graphStore.getPort(request.to) === undefined) {
      throw new HtmlGraphError("failed to add edge to nonexisting port");
    }

    this.graphStore.addEdge({
      edgeId,
      from: request.from,
      to: request.to,
      shape: request.shape ?? this.options.edges.shapeFactory(),
      priority: request.priority ?? this.options.edges.priorityFn(),
    });

    this.events.onAfterEdgeAdded(edgeId);
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void {
    const edge = this.graphStore.getEdge(edgeId);

    if (edge === undefined) {
      throw new HtmlGraphError("failed to update nonexisting edge");
    }

    if (request.shape !== undefined) {
      edge.shape = request.shape;
      this.events.onAfterEdgeShapeUpdated(edgeId);
    }

    if (request.from !== undefined) {
      this.graphStore.updateEdgeFrom(edgeId, request.from);
    }

    if (request.to !== undefined) {
      this.graphStore.updateEdgeTo(edgeId, request.to);
    }

    this.events.onAfterEdgeUpdated(edgeId);

    if (request.priority !== undefined) {
      edge.priority = request.priority;
      this.events.onAfterEdgePriorityUpdated(edgeId);
    }
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    const port = this.graphStore.getPort(portId);

    if (port === undefined) {
      throw new HtmlGraphError("failed to unset nonexisting port");
    }

    port.direction = request.direction ?? port.direction;

    this.events.onAfterPortUpdated(portId);
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): void {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      throw new HtmlGraphError("failed to update nonexisting node");
    }

    node.x = request?.x ?? node.x;
    node.y = request?.y ?? node.y;
    node.centerFn = request.centerFn ?? node.centerFn;

    this.events.onAfterNodeUpdated(nodeId);

    if (request.priority !== undefined) {
      node.priority = request.priority;
      this.events.onAfterNodePriorityUpdated(nodeId);
    }
  }

  public removeEdge(edgeId: unknown): void {
    if (this.graphStore.getEdge(edgeId) === undefined) {
      throw new HtmlGraphError("failed to remove nonexisting edge");
    }

    this.events.onBeforeEdgeRemoved(edgeId);
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

    this.events.onBeforeNodeRemoved(nodeId);
    this.graphStore.removeNode(nodeId);
  }

  public clear(): void {
    this.graphStore.clear();
    this.nodeIdGenerator.reset();
    this.portIdGenerator.reset();
    this.edgeIdGenerator.reset();
  }
}
