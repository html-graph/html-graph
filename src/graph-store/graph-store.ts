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
import { CanvasError, canvasErrorText } from "@/canvas-error";
import { NodeElement, PortElement } from "@/element";

export class GraphStore {
  private readonly nodes = new Map<Identifier, StoreNode>();

  private readonly ports = new Map<Identifier, StorePort>();

  private readonly edges = new Map<Identifier, StoreEdge>();

  private readonly nodesElementsMap = new Map<NodeElement, Identifier>();

  private readonly portIncomingEdges = new Map<Identifier, Set<Identifier>>();

  private readonly portOutgoingEdges = new Map<Identifier, Set<Identifier>>();

  private readonly portCycleEdges = new Map<Identifier, Set<Identifier>>();

  private readonly elementPorts = new OneToManyCollection<
    PortElement,
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

  public hasNode(nodeId: Identifier): boolean {
    return this.nodes.has(nodeId);
  }

  public getNode(nodeId: Identifier): StoreNode {
    const node = this.nodes.get(nodeId);

    if (node === undefined) {
      throw new CanvasError(canvasErrorText.accessNonexistingNode(nodeId));
    }

    return node;
  }

  public addNode(request: AddNodeRequest): void {
    if (this.hasNode(request.id)) {
      throw new CanvasError(canvasErrorText.addNodeWithExistingId(request.id));
    }

    const elementNodeId = this.findNodeIdByElement(request.element);

    if (elementNodeId !== undefined) {
      throw new CanvasError(
        canvasErrorText.addNodeWithElementInUse(request.id, elementNodeId),
      );
    }

    const ports = new Map<Identifier, PortElement>();

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

  public findNodeIdByElement(element: Element): Identifier | undefined {
    return this.nodesElementsMap.get(element as NodeElement);
  }

  public updateNode(nodeId: Identifier, request: UpdateNodeRequest): void {
    if (!this.hasNode(nodeId)) {
      throw new CanvasError(canvasErrorText.updateNonexistentNode(nodeId));
    }

    const { payload } = this.nodes.get(nodeId)!;

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
    if (!this.hasNode(nodeId)) {
      throw new CanvasError(canvasErrorText.removeNonexistentNode(nodeId));
    }

    this.beforeNodeRemovedEmitter.emit(nodeId);
    const node = this.getNode(nodeId);
    this.nodesElementsMap.delete(node.element);
    this.nodes.delete(nodeId);
  }

  public hasPort(portId: Identifier): boolean {
    return this.ports.has(portId);
  }

  public getPort(portId: Identifier): StorePort {
    const port = this.ports.get(portId);

    if (port === undefined) {
      throw new CanvasError(canvasErrorText.accessNonexistentPort(portId));
    }

    return port;
  }

  public addPort(request: AddPortRequest): void {
    if (this.hasPort(request.id)) {
      throw new CanvasError(canvasErrorText.addPortWithExistingId(request.id));
    }

    if (!this.hasNode(request.nodeId)) {
      throw new CanvasError(
        canvasErrorText.addPortToNonexistentNode(request.id, request.nodeId),
      );
    }

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
    this.portOutgoingEdges.set(request.id, new Set());

    this.getNode(request.nodeId).ports.set(request.id, request.element);
    this.afterPortAddedEmitter.emit(request.id);
  }

  public updatePort(portId: Identifier, request: UpdatePortRequest): void {
    if (!this.hasPort(portId)) {
      throw new CanvasError(canvasErrorText.updateNonexistentPort(portId));
    }

    const payload = this.getPort(portId).payload;

    payload.direction = request.direction ?? payload.direction;

    this.afterPortUpdatedEmitter.emit(portId);
  }

  public getAllPortIds(): readonly Identifier[] {
    return Array.from(this.ports.keys());
  }

  public findPortIdsByElement(element: Element): readonly Identifier[] {
    return this.elementPorts.getMultiBySingle(element as PortElement);
  }

  public getNodePortIds(nodeId: Identifier): readonly Identifier[] {
    const node = this.nodes.get(nodeId);

    if (node === undefined) {
      throw new CanvasError(
        canvasErrorText.accessPortsOfNonexistentNode(nodeId),
      );
    }

    return Array.from(node.ports.keys());
  }

  public removePort(portId: Identifier): void {
    if (!this.hasPort(portId)) {
      throw new CanvasError(canvasErrorText.removeNonexistentPort(portId));
    }

    const nodeId = this.getPort(portId).nodeId;

    this.beforePortRemovedEmitter.emit(portId);
    this.getNode(nodeId).ports.delete(portId);
    this.ports.delete(portId);
    this.elementPorts.removeByMulti(portId);
  }

  public hasEdge(edgeId: Identifier): boolean {
    return this.edges.has(edgeId);
  }

  public getEdge(edgeId: Identifier): StoreEdge {
    const edge = this.edges.get(edgeId);

    if (edge === undefined) {
      throw new CanvasError(canvasErrorText.accessNonexistentEdge(edgeId));
    }

    return edge;
  }

  public addEdge(request: AddEdgeRequest): void {
    if (this.hasEdge(request.id)) {
      throw new CanvasError(canvasErrorText.addEdgeWithExistingId(request.id));
    }

    if (!this.hasPort(request.from)) {
      throw new CanvasError(
        canvasErrorText.addEdgeFromNonexistentPort(request.id, request.from),
      );
    }

    if (!this.hasPort(request.to)) {
      throw new CanvasError(
        canvasErrorText.addEdgeToNonexistentPort(request.id, request.to),
      );
    }

    this.addEdgeInternal(request);
    this.afterEdgeAddedEmitter.emit(request.id);
  }

  public updateEdge(edgeId: Identifier, request: UpdateEdgeRequest): void {
    if (!this.hasEdge(edgeId)) {
      throw new CanvasError(canvasErrorText.updateNonexistentEdge(edgeId));
    }

    if (request.from !== undefined || request.to !== undefined) {
      if (request.from !== undefined && !this.hasPort(request.from)) {
        throw new CanvasError(
          canvasErrorText.updateNonexistentEdgeSource(edgeId, request.from),
        );
      }

      if (request.to !== undefined && !this.hasPort(request.to)) {
        throw new CanvasError(
          canvasErrorText.updateNonexistentEdgeTarget(edgeId, request.to),
        );
      }

      const edge = this.getEdge(edgeId);
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

  public removeEdge(edgeId: Identifier): void {
    if (!this.hasEdge(edgeId)) {
      throw new CanvasError(canvasErrorText.removeNonexistentEdge(edgeId));
    }

    this.beforeEdgeRemovedEmitter.emit(edgeId);
    this.removeEdgeInternal(edgeId);
  }

  public clear(): void {
    this.beforeClearEmitter.emit();
    this.portIncomingEdges.clear();
    this.portOutgoingEdges.clear();
    this.portCycleEdges.clear();
    this.elementPorts.clear();
    this.nodesElementsMap.clear();

    this.edges.clear();
    this.ports.clear();
    this.nodes.clear();
  }

  public getPortIncomingEdgeIds(portId: Identifier): readonly Identifier[] {
    const edgeIds = this.portIncomingEdges.get(portId);

    if (edgeIds === undefined) {
      throw new CanvasError(
        canvasErrorText.accessEdgesForNonexistentPort(portId),
      );
    }

    return Array.from(edgeIds);
  }

  public getPortOutgoingEdgeIds(portId: Identifier): readonly Identifier[] {
    const edgeIds = this.portOutgoingEdges.get(portId);

    if (edgeIds === undefined) {
      throw new CanvasError(
        canvasErrorText.accessEdgesForNonexistentPort(portId),
      );
    }

    return Array.from(edgeIds);
  }

  public getPortCycleEdgeIds(portId: Identifier): readonly Identifier[] {
    const edgeIds = this.portCycleEdges.get(portId);

    if (edgeIds === undefined) {
      throw new CanvasError(
        canvasErrorText.accessEdgesForNonexistentPort(portId),
      );
    }

    return Array.from(edgeIds);
  }

  public getPortAdjacentEdgeIds(portId: Identifier): readonly Identifier[] {
    return [
      ...this.getPortIncomingEdgeIds(portId),
      ...this.getPortOutgoingEdgeIds(portId),
      ...this.getPortCycleEdgeIds(portId),
    ];
  }

  public getNodeIncomingEdgeIds(nodeId: Identifier): readonly Identifier[] {
    const ports = Array.from(this.getNode(nodeId).ports.keys());
    const res: Identifier[] = [];

    ports.forEach((portId) => {
      this.getPortIncomingEdgeIds(portId)
        .filter((edgeId) => {
          const edge = this.getEdge(edgeId);
          const sourcePort = this.getPort(edge.from);

          return sourcePort.nodeId !== nodeId;
        })
        .forEach((edgeId) => {
          res.push(edgeId);
        });
    });

    return res;
  }

  public getNodeOutgoingEdgeIds(nodeId: Identifier): readonly Identifier[] {
    const ports = Array.from(this.getNode(nodeId).ports.keys());
    const res: Identifier[] = [];

    ports.forEach((portId) => {
      this.getPortOutgoingEdgeIds(portId)
        .filter((edgeId) => {
          const edge = this.getEdge(edgeId);
          const targetPort = this.getPort(edge.to);

          return targetPort.nodeId !== nodeId;
        })
        .forEach((edgeId) => {
          res.push(edgeId);
        });
    });

    return res;
  }

  public getNodeCycleEdgeIds(nodeId: Identifier): readonly Identifier[] {
    const ports = Array.from(this.getNode(nodeId).ports.keys());
    const res: Identifier[] = [];

    ports.forEach((portId) => {
      this.getPortCycleEdgeIds(portId).forEach((edgeId) => {
        res.push(edgeId);
      });

      this.getPortIncomingEdgeIds(portId)
        .filter((edgeId) => {
          const edge = this.getEdge(edgeId);
          const targetPort = this.getPort(edge.to);

          return targetPort.nodeId === nodeId;
        })
        .forEach((edgeId) => {
          res.push(edgeId);
        });
    });

    return res;
  }

  public getNodeAdjacentEdgeIds(nodeId: Identifier): readonly Identifier[] {
    const ports = Array.from(this.getNode(nodeId).ports.keys());
    const res: Identifier[] = [];

    ports.forEach((portId) => {
      this.getPortIncomingEdgeIds(portId).forEach((edgeId) => {
        res.push(edgeId);
      });

      this.getPortOutgoingEdgeIds(portId).forEach((edgeId) => {
        res.push(edgeId);
      });

      this.getPortCycleEdgeIds(portId).forEach((edgeId) => {
        res.push(edgeId);
      });
    });

    return res;
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
      this.portOutgoingEdges.get(request.from)!.add(request.id);
      this.portIncomingEdges.get(request.to)!.add(request.id);
    } else {
      this.portCycleEdges.get(request.from)!.add(request.id);
    }
  }

  private removeEdgeInternal(edgeId: Identifier): void {
    const { from, to } = this.getEdge(edgeId);

    this.portCycleEdges.get(from)!.delete(edgeId);
    this.portCycleEdges.get(to)!.delete(edgeId);
    this.portIncomingEdges.get(from)!.delete(edgeId);
    this.portIncomingEdges.get(to)!.delete(edgeId);
    this.portOutgoingEdges.get(from)!.delete(edgeId);
    this.portOutgoingEdges.get(to)!.delete(edgeId);

    this.edges.delete(edgeId);
  }
}
