import { DiContainer } from "@/di-container/di-container";

export class EdgeController {
    constructor(
        private readonly di: DiContainer,
        private readonly id: string,
        private readonly from: string,
        private readonly to: string,
    ) {
        const fromNode = this.di.graphStore.getNode(this.from);
        const toNode = this.di.graphStore.getNode(this.to);

        if (fromNode && toNode) {
            this.di.htmlView.appendLine(this.id, fromNode.x, fromNode.y, toNode.x, toNode.y);
        }
    }
}
