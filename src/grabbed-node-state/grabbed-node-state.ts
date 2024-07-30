import { DiContainer } from "@/di-container/di-container";

export class GrabbedNodeState {
    private grabbedNodeId: string | null = null;

    constructor(
        private readonly di: DiContainer
    ) { }

    grabNode(nodeId: string): void {
        this.grabbedNodeId = nodeId;
    }

    getGrabbedNodeId(): string | null {
        return this.grabbedNodeId;
    }

    releaseNode(): void {
        this.grabbedNodeId = null;
    }
}
