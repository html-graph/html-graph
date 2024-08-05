import { GraphEventType } from "./graph-event-type";

export interface HostElementResizePayload {
    newWidth: number;
    newHeight: number;
}

export type GraphEvent = {
    type: GraphEventType.HostElementResize;
    payload: HostElementResizePayload;
}
