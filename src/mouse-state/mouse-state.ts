import { DiContainer } from "@/di-container/di-container";

export class MouseState {
    private mouseDownCoords: { x: number, y: number } | null = null;

    constructor(
        private readonly di: DiContainer
    ) { }

    setMouseDownCoords(x: number, y: number): void {
        this.mouseDownCoords = { x, y };
    }

    getMouseDownCoords(): { x: number, y: number } | null {
        return this.mouseDownCoords;
    }

    releaseMouse(): void {
        this.mouseDownCoords = null;
    }
}
