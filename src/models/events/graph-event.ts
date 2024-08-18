import { GraphEventType } from "./graph-event-type";

export type GraphEvent = {
    type: GraphEventType.CanvasGrab;
} | {
    type: GraphEventType.CanvasDrag;
    payload: {
        dx: number;
        dy: number;
    };
} | {
    type: GraphEventType.CanvasRelease;
} | {
    type: GraphEventType.CanvasScale;
    payload: {
        deltaY: number;
        centerX: number;
        centerY: number;
    }
};
