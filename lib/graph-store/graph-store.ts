import { EdgePayload } from "./edge-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "./port-payload";
import { AddNodeRequest } from "./add-node-request";
import { AddPortRequest } from "./add-port-request";
import { AddEdgeRequest } from "./add-edge-request";

/**
 * This entity is responsible for storing state of graph
 */
export class GraphStore {
  private readonly nodes = new Map<unknown, NodePayload>();

  private readonly ports = new Map<unknown, PortPayload>();

  private readonly nodePorts = new Map<unknown, Map<unknown, HTMLElement>>();

  private readonly portNodeId = new Map<unknown, unknown>();

  private readonly edges = new Map<unknown, EdgePayload>();

  private readonly incommingEdges = new Map<unknown, Set<unknown>>();

  private readonly outcommingEdges = new Map<unknown, Set<unknown>>();

  private readonly cycleEdges = new Map<unknown, Set<unknown>>();

  public addNode(request: AddNodeRequest): void {
    this.nodes.set(request.nodeId, {
      element: request.element,
      x: request.x,
      y: request.y,
      centerFn: request.centerFn,
      priority: request.priority,
    });

    this.nodePorts.set(request.nodeId, new Map<string, HTMLElement>());
  }

  public getAllNodeIds(): readonly unknown[] {
    return Array.from(this.nodes.keys());
  }

  public getNode(nodeId: unknown): NodePayload | undefined {
    return this.nodes.get(nodeId);
  }

  public removeNode(nodeId: unknown): void {
    this.nodes.delete(nodeId);

    this.nodePorts.delete(nodeId);
  }

  public addPort(request: AddPortRequest): void {
    this.ports.set(request.portId, {
      element: request.element,
      direction: request.direction,
    });

    this.cycleEdges.set(request.portId, new Set());
    this.incommingEdges.set(request.portId, new Set());
    this.outcommingEdges.set(request.portId, new Set());
    this.portNodeId.set(request.portId, request.nodeId);

    this.nodePorts.get(request.nodeId)!.set(request.portId, request.element);
  }

  public getPort(portId: unknown): PortPayload | undefined {
    return this.ports.get(portId);
  }

  public getAllPortIds(): readonly unknown[] {
    return Array.from(this.ports.keys());
  }

  public getNodePortIds(nodeId: unknown): readonly unknown[] | undefined {
    const ports = this.nodePorts.get(nodeId);

    if (ports !== undefined) {
      return Array.from(ports.keys());
    }

    return undefined;
  }

  public getPortNodeId(portId: unknown): unknown | undefined {
    return this.portNodeId.get(portId);
  }

  public removePort(portId: unknown): void {
    const node = this.portNodeId.get(portId)!;

    this.portNodeId.delete(portId);

    this.nodePorts.get(node)!.delete(portId);

    this.ports.delete(portId);
  }

  public addEdge(request: AddEdgeRequest): void {
    this.edges.set(request.edgeId, {
      from: request.from,
      to: request.to,
      shape: request.shape,
      priority: request.priority,
    });

    if (request.from !== request.to) {
      this.outcommingEdges.get(request.from)!.add(request.edgeId);
      this.incommingEdges.get(request.to)!.add(request.edgeId);
    } else {
      this.cycleEdges.get(request.from)!.add(request.edgeId);
    }
  }

  public updateEdgeFrom(edgeId: unknown, from: unknown): void {
    const edge = this.edges.get(edgeId)!;

    this.removeEdge(edgeId);
    this.addEdge({
      edgeId,
      from,
      to: edge.to,
      shape: edge.shape,
      priority: edge.priority,
    });
  }

  public updateEdgeTo(edgeId: unknown, to: unknown): void {
    const edge = this.edges.get(edgeId)!;

    this.removeEdge(edgeId);
    this.addEdge({
      edgeId,
      from: edge.from,
      to,
      shape: edge.shape,
      priority: edge.priority,
    });
  }

  public getAllEdgeIds(): readonly unknown[] {
    return Array.from(this.edges.keys());
  }

  public getEdge(edgeId: unknown): EdgePayload | undefined {
    return this.edges.get(edgeId);
  }

  public removeEdge(edgeId: unknown): void {
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

  public clear(): void {
    this.nodes.clear();

    this.ports.clear();
    this.nodePorts.clear();
    this.portNodeId.clear();

    this.edges.clear();
    this.incommingEdges.clear();
    this.outcommingEdges.clear();
    this.cycleEdges.clear();
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
    const ports = Array.from(this.nodePorts.get(nodeId)!.keys());
    let res: unknown[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortIncomingEdgeIds(portId)];
    });

    return res;
  }

  public getNodeOutcomingEdgeIds(nodeId: unknown): readonly unknown[] {
    const ports = Array.from(this.nodePorts.get(nodeId)!.keys());
    let res: unknown[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortOutcomingEdgeIds(portId)];
    });

    return res;
  }

  public getNodeCycleEdgeIds(nodeId: unknown): readonly unknown[] {
    const ports = Array.from(this.nodePorts.get(nodeId)!.keys());
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
}
