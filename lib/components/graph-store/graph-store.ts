import { CenterFn } from "../../models/center/center-fn";
import { ConnectionController } from "../../models/connection/connection-controller";
import { ConnectionPayload } from "../../models/connection/connection-payload";
import { NodePayload } from "../../models/store/node-payload";
import { PortPayload } from "../../models/store/port-payload";

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

  addNode(
    nodeId: string,
    element: HTMLElement,
    x: number,
    y: number,
    centerFn: CenterFn,
  ): void {
    this.nodes[nodeId] = { element, x, y, centerFn };
    this.nodePorts[nodeId] = Object.create(null);
  }

  hasNode(nodeId: string): boolean {
    return this.nodes[nodeId] !== undefined;
  }

  getNode(nodeId: string): NodePayload {
    return this.nodes[nodeId];
  }

  updateNodeCoords(nodeId: string, x: number, y: number): void {
    this.nodes[nodeId].x = x;
    this.nodes[nodeId].y = y;
  }

  removeNode(nodeId: string): void {
    const connections = this.getAllAdjacentToNodeConnections(nodeId);

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

  addPort(
    portId: string,
    element: HTMLElement,
    nodeId: string,
    centerFn: CenterFn,
    dir: number | null,
  ): void {
    this.ports[portId] = { element, centerFn, dir };
    this.cycleConnections[portId] = {};
    this.incommingConnections[portId] = {};
    this.outcommingConnections[portId] = {};
    this.portNodeId[portId] = nodeId;

    const ports = this.nodePorts[nodeId];

    if (ports !== undefined) {
      ports[portId] = element;
    }
  }

  getPort(portId: string): PortPayload {
    return this.ports[portId];
  }

  hasPort(portId: string): boolean {
    return this.portNodeId[portId] !== undefined;
  }

  removePort(portId: string): void {
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

  addConnection(
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

  getConnection(connectionId: string): ConnectionPayload {
    return this.connections[connectionId];
  }

  removeConnection(connectionId: string): void {
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

  getAllAdjacentToNodeConnections(nodeId: string): readonly string[] {
    const ports = Object.keys(this.nodePorts[nodeId]);
    let res: string[] = [];

    ports.forEach((portId) => {
      res = [...res, ...this.getAllAdjacentToPortConnections(portId)];
    });

    return res;
  }

  getAllAdjacentToPortConnections(portId: string): readonly string[] {
    let res: string[] = [];

    if (this.cycleConnections[portId] !== undefined) {
      res = [...res, ...Object.keys(this.cycleConnections[portId])];
    }

    if (this.incommingConnections[portId] !== undefined) {
      res = [...res, ...Object.keys(this.incommingConnections[portId])];
    }

    if (this.outcommingConnections[portId] !== undefined) {
      res = [...res, ...Object.keys(this.outcommingConnections[portId])];
    }

    return res;
  }

  clear(): void {
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
