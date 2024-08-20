import { ObjectMap } from "@/models/object-map";
import { NodePayload } from "@/models/store/node-payload";

export class GraphStore {
    private readonly nodes: ObjectMap<NodePayload> = Object.create(null);

    private readonly ports: ObjectMap<HTMLElement> = Object.create(null);

    private readonly nodePorts: ObjectMap<ObjectMap<HTMLElement>> = Object.create(null);

    private readonly portNodeId: ObjectMap<string> = Object.create(null);

    addNode(nodeId: string, element: HTMLElement, x: number, y: number): void {
        this.nodes[nodeId] = { element, x, y };
        this.nodePorts[nodeId] = Object.create(null);
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
    }

    addPort(portId: string, element: HTMLElement, nodeId: string): void {
        this.ports[portId] = element;

        const ports = this.nodePorts[nodeId];

        if (ports !== undefined) {
            ports[portId] = element;
        }
    }

    removePort(portId: string): void {
        const node = this.portNodeId[portId];

        if (node !== undefined) {
            delete this.portNodeId[portId];

            const ports = this.nodePorts[node];

            delete ports[portId];
        }

        delete this.ports[portId];
    }
}
