import { DiContainer } from "@/di-container/di-container";
import { GraphEventType } from "@/models/graph-event-type";

export class EventHandler {
    constructor(
        private readonly di: DiContainer
    ) {
        this.di.eventSubject.on(GraphEventType.CanvasGrab, () => {
            this.di.htmlController.setCursor('grab');
        });

        this.di.eventSubject.on(GraphEventType.CanvasDrag, (payload) => {
            this.di.viewportTransformer.applyShift(-payload.dx, -payload.dy);
            this.di.htmlController.drawBackground();
        });

        this.di.eventSubject.on(GraphEventType.CanvasRelease, () => {
            this.di.htmlController.setCursor('default');
        });

        this.di.eventSubject.on(GraphEventType.CanvasScale, (payload) => {
            const scaleVelocity = this.di.options.scale.velocity;
            const velocity = payload.deltaY < 0 ? scaleVelocity : (1 / scaleVelocity);

            this.di.viewportTransformer.applyScale(
                1 / velocity,
                payload.centerX,
                payload.centerY,
            );

            this.di.htmlController.drawBackground();
        });
    }
}
