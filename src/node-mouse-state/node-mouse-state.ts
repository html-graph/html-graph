export class NodeMouseState {
    private nodeMouseDownCoords: { x: number, y: number } | null = null;

    setNodeMouseDownCoords(x: number, y: number): void {
        this.nodeMouseDownCoords = { x, y };
    }

    getNodeMouseDownCoords(): { x: number, y: number } | null {
        return this.nodeMouseDownCoords;
    }

    releaseMouse(): void {
        this.nodeMouseDownCoords = null;
    }
}
