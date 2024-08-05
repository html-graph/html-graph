export class GrabbedNodeState {
    private grabbedNodeId: string | null = null;

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
