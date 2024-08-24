import { GraphEventType } from "./graph-event-type";

export type GraphEvent = {
    type: GraphEventType.GrabViewport;
} | {
    type: GraphEventType.DragViewport;
    payload: {
        dx: number;
        dy: number;
    };
} | {
    type: GraphEventType.Release;
} | {
    type: GraphEventType.ScaleViewport;
    payload: {
        deltaY: number;
        centerX: number;
        centerY: number;
    };
} | {
    type: GraphEventType.GrabNode;
    payload: {
        nodeId: string;
    };
} | {
    type: GraphEventType.DragNode;
    payload: {
        nodeId: string;
        dx: number;
        dy: number;
    };
};
