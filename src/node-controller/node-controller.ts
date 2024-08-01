import { DiContainer } from "@/di-container/di-container";

export class NodeController {
    constructor(
        private readonly di: DiContainer,
        private readonly id: string,
        private readonly el: HTMLElement,
        private _x: number,
        private _y: number,
    ) {
        this.di.htmlView.appendNode(this.id, this.el, this._x, this._y);
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    moveOnTop(): void {
        this.di.htmlView.moveNodeOnTop(this.id);
    }

    moveTo(x: number, y: number): void {
        this.di.htmlView.moveNodeTo(this.id, x, y);

        this._x = x;
        this._y = y;

        this.di.graphStore.getAdjacentEdges(this.id).forEach(edge => {
            const from = this.di.graphStore.getNode(edge.from);
            const to = this.di.graphStore.getNode(edge.to);

            if (from && to) {
                this.di.htmlView.moveEdgeTo(edge.id, from.x, from.y, to.x, to.y);
            }
        });
    }
}
