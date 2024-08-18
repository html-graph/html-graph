import { DiContainer } from "../di-container/di-container";

export class Controller {
    constructor(
        private readonly di: DiContainer
    ) { }

    grabViewport(): void {
        this.di.htmlController.setCursor('grab');
    }

    dragViewport(dx: number, dy: number): void {
        this.di.viewportTransformer.applyShift(-dx, -dy);
        this.di.htmlController.applyTransform();
    }

    releaseViewport(): void {
        this.di.htmlController.setCursor('default');
    }

    scaleCanvas(deltaY: number, centerX: number, centerY: number): void {
        const scaleVelocity = this.di.options.scale.velocity;
        const velocity = deltaY < 0 ? scaleVelocity : (1 / scaleVelocity);

        this.di.viewportTransformer.applyScale(
            1 / velocity,
            centerX,
            centerY,
        );

        this.di.htmlController.applyTransform();
    }

    addNode(id: string, html: HTMLElement, x: number, y: number): void {
        this.di.htmlController.addNode(id, html, x, y);
    }

    destroy(): void {
        this.di.htmlController.destroy();
    }
}
