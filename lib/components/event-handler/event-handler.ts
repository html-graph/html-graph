import { GraphEventType } from "../../models/events/graph-event-type";
import { DiContainer } from "../di-container/di-container";

export class EventHandler {
  constructor(private readonly di: DiContainer) {
    this.di.eventSubject.on(GraphEventType.GrabViewport, () => {
      this.di.controller.grabViewport();
    });

    this.di.eventSubject.on(GraphEventType.DragViewport, (payload) => {
      this.di.controller.dragViewport(payload.dx, payload.dy);
    });

    this.di.eventSubject.on(GraphEventType.ScaleViewport, (payload) => {
      this.di.controller.scaleCanvas(
        payload.deltaY,
        payload.centerX,
        payload.centerY,
      );
    });

    this.di.eventSubject.on(GraphEventType.GrabNode, (payload) => {
      this.di.controller.grabNode(payload.nodeId);
    });

    this.di.eventSubject.on(GraphEventType.DragNode, (payload) => {
      this.di.controller.dragNode(payload.nodeId, payload.dx, payload.dy);
    });

    this.di.eventSubject.on(GraphEventType.Release, () => {
      this.di.controller.release();
    });
  }
}
