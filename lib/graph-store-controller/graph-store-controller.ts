import { GraphStore } from "@/graph-store";
import { AddNodeRequest } from "./add-node-request";
import { UpdateNodeRequest } from "./update-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { UpdatePortRequest } from "./update-port-request";
import { UpdateEdgeRequest } from "./update-edge-request";
import { AddEdgeRequest } from "./add-edge-request";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";

/**
 * This entity is responsible for keeping consistent state of graph when
 * nodes, ports and edges get added, updated or removed
 */
export class GraphStoreController {
  public readonly onAfterNodeAdded: EventHandler<unknown>;

  private readonly onAfterNodeAddedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgeAdded: EventHandler<unknown>;

  private readonly onAfterEdgeAddedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgeShapeUpdated: EventHandler<unknown>;

  private readonly onAfterEdgeShapeUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgePriorityUpdated: EventHandler<unknown>;

  private readonly onAfterEdgePriorityUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgeUpdated: EventHandler<unknown>;

  private readonly onAfterEdgeUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterPortUpdated: EventHandler<unknown>;

  private readonly onAfterPortUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterNodePriorityUpdated: EventHandler<unknown>;

  private readonly onAfterNodePriorityUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterNodeUpdated: EventHandler<unknown>;

  private readonly onAfterNodeUpdatedEmitter: EventEmitter<unknown>;

  public readonly onBeforeEdgeRemoved: EventHandler<unknown>;

  private readonly onBeforeEdgeRemovedEmitter: EventEmitter<unknown>;

  public readonly onBeforeNodeRemoved: EventHandler<unknown>;

  private readonly onBeforeNodeRemovedEmitter: EventEmitter<unknown>;

  public constructor(private readonly graphStore: GraphStore) {
    [this.onAfterNodeAddedEmitter, this.onAfterNodeAdded] =
      createPair<unknown>();
    [this.onAfterEdgeAddedEmitter, this.onAfterEdgeAdded] =
      createPair<unknown>();
    [this.onAfterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] =
      createPair<unknown>();
    [this.onAfterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] =
      createPair<unknown>();
    [this.onAfterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] =
      createPair<unknown>();
    [this.onAfterPortUpdatedEmitter, this.onAfterPortUpdated] =
      createPair<unknown>();
    [this.onAfterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] =
      createPair<unknown>();
    [this.onAfterNodeUpdatedEmitter, this.onAfterNodeUpdated] =
      createPair<unknown>();
    [this.onBeforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] =
      createPair<unknown>();
    [this.onBeforeNodeRemovedEmitter, this.onBeforeNodeRemoved] =
      createPair<unknown>();
  }

  public addNode(request: AddNodeRequest): void {
    this.graphStore.addNode(request);
    this.onAfterNodeAddedEmitter.emit(request.id);
  }

  public markPort(request: MarkPortRequest): void {
    this.graphStore.addPort(request);
  }

  public addEdge(request: AddEdgeRequest): void {
    this.graphStore.addEdge(request);
    this.onAfterEdgeAddedEmitter.emit(request.id);
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    if (request.shape !== undefined) {
      edge.shape = request.shape;
      this.onAfterEdgeShapeUpdatedEmitter.emit(edgeId);
    }

    if (request.from !== undefined) {
      this.graphStore.updateEdgeFrom(edgeId, request.from);
    }

    if (request.to !== undefined) {
      this.graphStore.updateEdgeTo(edgeId, request.to);
    }

    this.onAfterEdgeUpdatedEmitter.emit(edgeId);

    if (request.priority !== undefined) {
      edge.priority = request.priority;
      this.onAfterEdgePriorityUpdatedEmitter.emit(edgeId);
    }
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    const port = this.graphStore.getPort(portId)!;

    port.direction = request.direction ?? port.direction;

    this.onAfterPortUpdatedEmitter.emit(portId);
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): void {
    const node = this.graphStore.getNode(nodeId)!;

    node.x = request?.x ?? node.x;
    node.y = request?.y ?? node.y;
    node.centerFn = request.centerFn ?? node.centerFn;

    this.onAfterNodeUpdatedEmitter.emit(nodeId);

    if (request.priority !== undefined) {
      node.priority = request.priority;
      this.onAfterNodePriorityUpdatedEmitter.emit(nodeId);
    }
  }

  public removeEdge(edgeId: unknown): void {
    this.onBeforeEdgeRemovedEmitter.emit(edgeId);
    this.graphStore.removeEdge(edgeId);
  }

  public unmarkPort(portId: unknown): void {
    this.graphStore.getPortAdjacentEdgeIds(portId).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });

    this.graphStore.removePort(portId);
  }

  public removeNode(nodeId: unknown): void {
    this.graphStore.getNodePortIds(nodeId)!.forEach((portId) => {
      this.unmarkPort(portId);
    });

    this.onBeforeNodeRemovedEmitter.emit(nodeId);
    this.graphStore.removeNode(nodeId);
  }

  public clear(): void {
    this.graphStore.clear();
  }
}
