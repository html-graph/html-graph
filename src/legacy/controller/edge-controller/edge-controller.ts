import { DiContainer } from "../di-container/di-container";
import { NodeController } from "../node-controller/node-controller";

export class EdgeController {
    constructor(
        private readonly di: DiContainer,
        private readonly id: string,
        private readonly from: NodeController,
        private readonly to: NodeController,
    ) {
        this.di.htmlView.appendEdge(this.id, this.from.centerX, this.from.centerY, this.to.centerX, this.to.centerY);
    }

    updatePosition(): void {
        this.di.htmlView.moveEdgeTo(this.id, this.from.centerX, this.from.centerY, this.to.centerX, this.to.centerY);
    }

    updateTransform(dx: number, dy: number, scale: number): void {
        this.di.htmlView.updateEdgeTransform(this.id, dx, dy, scale);
    }
}
