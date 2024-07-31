import { GraphEventType } from "@/models/graph-event";
import { DiContainer } from "@/di-container/di-container";
import { GrabCanvasPayload, GrabNodePayload, MoveGrabPayload } from "@/models/event-payloads";

export class EventHandler {
    constructor(
        private readonly di: DiContainer,
    ) { 
        this.di.eventSubject.on(GraphEventType.GrabNode, this.onGrabNode);
        this.di.eventSubject.on(GraphEventType.GrabCanvas, this.onGrabCanvas);
        this.di.eventSubject.on(GraphEventType.MoveGrab, this.onMoveGrab);
        this.di.eventSubject.on(GraphEventType.ReleaseGrab, this.onReleaseGrab);
    }

    private onGrabNode = (payload: GrabNodePayload) => {
        this.di.mouseState.setMouseDownCoords(payload.mouseX, payload.mouseY);
        this.di.grabbedNodeState.grabNode(payload.nodeId);
        this.di.htmlView.moveNodeOnTop(payload.nodeId);
    }

    private onGrabCanvas = (payload: GrabCanvasPayload) => {
        this.di.htmlView.setGrabCursor();
        this.di.mouseState.setMouseDownCoords(payload.mouseX, payload.mouseY);
    }

    private onMoveGrab = (payload: MoveGrabPayload) => {
        const mouseCoords = this.di.mouseState.getMouseDownCoords();

        if (mouseCoords === null) {
            return;
        }

        const nodeId = this.di.grabbedNodeState.getGrabbedNodeId();

        const x = payload.mouseX - mouseCoords.x;
        const y = payload.mouseY - mouseCoords.y;

        if (nodeId === null) {
            //
        } else {
            this.di.htmlView.moveNodeTo(nodeId, x, y);
        }
    }

    private onReleaseGrab = () => {
        this.di.htmlView.setDefaultCursor();
        this.di.mouseState.releaseMouse();
        this.di.grabbedNodeState.releaseNode();
    }
}
