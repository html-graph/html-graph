import { NodeDto } from "@/models/node-dto";
import { EdgeDto } from "@/models/edge-dto";

export class GraphStore {
    private nodes: Map<string, NodeDto> = new Map<string, NodeDto>();

    private edges: Map<string, EdgeDto> = new Map<string, EdgeDto>();

    private incomingEdgesMap = new Map<string, EdgeDto[]>();

    private outcomingEdgesMap = new Map<string, EdgeDto[]>();

    private circularEdgesMap = new Map<string, EdgeDto[]>();

    addNode(req: NodeDto): void {
        this.nodes.set(req.id, req);
    }

    addEdge(req: EdgeDto): void {
        this.edges.set(req.id, req);

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

    getNode(nodeId: string): NodeDto | null {
        return this.nodes.get(nodeId) ?? null;
    }

    getEdge(edgeId: string): EdgeDto | null {
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
