import { DiContainer } from "@/di-container/di-container";
import { GraphEventType } from "@/event-subject/models/graph-event-type";

export class Canvas {
    private readonly di = new DiContainer(this.canvasWrapper);

    constructor(
        private readonly canvasWrapper: HTMLElement
    ) {
        this.di.eventSubject.on(GraphEventType.HostElementResize, (payload) => {
            this.di.htmlController.redraw();
        })
    }

    destroy(): void {
        this.di.htmlController.destroy();
    }
}
