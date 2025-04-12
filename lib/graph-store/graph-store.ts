import { EdgePayload } from "./edge-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "./port-payload";
import { AddNodeRequest } from "./add-node-request";
import { AddPortRequest } from "./add-port-request";
import { AddEdgeRequest } from "./add-edge-request";
import { UpdateNodeCoordinatesRequest } from "./update-node-coordinates-request";
import { EdgeShape } from "@/edges";

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
  }

  public getAllNodeIds(): readonly unknown[] {
    return Array.from(this.nodes.keys());
  }

  public getNode(nodeId: unknown): NodePayload | undefined {
    return this.nodes.get(nodeId);
  }

  public updateNodeCoordinatesRequest(
    nodeId: unknown,
    request: UpdateNodeCoordinatesRequest,
  ): void {
    const node = this.nodes.get(nodeId)!;

    node.x = request?.x ?? node.x;
    node.y = request?.y ?? node.y;
    node.centerFn = request.centerFn ?? node.centerFn;
  }

  public updateNodePriority(nodeId: unknown, priority: number): void {
    const node = this.nodes.get(nodeId)!;

    node.priority = priority;
  }

  public removeNode(nodeId: unknown): void {
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
  }

  public getPort(portId: unknown): PortPayload | undefined {
    return this.ports.get(portId);
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

  public updatePortDirection(portId: unknown, direction: number): void {
    const port = this.ports.get(portId)!;

    port.direction = direction;
  }

  public removePort(portId: unknown): void {
    const nodeId = this.ports.get(portId)!.nodeId;

    this.nodes.get(nodeId)!.ports.delete(portId);
    this.ports.delete(portId);
  }

  public addEdge(request: AddEdgeRequest): void {
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

  public updateEdgeFrom(edgeId: unknown, from: unknown): void {
    const edge = this.edges.get(edgeId)!;

    this.removeEdge(edgeId);
    this.addEdge({
      id: edgeId,
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
      id: edgeId,
      from: edge.from,
      to,
      shape: edge.shape,
      priority: edge.priority,
    });
  }

  public updateEdgeShape(edgeId: unknown, shape: EdgeShape): void {
    const edge = this.edges.get(edgeId)!;

    edge.shape = shape;
  }

  public updateEdgePriority(edgeId: unknown, priority: number): void {
    const edge = this.edges.get(edgeId)!;

    edge.priority = priority;
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
}
