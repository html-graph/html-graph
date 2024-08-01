import { NodeDto } from "@/models/node-dto";
import { EdgeDto } from "@/models/edge-dto";
import { DiContainer } from "@/di-container/di-container";
import { NodeController } from "@/node-controller/node-controller";
import { EdgeController } from "@/edge-controller/edge-controller";

export class GraphStore {
    private nodes: Map<string, NodeController> = new Map<string, NodeController>();

    private edges: Map<string, EdgeController> = new Map<string, EdgeController>();

    private incomingEdgesMap = new Map<string, EdgeDto[]>();

    private outcomingEdgesMap = new Map<string, EdgeDto[]>();

    private circularEdgesMap = new Map<string, EdgeDto[]>();

    constructor(
        private readonly di: DiContainer,
    ) { }

    addNode(req: NodeDto): void {
        this.nodes.set(req.id, new NodeController(this.di, req.id, req.el, req.x, req.y));
    }

    addEdge(req: EdgeDto): void {
        this.edges.set(req.id, new EdgeController(this.di, req.id, req.from, req.to));

        if (req.from === req.to) {
            const circularEdges = this.circularEdgesMap.get(req.to);

            if (circularEdges !== undefined) {
                circularEdges.push(req);
            } else {
                this.circularEdgesMap.set(req.from, [req])
            }

            return;
        }

        const incomingEdges = this.incomingEdgesMap.get(req.to);

        if (incomingEdges !== undefined) {
            incomingEdges.push(req);
        } else {
            this.incomingEdgesMap.set(req.to, [req])
        }

        const outcomingEdges = this.outcomingEdgesMap.get(req.from);

        if (outcomingEdges !== undefined) {
            outcomingEdges.push(req)
        } else {
            this.outcomingEdgesMap.set(req.from, [req])
        }
    }

    getNode(nodeId: string): NodeController | null {
        return this.nodes.get(nodeId) ?? null;
    }

    getEdge(edgeId: string): EdgeController | null {
        return this.edges.get(edgeId) ?? null;
    }

    getIncomingEdges(nodeId: string): readonly EdgeDto[] {
        return this.incomingEdgesMap.get(nodeId) ?? [];
    }

    getOutcomingEdges(nodeId: string): readonly EdgeDto[] {
        return this.outcomingEdgesMap.get(nodeId) ?? [];
    }

    getCircularEdges(nodeId: string): readonly EdgeDto[] {
        return this.circularEdgesMap.get(nodeId) ?? [];
    }

    getAdjacentEdges(nodeId: string): readonly EdgeDto[] {
        return [
            ...this.getIncomingEdges(nodeId),
            ...this.getOutcomingEdges(nodeId),
            ...this.getCircularEdges(nodeId),
        ];
    }
}
