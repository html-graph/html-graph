import { EdgePayload } from "@/models/edges/edge-payload";
import { ObjectMap } from "@/models/object-map";
import { NodePayload } from "@/models/store/node-payload";

export class GraphStore {
    private readonly nodes: ObjectMap<NodePayload> = Object.create(null);

    private readonly ports: ObjectMap<HTMLElement> = Object.create(null);

    private readonly nodePorts: ObjectMap<ObjectMap<HTMLElement>> = Object.create(null);

    private readonly portNodeId: ObjectMap<string> = Object.create(null);

    private readonly connections: ObjectMap<EdgePayload> = Object.create(null);

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

    removeNode(nodeId: string): void {
        delete this.nodes[nodeId];
        const ports = this.nodePorts[nodeId];

        Object.keys(ports).forEach(port => {
            delete this.portNodeId[port];
        });

        delete this.nodePorts[nodeId];
    }

    addPort(portId: string, element: HTMLElement, nodeId: string): void {
        this.ports[portId] = element;

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
    }

    addConnection(connectionId: string, fromPortId: string, toPortId: string): void {
        this.connections[connectionId] = { from: fromPortId, to: toPortId };
    }

    getConnection(connectionId: string): EdgePayload {
        return this.connections[connectionId];
    }

    removeConnection(connectionId: string): void {
        delete this.connections[connectionId];
    }
}
