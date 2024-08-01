export class MouseState {
    private mouseDownCoords: { x: number, y: number } | null = null;

    private nodeMouseDownCoords: { x: number, y: number } | null = null;

    setMouseDownCoords(x: number, y: number): void {
        this.mouseDownCoords = { x, y };
    }

    setNodeMouseDownCoords(x: number, y: number): void {
        this.nodeMouseDownCoords = { x, y };
    }

    getMouseDownCoords(): { x: number, y: number } | null {
        return this.mouseDownCoords;
    }

    getNodeMouseDownCoords(): { x: number, y: number } | null {
        return this.nodeMouseDownCoords;
    }

    releaseMouse(): void {
        this.mouseDownCoords = null;
        this.nodeMouseDownCoords = null;
    }
}
