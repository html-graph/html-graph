import { CenterFn } from "@/center-fn";
import { EdgeShape } from "@/edges";
import { EdgePayload } from "./edge-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "./port-payload";

export class GraphStore {
  private readonly nodes = new Map<unknown, NodePayload>();

  private readonly ports = new Map<unknown, PortPayload>();

  private readonly nodePorts = new Map<unknown, Map<unknown, HTMLElement>>();

  private readonly portNodeId = new Map<unknown, unknown>();

  private readonly edges = new Map<unknown, EdgePayload>();

  private readonly incommingEdges = new Map<unknown, Set<unknown>>();

  private readonly outcommingEdges = new Map<unknown, Set<unknown>>();

  private readonly cycleEdges = new Map<unknown, Set<unknown>>();

  public addNode(
    nodeId: unknown,
    element: HTMLElement,
    x: number,
    y: number,
    centerFn: CenterFn,
    priority: number,
  ): void {
    this.nodes.set(nodeId, { element, x, y, centerFn, priority });
    this.nodePorts.set(nodeId, new Map<string, HTMLElement>());
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

  public addPort(
    portId: unknown,
    element: HTMLElement,
    nodeId: unknown,
    centerFn: CenterFn,
    dir: number,
  ): void {
    this.ports.set(portId, { element, centerFn, direction: dir });
    this.cycleEdges.set(portId, new Set());
    this.incommingEdges.set(portId, new Set());
    this.outcommingEdges.set(portId, new Set());
    this.portNodeId.set(portId, nodeId);

    this.nodePorts.get(nodeId)!.set(portId, element);
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

  public addEdge(
    edgeId: unknown,
    fromPortId: unknown,
    toPortId: unknown,
    shape: EdgeShape,
    priority: number,
  ): void {
    this.edges.set(edgeId, {
      from: fromPortId,
      to: toPortId,
      shape,
      priority,
    });

    if (fromPortId !== toPortId) {
      this.outcommingEdges.get(fromPortId)!.add(edgeId);
      this.incommingEdges.get(toPortId)!.add(edgeId);
    } else {
      this.cycleEdges.get(fromPortId)!.add(edgeId);
    }
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
