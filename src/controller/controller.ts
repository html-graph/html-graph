import { NodeDto } from "@/models/node-dto";
import { EdgeDto } from "@/models/edge-dto";
import { GraphEventType } from "@/models/graph-event";
import { DiContainer } from "@/di-container/di-container";
import { GrabCanvasPayload, GrabNodePayload, MoveGrabPayload } from "@/models/event-payloads";

export class Controller {
    private readonly di = new DiContainer();

    private onGrabCanvas = (payload: GrabCanvasPayload) => {
        this.di.htmlView.setGrabCursor();
        this.di.mouseState.setMouseDownCoords(payload.mouseX, payload.mouseY);
    }

    private onReleaseGrab = () => {
        this.di.htmlView.setDefaultCursor();
        this.di.mouseState.releaseMouse();
        this.di.grabbedNodeState.releaseNode();
    }

    private onGrabNode = (payload: GrabNodePayload) => {
        this.di.mouseState.setMouseDownCoords(payload.mouseX, payload.mouseY);
        this.di.grabbedNodeState.grabNode(payload.nodeId);
        this.di.htmlView.moveNodeOnTop(payload.nodeId);
    }

    private onMoveGrab = (payload: MoveGrabPayload) => {
        const mouseCoords = this.di.mouseState.getMouseDownCoords();

        if (mouseCoords === null) {
            return;
        }

        const nodeId = this.di.grabbedNodeState.getGrabbedNodeId();

        if (nodeId === null) {
            return;
        }

        const node = this.di.graphStore.getNode(nodeId);

        if (node) {
            const x = payload.mouseX - mouseCoords.x;
            const y = payload.mouseY - mouseCoords.y;

            this.di.htmlView.updateLines(node.id, x, y);
        }
    }

    constructor(
        private readonly canvasWrapper: HTMLElement
    ) {
        this.canvasWrapper.appendChild(this.di.htmlView.getHost());

        this.di.eventSubject.on(GraphEventType.GrabCanvas, this.onGrabCanvas);
        this.di.eventSubject.on(GraphEventType.ReleaseGrab, this.onReleaseGrab);
        this.di.eventSubject.on(GraphEventType.MoveGrab, this.onMoveGrab);
        this.di.eventSubject.on(GraphEventType.GrabNode, this.onGrabNode);
    }

    addNode(req: NodeDto): void {
        this.di.commandsQueue.addNode(req);
    }

    connectNodes(req: EdgeDto): void {
        this.di.commandsQueue.connectNodes(req);
    }

    flush(): void {
        this.di.commandsQueue.flush();
    }
}
