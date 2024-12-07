import { CenterFn } from "@/center-fn";
import { ConnectionController } from "@/connections";
import { ConnectionPayload } from "./connection-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "./port-payload";

export class GraphStore {
  private nodes: Record<string, NodePayload> = Object.create(null);

  private ports: Record<string, PortPayload> = Object.create(null);

  private nodePorts: Record<string, Record<string, HTMLElement>> =
    Object.create(null);

  private portNodeId: Record<string, string> = Object.create(null);

  private connections: Record<string, ConnectionPayload> = Object.create(null);

  private incommingConnections: Record<string, Record<string, true>> =
    Object.create(null);

  private outcommingConnections: Record<string, Record<string, true>> =
    Object.create(null);

  private cycleConnections: Record<string, Record<string, true>> =
    Object.create(null);

  public getAllNodes(): readonly string[] {
    return Object.keys(this.nodes);
  }

  public getAllPorts(): readonly string[] {
    return Object.keys(this.ports);
  }

  public getAllConnections(): readonly string[] {
    return Object.keys(this.connections);
  }

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

  public updateConnectionController(
    connectionId: string,
    controller: ConnectionController,
  ): void {
    this.connections[connectionId].controller = controller;
  }

  public removeNode(nodeId: string): void {
    const connections = this.getNodeAdjacentConnections(nodeId);

    connections.forEach((connectionId) => {
      this.removeConnection(connectionId);
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
    dir: number | null,
  ): void {
    this.ports[portId] = { element, centerFn, direction: dir };
    this.cycleConnections[portId] = {};
    this.incommingConnections[portId] = {};
    this.outcommingConnections[portId] = {};
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
    Object.keys(this.cycleConnections[portId]).forEach((connectionId) => {
      this.removeConnection(connectionId);
    });
    delete this.cycleConnections[portId];

    Object.keys(this.incommingConnections[portId]).forEach((connectionId) => {
      this.removeConnection(connectionId);
    });
    delete this.incommingConnections[portId];

    Object.keys(this.outcommingConnections[portId]).forEach((connectionId) => {
      this.removeConnection(connectionId);
    });
    delete this.outcommingConnections[portId];

    const node = this.portNodeId[portId];

    delete this.portNodeId[portId];

    const ports = this.nodePorts[node];

    delete ports[portId];

    delete this.ports[portId];
  }

  public addConnection(
    connectionId: string,
    fromPortId: string,
    toPortId: string,
    svgController: ConnectionController,
  ): void {
    this.connections[connectionId] = {
      from: fromPortId,
      to: toPortId,
      controller: svgController,
    };

    if (fromPortId !== toPortId) {
      this.outcommingConnections[fromPortId][connectionId] = true;
      this.incommingConnections[toPortId][connectionId] = true;
    } else {
      this.cycleConnections[fromPortId][connectionId] = true;
    }
  }

  public getConnection(connectionId: string): ConnectionPayload {
    return this.connections[connectionId];
  }

  public hasConnection(connectionId: string): boolean {
    return this.connections[connectionId] !== undefined;
  }

  public removeConnection(connectionId: string): void {
    const connection = this.connections[connectionId];
    const portFromId = connection.from;
    const portToId = connection.to;

    delete this.cycleConnections[portFromId][connectionId];
    delete this.cycleConnections[portToId][connectionId];
    delete this.incommingConnections[portFromId][connectionId];
    delete this.incommingConnections[portToId][connectionId];
    delete this.outcommingConnections[portFromId][connectionId];
    delete this.outcommingConnections[portToId][connectionId];

    delete this.connections[connectionId];
  }

  public getPortIncomingConnections(portId: string): readonly string[] {
    return Object.keys(this.incommingConnections[portId] ?? {});
  }

  public getPortOutcomingConnections(portId: string): readonly string[] {
    return Object.keys(this.outcommingConnections[portId] ?? {});
  }

  public getPortCycleConnections(portId: string): readonly string[] {
    return Object.keys(this.cycleConnections[portId] ?? {});
  }

  public getPortAdjacentConnections(portId: string): readonly string[] {
    return [
      ...this.getPortIncomingConnections(portId),
      ...this.getPortOutcomingConnections(portId),
      ...this.getPortCycleConnections(portId),
    ];
  }

  public getNodeIncomingConnections(nodeId: string): readonly string[] {
    const ports = Object.keys(this.nodePorts[nodeId]);
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortIncomingConnections(portId)];
    });

    return res;
  }

  public getNodeOutcomingConnections(nodeId: string): readonly string[] {
    const ports = Object.keys(this.nodePorts[nodeId]);
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortOutcomingConnections(portId)];
    });

    return res;
  }

  public getNodeCycleConnections(nodeId: string): readonly string[] {
    const ports = Object.keys(this.nodePorts[nodeId]);
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getPortCycleConnections(portId)];
    });

    return res;
  }

  public getNodeAdjacentConnections(nodeId: string): readonly string[] {
    return [
      ...this.getNodeIncomingConnections(nodeId),
      ...this.getNodeOutcomingConnections(nodeId),
      ...this.getNodeCycleConnections(nodeId),
    ];
  }

  public clear(): void {
    this.nodes = Object.create(null);
    this.ports = Object.create(null);
    this.nodePorts = Object.create(null);
    this.portNodeId = Object.create(null);
    this.connections = Object.create(null);
    this.incommingConnections = Object.create(null);
    this.outcommingConnections = Object.create(null);
    this.cycleConnections = Object.create(null);
  }
}
