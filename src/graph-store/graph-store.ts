import { StoreEdge } from "./store-edge";
import { StoreNode } from "./store-node";
import { StorePort } from "./store-port";
import { AddNodeRequest } from "./add-node-request";
import { AddPortRequest } from "./add-port-request";
import { AddEdgeRequest } from "./add-edge-request";
import { UpdateNodeRequest } from "./update-node-request";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { UpdateEdgeRequest } from "./update-edge-request";
import { UpdatePortRequest } from "./update-port-request";
import { OneToManyCollection } from "./one-to-many-collection";
import { Identifier } from "@/identifier";

export class GraphStore {
  private readonly nodes = new Map<Identifier, StoreNode>();

  private readonly ports = new Map<Identifier, StorePort>();

  private readonly edges = new Map<Identifier, StoreEdge>();

  private readonly nodesElementsMap = new Map<HTMLElement, Identifier>();

  private readonly portIncomingEdges = new Map<Identifier, Set<Identifier>>();

  private readonly portOutcomingEdges = new Map<Identifier, Set<Identifier>>();

  private readonly portCycleEdges = new Map<Identifier, Set<Identifier>>();

  private readonly elementPorts = new OneToManyCollection<
    HTMLElement,
    Identifier
  >();

  private readonly afterNodeAddedEmitter: EventEmitter<Identifier>;

  public readonly onAfterNodeAdded: EventHandler<Identifier>;

  private readonly afterNodeUpdatedEmitter: EventEmitter<Identifier>;

  public readonly onAfterNodeUpdated: EventHandler<Identifier>;

  private readonly afterNodePriorityUpdatedEmitter: EventEmitter<Identifier>;

  public readonly onAfterNodePriorityUpdated: EventHandler<Identifier>;

  private readonly beforeNodeRemovedEmitter: EventEmitter<Identifier>;

  public readonly onBeforeNodeRemoved: EventHandler<Identifier>;

  private readonly afterPortAddedEmitter: EventEmitter<Identifier>;

  public readonly onAfterPortAdded: EventHandler<Identifier>;

  private readonly afterPortUpdatedEmitter: EventEmitter<Identifier>;

  public readonly onAfterPortUpdated: EventHandler<Identifier>;

  private readonly beforePortRemovedEmitter: EventEmitter<Identifier>;

  public readonly onBeforePortRemoved: EventHandler<Identifier>;

  private readonly afterEdgeAddedEmitter: EventEmitter<Identifier>;

  public readonly onAfterEdgeAdded: EventHandler<Identifier>;

  private readonly afterEdgeShapeUpdatedEmitter: EventEmitter<Identifier>;

  public readonly onAfterEdgeShapeUpdated: EventHandler<Identifier>;

  private readonly afterEdgeUpdatedEmitter: EventEmitter<Identifier>;

  public readonly onAfterEdgeUpdated: EventHandler<Identifier>;

  private readonly afterEdgePriorityUpdatedEmitter: EventEmitter<Identifier>;

  public readonly onAfterEdgePriorityUpdated: EventHandler<Identifier>;

  private readonly beforeEdgeRemovedEmitter: EventEmitter<Identifier>;

  public readonly onBeforeEdgeRemoved: EventHandler<Identifier>;

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
    const ports = new Map<Identifier, HTMLElement>();

    const node: StoreNode = {
      element: request.element,
      payload: {
        x: request.x,
        y: request.y,
        centerFn: request.centerFn,
        priority: request.priority,
      },
      ports,
    };

    this.nodes.set(request.id, node);
    this.nodesElementsMap.set(request.element, request.id);

    this.afterNodeAddedEmitter.emit(request.id);
  }

  public getAllNodeIds(): readonly Identifier[] {
    return Array.from(this.nodes.keys());
  }

  public getNode(nodeId: Identifier): StoreNode | undefined {
    return this.nodes.get(nodeId);
  }

  public getElementNodeId(element: HTMLElement): Identifier | undefined {
    return this.nodesElementsMap.get(element);
  }

  public updateNode(nodeId: Identifier, request: UpdateNodeRequest): void {
    const payload = this.nodes.get(nodeId)!.payload;

    payload.x = request.x ?? payload.x;
    payload.y = request.y ?? payload.y;
    payload.centerFn = request.centerFn ?? payload.centerFn;

    if (request.priority !== undefined) {
      payload.priority = request.priority;
      this.afterNodePriorityUpdatedEmitter.emit(nodeId);
    }

    this.afterNodeUpdatedEmitter.emit(nodeId);
  }

  public removeNode(nodeId: Identifier): void {
    this.beforeNodeRemovedEmitter.emit(nodeId);
    const node = this.nodes.get(nodeId)!;
    this.nodesElementsMap.delete(node.element);
    this.nodes.delete(nodeId);
  }

  public addPort(request: AddPortRequest): void {
    this.ports.set(request.id, {
      element: request.element,
      payload: {
        direction: request.direction,
      },
      nodeId: request.nodeId,
    });

    this.elementPorts.addRecord(request.element, request.id);

    this.portCycleEdges.set(request.id, new Set());
    this.portIncomingEdges.set(request.id, new Set());
    this.portOutcomingEdges.set(request.id, new Set());

    this.nodes.get(request.nodeId)!.ports!.set(request.id, request.element);
    this.afterPortAddedEmitter.emit(request.id);
  }

  public getPort(portId: Identifier): StorePort | undefined {
    return this.ports.get(portId);
  }

  public updatePort(portId: Identifier, request: UpdatePortRequest): void {
    const payload = this.ports.get(portId)!.payload;

    payload.direction = request.direction ?? payload.direction;

    this.afterPortUpdatedEmitter.emit(portId);
  }

  public getAllPortIds(): readonly Identifier[] {
    return Array.from(this.ports.keys());
  }

  public getElementPortIds(element: HTMLElement): readonly Identifier[] {
    return this.elementPorts.getMultiBySingle(element);
  }

  public getNodePortIds(nodeId: Identifier): readonly Identifier[] | undefined {
    const node = this.nodes.get(nodeId);

    if (node !== undefined) {
      return Array.from(node.ports.keys());
    }

    return undefined;
  }

  public removePort(portId: Identifier): void {
    const nodeId = this.ports.get(portId)!.nodeId;

    this.beforePortRemovedEmitter.emit(portId);
    this.nodes.get(nodeId)!.ports.delete(portId);
    this.ports.delete(portId);
    this.elementPorts.removeByMulti(portId);
  }

  public addEdge(request: AddEdgeRequest): void {
    this.addEdgeInternal(request);
    this.afterEdgeAddedEmitter.emit(request.id);
  }

  public updateEdge(edgeId: Identifier, request: UpdateEdgeRequest): void {
    if (request.from !== undefined || request.to !== undefined) {
      const edge = this.edges.get(edgeId)!;
      const payload = edge.payload;

      this.removeEdgeInternal(edgeId);
      this.addEdgeInternal({
        id: edgeId,
        from: request.from ?? edge.from,
        to: request.to ?? edge.to,
        shape: payload.shape,
        priority: payload.priority,
      });
    }

    const edge = this.edges.get(edgeId)!;

    if (request.shape !== undefined) {
      edge.payload.shape = request.shape;
      this.afterEdgeShapeUpdatedEmitter.emit(edgeId);
    }

    if (request.priority !== undefined) {
      edge.payload.priority = request.priority;
      this.afterEdgePriorityUpdatedEmitter.emit(edgeId);
    }

    this.afterEdgeUpdatedEmitter.emit(edgeId);
  }

  public getAllEdgeIds(): readonly Identifier[] {
    return Array.from(this.edges.keys());
  }

  public getEdge(edgeId: Identifier): StoreEdge | undefined {
    return this.edges.get(edgeId);
  }

  public removeEdge(edgeId: Identifier): void {
    this.beforeEdgeRemovedEmitter.emit(edgeId);
    this.removeEdgeInternal(edgeId);
  }

  public clear(): void {
    this.beforeClearEmitter.emit();
    this.portIncomingEdges.clear();
    this.portOutcomingEdges.clear();
    this.portCycleEdges.clear();
    this.elementPorts.clear();
    this.nodesElementsMap.clear();

    this.edges.clear();
    this.ports.clear();
    this.nodes.clear();
  }

  public getPortIncomingEdgeIds(portId: Identifier): readonly Identifier[] {
    return Array.from(this.portIncomingEdges.get(portId)!);
  }

  public getPortOutgoingEdgeIds(portId: Identifier): readonly Identifier[] {
    return Array.from(this.portOutcomingEdges.get(portId)!);
  }

  public getPortCycleEdgeIds(portId: Identifier): readonly Identifier[] {
    return Array.from(this.portCycleEdges.get(portId)!);
  }

  public getPortAdjacentEdgeIds(portId: Identifier): readonly Identifier[] {
    return [
      ...this.getPortIncomingEdgeIds(portId),
      ...this.getPortOutgoingEdgeIds(portId),
      ...this.getPortCycleEdgeIds(portId),
    ];
  }

  public getNodeIncomingEdgeIds(nodeId: Identifier): readonly Identifier[] {
    const ports = Array.from(this.nodes.get(nodeId)!.ports.keys());
    let res: Identifier[] = [];

    ports.forEach((portId) => {
      res = [
        ...res,
        ...this.getPortIncomingEdgeIds(portId).filter((edgeId) => {
          const edge = this.getEdge(edgeId)!;
          const sourcePort = this.getPort(edge.from)!;

          return sourcePort.nodeId !== nodeId;
        }),
      ];
    });

    return res;
  }

  public getNodeOutgoingEdgeIds(nodeId: Identifier): readonly Identifier[] {
    const ports = Array.from(this.nodes.get(nodeId)!.ports.keys());
    let res: Identifier[] = [];

    ports.forEach((portId) => {
      res = [
        ...res,
        ...this.getPortOutgoingEdgeIds(portId).filter((edgeId) => {
          const edge = this.getEdge(edgeId)!;
          const targetPort = this.getPort(edge.to)!;

          return targetPort.nodeId !== nodeId;
        }),
      ];
    });

    return res;
  }

  public getNodeCycleEdgeIds(nodeId: Identifier): readonly Identifier[] {
    const ports = Array.from(this.nodes.get(nodeId)!.ports.keys());
    const res = new Set<Identifier>();

    ports.forEach((portId) => {
      this.getPortCycleEdgeIds(portId).forEach((edgeId) => {
        res.add(edgeId);
      });

      this.getPortIncomingEdgeIds(portId)
        .filter((edgeId) => {
          const edge = this.getEdge(edgeId)!;
          const targetPort = this.getPort(edge.to)!;

          return targetPort.nodeId === nodeId;
        })
        .forEach((edgeId) => {
          res.add(edgeId);
        });
    });

    return Array.from(res);
  }

  public getNodeAdjacentEdgeIds(nodeId: Identifier): readonly Identifier[] {
    const ports = Array.from(this.nodes.get(nodeId)!.ports.keys());
    const res = new Set<Identifier>();

    ports.forEach((portId) => {
      this.getPortIncomingEdgeIds(portId).forEach((edgeId) => {
        res.add(edgeId);
      });

      this.getPortOutgoingEdgeIds(portId).forEach((edgeId) => {
        res.add(edgeId);
      });

      this.getPortCycleEdgeIds(portId).forEach((edgeId) => {
        res.add(edgeId);
      });
    });

    return Array.from(res);
  }

  private addEdgeInternal(request: AddEdgeRequest): void {
    this.edges.set(request.id, {
      from: request.from,
      to: request.to,
      payload: {
        shape: request.shape,
        priority: request.priority,
      },
    });

    if (request.from !== request.to) {
      this.portOutcomingEdges.get(request.from)!.add(request.id);
      this.portIncomingEdges.get(request.to)!.add(request.id);
    } else {
      this.portCycleEdges.get(request.from)!.add(request.id);
    }
  }

  private removeEdgeInternal(edgeId: Identifier): void {
    const edge = this.edges.get(edgeId)!;
    const portFromId = edge.from;
    const portToId = edge.to;

    this.portCycleEdges.get(portFromId)!.delete(edgeId);
    this.portCycleEdges.get(portToId)!.delete(edgeId);
    this.portIncomingEdges.get(portFromId)!.delete(edgeId);
    this.portIncomingEdges.get(portToId)!.delete(edgeId);
    this.portOutcomingEdges.get(portFromId)!.delete(edgeId);
    this.portOutcomingEdges.get(portToId)!.delete(edgeId);

    this.edges.delete(edgeId);
  }
}
