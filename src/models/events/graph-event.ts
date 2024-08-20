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
    type: GraphEventType.ReleaseViewport;
} | {
    type: GraphEventType.ScaleViewport;
    payload: {
        deltaY: number;
        centerX: number;
        centerY: number;
    }
} | {
    type: GraphEventType.GrabNode;
    payload: {
        nodeId: string;
        nodeMouseX: number;
        nodeMouseY: number;
    }
};
