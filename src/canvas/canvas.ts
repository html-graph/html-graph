import { DiContainer } from "@/di-container/di-container";

export class Canvas {
    private readonly di = new DiContainer(this.canvasWrapper);

    constructor(
        private readonly canvasWrapper: HTMLElement
    ) { }

    destroy(): void {
        this.di.htmlController.destroy();
    }
}
