import { SvgController } from "@/models/connection/svg-controller";
import { EdgePayload } from "@/models/edges/edge-payload";
import { ObjectMap } from "@/models/object-map";
import { NodePayload } from "@/models/store/node-payload";

export class GraphStore {
    private readonly nodes: ObjectMap<NodePayload> = Object.create(null);

    private readonly ports: ObjectMap<HTMLElement> = Object.create(null);

    private readonly nodePorts: ObjectMap<ObjectMap<HTMLElement>> = Object.create(null);

    private readonly portNodeId: ObjectMap<string> = Object.create(null);

    private readonly connections: ObjectMap<EdgePayload> = Object.create(null);

    private readonly incommingConnections: ObjectMap<ObjectMap<true>> = Object.create(null);

    private readonly outcommingConnections: ObjectMap<ObjectMap<true>> = Object.create(null);

    private readonly cycleConnections: ObjectMap<ObjectMap<true>> = Object.create(null);

    addNode(nodeId: string, element: HTMLElement, x: number, y: number): void {
        this.nodes[nodeId] = { element, x, y };
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
        delete this.nodes[nodeId];
        const ports = this.nodePorts[nodeId];

        Object.keys(ports).forEach(port => {
            delete this.portNodeId[port];
        });

        delete this.nodePorts[nodeId];

        const connections = this.getAllConnectionsToNode(nodeId);

        connections.forEach(connectionId => {
            this.removeConnection(connectionId);
        });
    }

    addPort(portId: string, element: HTMLElement, nodeId: string): void {
        this.ports[portId] = element;
        this.cycleConnections[portId] = {};
        this.incommingConnections[portId] = {};
        this.outcommingConnections[portId] = {};

        const ports = this.nodePorts[nodeId];

        if (ports !== undefined) {
            ports[portId] = element;
        }
    }

    getPort(portId: string): HTMLElement {
        return this.ports[portId];
    }

    hasPort(portId: string): boolean {
        return this.portNodeId[portId] !== undefined;
    }

    removePort(portId: string): void {
        const node = this.portNodeId[portId];

        delete this.portNodeId[portId];

        const ports = this.nodePorts[node];

        delete ports[portId];

        delete this.ports[portId];

        Object.keys(this.cycleConnections[portId]).forEach(connectionId => {
            this.removeConnection(connectionId)
        });
        delete this.cycleConnections[portId];

        Object.keys(this.incommingConnections[portId]).forEach(connectionId => {
            this.removeConnection(connectionId)
        });
        delete this.incommingConnections[portId];

        Object.keys(this.outcommingConnections[portId]).forEach(connectionId => {
            this.removeConnection(connectionId)
        });
        delete this.outcommingConnections[portId];
    }

    addConnection(
        connectionId: string,
        fromPortId: string,
        toPortId: string,
        svgController: SvgController,
    ): void {
        this.connections[connectionId] = { from: fromPortId, to: toPortId, svgController };

        if (fromPortId !== toPortId) {
            this.outcommingConnections[fromPortId][connectionId] = true;
            this.incommingConnections[toPortId][connectionId] = true;
        } else {
            this.cycleConnections[fromPortId][connectionId] = true;
        }
    }

    getConnection(connectionId: string): EdgePayload {
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

    getAllConnectionsToNode(nodeId: string): readonly string[] {
        const ports = Object.keys(this.nodePorts[nodeId]);
        let res: string[] = [];

        ports.forEach(port => {
            if (this.cycleConnections[port] !== undefined) {
                res = [...res, ...Object.keys(this.cycleConnections[port])];
            }

            if (this.incommingConnections[port] !== undefined) {
                res = [...res, ...Object.keys(this.incommingConnections[port])];
            }

            if (this.outcommingConnections[port] !== undefined) {
                res = [...res, ...Object.keys(this.outcommingConnections[port])];
            }
        });

        return res;
    }
}
