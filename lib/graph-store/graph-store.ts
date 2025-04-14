import { EdgePayload } from "./edge-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "./port-payload";
import { AddNodeRequest } from "./add-node-request";
import { AddPortRequest } from "./add-port-request";
import { AddEdgeRequest } from "./add-edge-request";
import { UpdateNodeRequest } from "./update-node-request";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { UpdateEdgeRequest } from "./update-edge-request";
import { UpdatePortRequest } from "./update-port-request";

/**
 * This entity is responsible for storing state of graph
 */
export class GraphStore {
  private readonly nodes = new Map<unknown, NodePayload>();

  private readonly ports = new Map<unknown, PortPayload>();

  private readonly edges = new Map<unknown, EdgePayload>();

  private readonly incommingEdges = new Map<unknown, Set<unknown>>();

  private readonly outcommingEdges = new Map<unknown, Set<unknown>>();

  private readonly cycleEdges = new Map<unknown, Set<unknown>>();

  private readonly onAfterNodeAddedEmitter: EventEmitter<unknown>;

  public readonly onAfterNodeAdded: EventHandler<unknown>;

  private readonly onAfterNodeUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterNodeUpdated: EventHandler<unknown>;

  private readonly onAfterNodePriorityUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterNodePriorityUpdated: EventHandler<unknown>;

  private readonly onBeforeNodeRemovedEmitter: EventEmitter<unknown>;

  public readonly onBeforeNodeRemoved: EventHandler<unknown>;

  private readonly onAfterPortAddedEmitter: EventEmitter<unknown>;

  public readonly onAfterPortAdded: EventHandler<unknown>;

  private readonly onAfterPortUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterPortUpdated: EventHandler<unknown>;

  private readonly onBeforePortRemovedEmitter: EventEmitter<unknown>;

  public readonly onBeforePortRemoved: EventHandler<unknown>;

  private readonly onAfterEdgeAddedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgeAdded: EventHandler<unknown>;

  private readonly onAfterEdgeShapeUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgeShapeUpdated: EventHandler<unknown>;

  private readonly onAfterEdgeUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgeUpdated: EventHandler<unknown>;

  private readonly onAfterEdgePriorityUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgePriorityUpdated: EventHandler<unknown>;

  private readonly onBeforeEdgeRemovedEmitter: EventEmitter<unknown>;

  public readonly onBeforeEdgeRemoved: EventHandler<unknown>;

  private readonly onBeforeClearEmitter: EventEmitter<void>;

  public readonly onBeforeClear: EventHandler<void>;

  public constructor() {
    [this.onAfterNodeAddedEmitter, this.onAfterNodeAdded] = createPair();

    [this.onAfterNodeUpdatedEmitter, this.onAfterNodeUpdated] = createPair();

    [this.onAfterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] =
      createPair();

    [this.onBeforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = createPair();

    [this.onAfterPortAddedEmitter, this.onAfterPortAdded] = createPair();

    [this.onAfterPortUpdatedEmitter, this.onAfterPortUpdated] = createPair();

    [this.onBeforePortRemovedEmitter, this.onBeforePortRemoved] = createPair();

    [this.onAfterEdgeAddedEmitter, this.onAfterEdgeAdded] = createPair();

    [this.onAfterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] =
      createPair();
    [this.onAfterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = createPair();

    [this.onAfterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] =
      createPair();

    [this.onBeforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = createPair();

    [this.onBeforeClearEmitter, this.onBeforeClear] = createPair();
  }

  public addNode(request: AddNodeRequest): void {
    const ports = new Map<unknown, HTMLElement>();

    const node: NodePayload = {
      element: request.element,
      x: request.x,
      y: request.y,
      centerFn: request.centerFn,
      priority: request.priority,
      ports,
    };

    this.nodes.set(request.id, node);

    this.onAfterNodeAddedEmitter.emit(request.id);
  }

  public getAllNodeIds(): readonly unknown[] {
    return Array.from(this.nodes.keys());
  }

  public getNode(nodeId: unknown): NodePayload | undefined {
    return this.nodes.get(nodeId);
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): void {
    const node = this.nodes.get(nodeId)!;

    node.x = request.x ?? node.x;
    node.y = request.y ?? node.y;
    node.centerFn = request.centerFn ?? node.centerFn;

    if (request.priority !== undefined) {
      node.priority = request.priority;
      this.onAfterNodePriorityUpdatedEmitter.emit(nodeId);
    }

    this.onAfterNodeUpdatedEmitter.emit(nodeId);
  }

  public removeNode(nodeId: unknown): void {
    this.onBeforeNodeRemovedEmitter.emit(nodeId);
    this.nodes.delete(nodeId);
  }

  public addPort(request: AddPortRequest): void {
    this.ports.set(request.id, {
      element: request.element,
      direction: request.direction,
      nodeId: request.nodeId,
    });

    this.cycleEdges.set(request.id, new Set());
    this.incommingEdges.set(request.id, new Set());
    this.outcommingEdges.set(request.id, new Set());

    this.nodes.get(request.nodeId)!.ports!.set(request.id, request.element);
    this.onAfterPortAddedEmitter.emit(request.id);
  }

  public getPort(portId: unknown): PortPayload | undefined {
    return this.ports.get(portId);
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    const port = this.ports.get(portId)!;

    port.direction = request.direction ?? port.direction;

    this.onAfterPortUpdatedEmitter.emit(portId);
  }

  public getAllPortIds(): readonly unknown[] {
    return Array.from(this.ports.keys());
  }

  public getNodePortIds(nodeId: unknown): readonly unknown[] | undefined {
    const node = this.nodes.get(nodeId);

    if (node !== undefined) {
      return Array.from(node.ports.keys());
    }

    return undefined;
  }

  public removePort(portId: unknown): void {
    const nodeId = this.ports.get(portId)!.nodeId;

    this.onBeforePortRemovedEmitter.emit(portId);
    this.nodes.get(nodeId)!.ports.delete(portId);
    this.ports.delete(portId);
  }

  public addEdge(request: AddEdgeRequest): void {
    this.addEdgeInternal(request);
    this.onAfterEdgeAddedEmitter.emit(request.id);
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void {
    if (request.from !== undefined || request.to !== undefined) {
      const edge = this.edges.get(edgeId)!;

      this.removeEdgeInternal(edgeId);
      this.addEdgeInternal({
        id: edgeId,
        from: request.from ?? edge.from,
        to: request.to ?? edge.to,
        shape: edge.shape,
        priority: edge.priority,
      });
    }

    const edge = this.edges.get(edgeId)!;

    if (request.shape !== undefined) {
      edge.shape = request.shape;
      this.onAfterEdgeShapeUpdatedEmitter.emit(edgeId);
    }

    if (request.priority !== undefined) {
      edge.priority = request.priority;
      this.onAfterEdgePriorityUpdatedEmitter.emit(edgeId);
    }

    this.onAfterEdgeUpdatedEmitter.emit(edgeId);
  }

  public getAllEdgeIds(): readonly unknown[] {
    return Array.from(this.edges.keys());
  }

  public getEdge(edgeId: unknown): EdgePayload | undefined {
    return this.edges.get(edgeId);
  }

  public removeEdge(edgeId: unknown): void {
    this.onBeforeEdgeRemovedEmitter.emit(edgeId);
    this.removeEdgeInternal(edgeId);
  }

  public clear(): void {
    this.onBeforeClearEmitter.emit();
    this.incommingEdges.clear();
    this.outcommingEdges.clear();
    this.cycleEdges.clear();

    this.edges.clear();
    this.ports.clear();
    this.nodes.clear();
  }

  public getPortIncomingEdgeIds(portId: unknown): readonly unknown[] {
    return Array.from(this.incommingEdges.get(portId)!);
  }

  public getPortOutcomingEdgeIds(portId: unknown): readonly unknown[] {
    return Array.from(this.outcommingEdges.get(portId)!);
  }

  public getPortCycleEdgeIds(portId: unknown): readonly unknown[] {
    return Array.from(this.cycleEdges.get(portId)!);
  }

  public getPortAdjacentEdgeIds(portId: unknown): readonly unknown[] {
    return [
      ...this.getPortIncomingEdgeIds(portId),
      ...this.getPortOutcomingEdgeIds(portId),
      ...this.getPortCycleEdgeIds(portId),
    ];
  }

  public getNodeIncomingEdgeIds(nodeId: unknown): readonly unknown[] {
    const ports = Array.from(this.nodes.get(nodeId)!.ports.keys());
    let res: unknown[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortIncomingEdgeIds(portId)];
    });

    return res;
  }

  public getNodeOutcomingEdgeIds(nodeId: unknown): readonly unknown[] {
    const ports = Array.from(this.nodes.get(nodeId)!.ports.keys());
    let res: unknown[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortOutcomingEdgeIds(portId)];
    });

    return res;
  }

  public getNodeCycleEdgeIds(nodeId: unknown): readonly unknown[] {
    const ports = Array.from(this.nodes.get(nodeId)!.ports.keys());
    let res: unknown[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortCycleEdgeIds(portId)];
    });

    return res;
  }

  public getNodeAdjacentEdgeIds(nodeId: unknown): readonly unknown[] {
    return [
      ...this.getNodeIncomingEdgeIds(nodeId),
      ...this.getNodeOutcomingEdgeIds(nodeId),
      ...this.getNodeCycleEdgeIds(nodeId),
    ];
  }

  private addEdgeInternal(request: AddEdgeRequest): void {
    this.edges.set(request.id, {
      from: request.from,
      to: request.to,
      shape: request.shape,
      priority: request.priority,
    });

    if (request.from !== request.to) {
      this.outcommingEdges.get(request.from)!.add(request.id);
      this.incommingEdges.get(request.to)!.add(request.id);
    } else {
      this.cycleEdges.get(request.from)!.add(request.id);
    }
  }

  private removeEdgeInternal(edgeId: unknown): void {
    const edge = this.edges.get(edgeId)!;
    const portFromId = edge.from;
    const portToId = edge.to;

    this.cycleEdges.get(portFromId)!.delete(edgeId);
    this.cycleEdges.get(portToId)!.delete(edgeId);
    this.incommingEdges.get(portFromId)!.delete(edgeId);
    this.incommingEdges.get(portToId)!.delete(edgeId);
    this.outcommingEdges.get(portFromId)!.delete(edgeId);
    this.outcommingEdges.get(portToId)!.delete(edgeId);

    this.edges.delete(edgeId);
  }
}
