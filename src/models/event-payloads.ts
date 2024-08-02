import { GraphEventType } from "./graph-event"

export interface GrabNodePayload {
    nodeId: string;
    nodeMouseX: number;
    nodeMouseY: number;
}

export interface GrabCanvasPayload {
    mouseX: number;
    mouseY: number;
}

export interface MoveGrabPayload {
    mouseX: number;
    mouseY: number;
}

export interface ScaleCanvasPayload {
    value: -1 | 1;
}

export type GraphEvent =
    {
        type: GraphEventType.GrabNode,
        payload: GrabNodePayload,
    }
    |
    {
        type: GraphEventType.GrabCanvas,
        payload: GrabCanvasPayload,
    }
    |
    {
        type: GraphEventType.MoveGrab,
        payload: MoveGrabPayload,
    }
    |
    {
        type: GraphEventType.ReleaseGrab,
    }
    |
    {
        type: GraphEventType.ScaleCanvas,
        payload: ScaleCanvasPayload,
    }

