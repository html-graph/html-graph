import { NodeDto } from "@/models/node-dto";
import { EdgeDto } from "@/models/edge-dto";
import { DiContainer } from "@/di-container/di-container";
import { GraphEventType } from "@/models/graph-event";
import { GrabCanvasPayload, GrabNodePayload, MoveGrabPayload } from "@/models/event-payloads";

export class Controller {
    private readonly di: DiContainer;

    grabNode = (payload: GrabNodePayload) => {
        this.di.mouseState.setNodeMouseDownCoords(payload.nodeMouseX, payload.nodeMouseY);
        this.di.grabbedNodeState.grabNode(payload.nodeId);

        const node = this.di.graphStore.getNode(payload.nodeId);

        if (node !== null) {
            node.moveOnTop();
        }
    }

    grabCanvas = (payload: GrabCanvasPayload) => {
        this.di.htmlView.setGrabCursor();
        this.di.mouseState.setMouseDownCoords(payload.mouseX, payload.mouseY);
    }

    moveGrab = (payload: MoveGrabPayload) => {
        const nodeMouseDownCoords = this.di.mouseState.getNodeMouseDownCoords();

        if (nodeMouseDownCoords === null) {
            return;
        }

        const nodeId = this.di.grabbedNodeState.getGrabbedNodeId();

        const nodeX = payload.mouseX - nodeMouseDownCoords.x;
        const nodeY = payload.mouseY - nodeMouseDownCoords.y;

        if (nodeId === null) {
            //
        } else {
            const node = this.di.graphStore.getNode(nodeId);

            if (node) {
                node.moveTo(nodeX, nodeY);
            }
        }
    }

    releaseGrab = () => {
        this.di.htmlView.setDefaultCursor();
        this.di.mouseState.releaseMouse();
        this.di.grabbedNodeState.releaseNode();
    }

    constructor(canvasWrapper: HTMLElement) {
        this.di = new DiContainer(canvasWrapper);

        this.di.eventSubject.on(GraphEventType.GrabNode, this.grabNode);
        this.di.eventSubject.on(GraphEventType.GrabCanvas, this.grabCanvas);
        this.di.eventSubject.on(GraphEventType.MoveGrab, this.moveGrab);
        this.di.eventSubject.on(GraphEventType.ReleaseGrab, this.releaseGrab);
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
