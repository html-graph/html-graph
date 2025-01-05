import { CenterFn } from "@/center-fn";
import { EdgeController } from "@/edges";
import { EdgePayload } from "./edge-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "@/port-payload";

export class GraphStore {
  private readonly nodes = new Map<string, NodePayload>();

  private readonly ports = new Map<string, PortPayload>();

  private readonly nodePorts = new Map<string, Map<string, HTMLElement>>();

  private readonly portNodeId = new Map<string, string>();

  private readonly edges = new Map<string, EdgePayload>();

  private readonly incommingEdges = new Map<string, Set<string>>();

  private readonly outcommingEdges = new Map<string, Set<string>>();

  private readonly cycleEdges = new Map<string, Set<string>>();

  public addNode(
    nodeId: string,
    element: HTMLElement,
    x: number,
    y: number,
    centerFn: CenterFn,
    priority: number,
  ): void {
    this.nodes.set(nodeId, { element, x, y, centerFn, priority });
    this.nodePorts.set(nodeId, new Map<string, HTMLElement>());
  }

  public getNode(nodeId: string): NodePayload | undefined {
    return this.nodes.get(nodeId);
  }

  public removeNode(nodeId: string): void {
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
    portId: string,
    element: HTMLElement,
    nodeId: string,
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

  public getPort(portId: string): PortPayload | undefined {
    return this.ports.get(portId);
  }

  public getPortNode(portId: string): string | undefined {
    return this.portNodeId.get(portId);
  }

  public removePort(portId: string): void {
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
    edgeId: string,
    fromPortId: string,
    toPortId: string,
    svgController: EdgeController,
    priority: number,
  ): void {
    this.edges.set(edgeId, {
      from: fromPortId,
      to: toPortId,
      controller: svgController,
      priority,
    });

    if (fromPortId !== toPortId) {
      this.outcommingEdges.get(fromPortId)!.add(edgeId);
      this.incommingEdges.get(toPortId)!.add(edgeId);
    } else {
      this.cycleEdges.get(fromPortId)!.add(edgeId);
    }
  }

  public getEdge(edgeId: string): EdgePayload | undefined {
    return this.edges.get(edgeId);
  }

  public removeEdge(edgeId: string): void {
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

  public getPortAdjacentEdges(portId: string): readonly string[] {
    return [
      ...this.getPortIncomingEdges(portId),
      ...this.getPortOutcomingEdges(portId),
      ...this.getPortCycleEdges(portId),
    ];
  }

  public getNodeAdjacentEdges(nodeId: string): readonly string[] {
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

  private getPortIncomingEdges(portId: string): readonly string[] {
    return Array.from(this.incommingEdges.get(portId)!);
  }

  private getPortOutcomingEdges(portId: string): readonly string[] {
    return Array.from(this.outcommingEdges.get(portId)!);
  }

  private getPortCycleEdges(portId: string): readonly string[] {
    return Array.from(this.cycleEdges.get(portId)!);
  }

  private getNodeIncomingEdges(nodeId: string): readonly string[] {
    const ports = Array.from(this.nodePorts.get(nodeId)!.keys());
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortIncomingEdges(portId)];
    });

    return res;
  }

  private getNodeOutcomingEdges(nodeId: string): readonly string[] {
    const ports = Array.from(this.nodePorts.get(nodeId)!.keys());
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortOutcomingEdges(portId)];
    });

    return res;
  }

  private getNodeCycleEdges(nodeId: string): readonly string[] {
    const ports = Array.from(this.nodePorts.get(nodeId)!.keys());
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortCycleEdges(portId)];
    });

    return res;
  }
}
