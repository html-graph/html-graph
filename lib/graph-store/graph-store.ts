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

  private readonly afterNodeAddedEmitter: EventEmitter<unknown>;

  public readonly onAfterNodeAdded: EventHandler<unknown>;

  private readonly afterNodeUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterNodeUpdated: EventHandler<unknown>;

  private readonly afterNodePriorityUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterNodePriorityUpdated: EventHandler<unknown>;

  private readonly beforeNodeRemovedEmitter: EventEmitter<unknown>;

  public readonly onBeforeNodeRemoved: EventHandler<unknown>;

  private readonly afterPortAddedEmitter: EventEmitter<unknown>;

  public readonly onAfterPortAdded: EventHandler<unknown>;

  private readonly afterPortUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterPortUpdated: EventHandler<unknown>;

  private readonly beforePortRemovedEmitter: EventEmitter<unknown>;

  public readonly onBeforePortRemoved: EventHandler<unknown>;

  private readonly afterEdgeAddedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgeAdded: EventHandler<unknown>;

  private readonly afterEdgeShapeUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgeShapeUpdated: EventHandler<unknown>;

  private readonly afterEdgeUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgeUpdated: EventHandler<unknown>;

  private readonly afterEdgePriorityUpdatedEmitter: EventEmitter<unknown>;

  public readonly onAfterEdgePriorityUpdated: EventHandler<unknown>;

  private readonly beforeEdgeRemovedEmitter: EventEmitter<unknown>;

  public readonly onBeforeEdgeRemoved: EventHandler<unknown>;

  private readonly beforeClearEmitter: EventEmitter<void>;

  public readonly onBeforeClear: EventHandler<void>;

  public constructor() {
    [this.afterNodeAddedEmitter, this.onAfterNodeAdded] = createPair();

    [this.afterNodeUpdatedEmitter, this.onAfterNodeUpdated] = createPair();

    [this.afterNodePriorityUpdatedEmitter, this.onAfterNodePriorityUpdated] =
      createPair();

    [this.beforeNodeRemovedEmitter, this.onBeforeNodeRemoved] = createPair();

    [this.afterPortAddedEmitter, this.onAfterPortAdded] = createPair();

    [this.afterPortUpdatedEmitter, this.onAfterPortUpdated] = createPair();

    [this.beforePortRemovedEmitter, this.onBeforePortRemoved] = createPair();

    [this.afterEdgeAddedEmitter, this.onAfterEdgeAdded] = createPair();

    [this.afterEdgeShapeUpdatedEmitter, this.onAfterEdgeShapeUpdated] =
      createPair();
    [this.afterEdgeUpdatedEmitter, this.onAfterEdgeUpdated] = createPair();

    [this.afterEdgePriorityUpdatedEmitter, this.onAfterEdgePriorityUpdated] =
      createPair();

    [this.beforeEdgeRemovedEmitter, this.onBeforeEdgeRemoved] = createPair();

    [this.beforeClearEmitter, this.onBeforeClear] = createPair();
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

    this.afterNodeAddedEmitter.emit(request.id);
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
      this.afterNodePriorityUpdatedEmitter.emit(nodeId);
    }

    this.afterNodeUpdatedEmitter.emit(nodeId);
  }

  public removeNode(nodeId: unknown): void {
    this.beforeNodeRemovedEmitter.emit(nodeId);
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
    this.afterPortAddedEmitter.emit(request.id);
  }

  public getPort(portId: unknown): PortPayload | undefined {
    return this.ports.get(portId);
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    const port = this.ports.get(portId)!;

    port.direction = request.direction ?? port.direction;

    this.afterPortUpdatedEmitter.emit(portId);
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

    this.beforePortRemovedEmitter.emit(portId);
    this.nodes.get(nodeId)!.ports.delete(portId);
    this.ports.delete(portId);
  }

  public addEdge(request: AddEdgeRequest): void {
    this.addEdgeInternal(request);
    this.afterEdgeAddedEmitter.emit(request.id);
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
      this.afterEdgeShapeUpdatedEmitter.emit(edgeId);
    }

    if (request.priority !== undefined) {
      edge.priority = request.priority;
      this.afterEdgePriorityUpdatedEmitter.emit(edgeId);
    }

    this.afterEdgeUpdatedEmitter.emit(edgeId);
  }

  public getAllEdgeIds(): readonly unknown[] {
    return Array.from(this.edges.keys());
  }

  public getEdge(edgeId: unknown): EdgePayload | undefined {
    return this.edges.get(edgeId);
  }

  public removeEdge(edgeId: unknown): void {
    this.beforeEdgeRemovedEmitter.emit(edgeId);
    this.removeEdgeInternal(edgeId);
  }

  public clear(): void {
    this.beforeClearEmitter.emit();
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
