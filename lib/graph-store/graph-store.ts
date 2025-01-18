import { CenterFn } from "@/center-fn";
import { EdgeShape } from "@/edges";
import { EdgePayload } from "./edge-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "@/port-payload";

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

  public getAllNodes(): readonly unknown[] {
    return Array.from(this.nodes.keys());
  }

  public getNode(nodeId: unknown): NodePayload | undefined {
    return this.nodes.get(nodeId);
  }

  public getNodePorts(nodeId: unknown): readonly unknown[] | undefined {
    const ports = this.nodePorts.get(nodeId);

    if (ports !== undefined) {
      return Array.from(ports.keys());
    }

    return undefined;
  }

  public removeNode(nodeId: unknown): void {
    const edges = this.getNodeAdjacentEdges(nodeId);

    edges.forEach((edgeId) => {
      this.removeEdge(edgeId);
    });

    this.nodes.delete(nodeId);
    const ports = this.nodePorts.get(nodeId)!;

    ports.forEach((_port, key) => {
      this.portNodeId.delete(key);
    });

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

  public getAllPorts(): readonly unknown[] {
    return Array.from(this.ports.keys());
  }

  public getPort(portId: unknown): PortPayload | undefined {
    return this.ports.get(portId);
  }

  public getPortNode(portId: unknown): unknown | undefined {
    return this.portNodeId.get(portId);
  }

  public removePort(portId: unknown): void {
    this.cycleEdges.get(portId)!.forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
    this.cycleEdges.delete(portId);

    this.incommingEdges.get(portId)!.forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
    this.incommingEdges.delete(portId);

    this.outcommingEdges.get(portId)!.forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
    this.outcommingEdges.get(portId);

    const node = this.portNodeId.get(portId)!;

    this.portNodeId.delete(portId);

    this.nodePorts.get(node)!.delete(portId);

    this.ports.delete(portId);
  }

  public addEdge(
    edgeId: unknown,
    fromPortId: string,
    toPortId: string,
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

  public getAllEdges(): readonly unknown[] {
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

  public getPortAdjacentEdges(portId: unknown): readonly unknown[] {
    return [
      ...this.getPortIncomingEdges(portId),
      ...this.getPortOutcomingEdges(portId),
      ...this.getPortCycleEdges(portId),
    ];
  }

  public getNodeAdjacentEdges(nodeId: unknown): readonly unknown[] {
    return [
      ...this.getNodeIncomingEdges(nodeId),
      ...this.getNodeOutcomingEdges(nodeId),
      ...this.getNodeCycleEdges(nodeId),
    ];
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

  public getPortIncomingEdges(portId: unknown): readonly unknown[] {
    return Array.from(this.incommingEdges.get(portId)!);
  }

  public getPortOutcomingEdges(portId: unknown): readonly unknown[] {
    return Array.from(this.outcommingEdges.get(portId)!);
  }

  public getPortCycleEdges(portId: unknown): readonly unknown[] {
    return Array.from(this.cycleEdges.get(portId)!);
  }

  public getNodeIncomingEdges(nodeId: unknown): readonly unknown[] {
    const ports = Array.from(this.nodePorts.get(nodeId)!.keys());
    let res: unknown[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortIncomingEdges(portId)];
    });

    return res;
  }

  public getNodeOutcomingEdges(nodeId: unknown): readonly unknown[] {
    const ports = Array.from(this.nodePorts.get(nodeId)!.keys());
    let res: unknown[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortOutcomingEdges(portId)];
    });

    return res;
  }

  public getNodeCycleEdges(nodeId: unknown): readonly unknown[] {
    const ports = Array.from(this.nodePorts.get(nodeId)!.keys());
    let res: unknown[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortCycleEdges(portId)];
    });

    return res;
  }
}
