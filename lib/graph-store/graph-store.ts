import { CenterFn } from "@/center-fn";
import { EdgeController } from "@/edges";
import { EdgePayload } from "./edge-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "@/port-payload";

export class GraphStore {
  private nodes: Record<string, NodePayload> = Object.create(null);

  private ports: Record<string, PortPayload> = Object.create(null);

  private nodePorts: Record<string, Record<string, HTMLElement>> =
    Object.create(null);

  private portNodeId: Record<string, string> = Object.create(null);

  private edges: Record<string, EdgePayload> = Object.create(null);

  private incommingEdges: Record<string, Record<string, true>> =
    Object.create(null);

  private outcommingEdges: Record<string, Record<string, true>> =
    Object.create(null);

  private cycleEdges: Record<string, Record<string, true>> =
    Object.create(null);

  public addNode(
    nodeId: string,
    element: HTMLElement,
    x: number,
    y: number,
    centerFn: CenterFn,
  ): void {
    this.nodes[nodeId] = { element, x, y, centerFn };
    this.nodePorts[nodeId] = Object.create(null);
  }

  public hasNode(nodeId: string): boolean {
    return this.nodes[nodeId] !== undefined;
  }

  public getNode(nodeId: string): NodePayload {
    return this.nodes[nodeId];
  }

  public updateNodeCoords(nodeId: string, x: number, y: number): void {
    this.nodes[nodeId].x = x;
    this.nodes[nodeId].y = y;
  }

  public updateEdgeController(
    edgeId: string,
    controller: EdgeController,
  ): void {
    this.edges[edgeId].controller = controller;
  }

  public removeNode(nodeId: string): void {
    const edges = this.getNodeAdjacentEdges(nodeId);

    edges.forEach((edgeId) => {
      this.removeEdge(edgeId);
    });

    delete this.nodes[nodeId];
    const ports = this.nodePorts[nodeId];

    Object.keys(ports).forEach((port) => {
      delete this.portNodeId[port];
    });

    delete this.nodePorts[nodeId];
  }

  public addPort(
    portId: string,
    element: HTMLElement,
    nodeId: string,
    centerFn: CenterFn,
    dir: number,
  ): void {
    this.ports[portId] = { element, centerFn, direction: dir };
    this.cycleEdges[portId] = {};
    this.incommingEdges[portId] = {};
    this.outcommingEdges[portId] = {};
    this.portNodeId[portId] = nodeId;

    const ports = this.nodePorts[nodeId];

    if (ports !== undefined) {
      ports[portId] = element;
    }
  }

  public getPort(portId: string): PortPayload {
    return this.ports[portId];
  }

  public getPortNode(portId: string): string {
    return this.portNodeId[portId];
  }

  public hasPort(portId: string): boolean {
    return this.portNodeId[portId] !== undefined;
  }

  public removePort(portId: string): void {
    Object.keys(this.cycleEdges[portId]).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
    delete this.cycleEdges[portId];

    Object.keys(this.incommingEdges[portId]).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
    delete this.incommingEdges[portId];

    Object.keys(this.outcommingEdges[portId]).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
    delete this.outcommingEdges[portId];

    const node = this.portNodeId[portId];

    delete this.portNodeId[portId];

    const ports = this.nodePorts[node];

    delete ports[portId];

    delete this.ports[portId];
  }

  public addEdge(
    edgeId: string,
    fromPortId: string,
    toPortId: string,
    svgController: EdgeController,
  ): void {
    this.edges[edgeId] = {
      from: fromPortId,
      to: toPortId,
      controller: svgController,
    };

    if (fromPortId !== toPortId) {
      this.outcommingEdges[fromPortId][edgeId] = true;
      this.incommingEdges[toPortId][edgeId] = true;
    } else {
      this.cycleEdges[fromPortId][edgeId] = true;
    }
  }

  public getEdge(edgeId: string): EdgePayload {
    return this.edges[edgeId];
  }

  public hasEdge(edgeId: string): boolean {
    return this.edges[edgeId] !== undefined;
  }

  public removeEdge(edgeId: string): void {
    const edge = this.edges[edgeId];
    const portFromId = edge.from;
    const portToId = edge.to;

    delete this.cycleEdges[portFromId][edgeId];
    delete this.cycleEdges[portToId][edgeId];
    delete this.incommingEdges[portFromId][edgeId];
    delete this.incommingEdges[portToId][edgeId];
    delete this.outcommingEdges[portFromId][edgeId];
    delete this.outcommingEdges[portToId][edgeId];

    delete this.edges[edgeId];
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
    this.nodes = Object.create(null);
    this.ports = Object.create(null);
    this.nodePorts = Object.create(null);
    this.portNodeId = Object.create(null);
    this.edges = Object.create(null);
    this.incommingEdges = Object.create(null);
    this.outcommingEdges = Object.create(null);
    this.cycleEdges = Object.create(null);
  }

  private getPortIncomingEdges(portId: string): readonly string[] {
    return Object.keys(this.incommingEdges[portId] ?? {});
  }

  private getPortOutcomingEdges(portId: string): readonly string[] {
    return Object.keys(this.outcommingEdges[portId] ?? {});
  }

  private getPortCycleEdges(portId: string): readonly string[] {
    return Object.keys(this.cycleEdges[portId] ?? {});
  }

  private getNodeIncomingEdges(nodeId: string): readonly string[] {
    const ports = Object.keys(this.nodePorts[nodeId]);
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortIncomingEdges(portId)];
    });

    return res;
  }

  private getNodeOutcomingEdges(nodeId: string): readonly string[] {
    const ports = Object.keys(this.nodePorts[nodeId]);
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortOutcomingEdges(portId)];
    });

    return res;
  }

  private getNodeCycleEdges(nodeId: string): readonly string[] {
    const ports = Object.keys(this.nodePorts[nodeId]);
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortCycleEdges(portId)];
    });

    return res;
  }
}
