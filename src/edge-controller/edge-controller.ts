import { DiContainer } from "@/di-container/di-container";

export class EdgeController {
    constructor(
        private readonly di: DiContainer,
        private readonly id: string,
        private readonly from: string,
        private readonly to: string,
    ) {
        const fromNode = this.di.graphController.getNode(this.from);
        const toNode = this.di.graphController.getNode(this.to);

        if (fromNode && toNode) {
            this.di.htmlView.appendEdge(this.id, fromNode.centerX, fromNode.centerY, toNode.centerX, toNode.centerY);
        }
    }

    updatePosition(): void {
        const from = this.di.graphController.getNode(this.from);
        const to = this.di.graphController.getNode(this.to);

        if (from && to) {
            this.di.htmlView.moveEdgeTo(this.id, from.centerX, from.centerY, to.centerX, to.centerY);
        }
    }
}
