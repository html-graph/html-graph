import { NodeDto } from "@/models/node-dto";
import { EdgeDto } from "@/models/edge-dto";
import { DiContainer } from "./di-container/di-container";
import { GrabCanvasPayload, GrabNodePayload, MoveGrabPayload, ScaleCanvasPayload } from "./models/event-payloads";
import { GraphEventType } from "./models/graph-event";

export class Controller {
    private readonly di: DiContainer;

    private readonly grabNode = (payload: GrabNodePayload) => {
        this.di.nodeMouseState.setNodeMouseDownCoords(payload.nodeMouseX, payload.nodeMouseY);
        this.di.grabbedNodeState.grabNode(payload.nodeId);

        const node = this.di.graphController.getNode(payload.nodeId);

        if (node !== null) {
            node.moveOnTop();
        }
    }

    private readonly grabCanvas = (payload: GrabCanvasPayload) => {
        this.di.htmlView.setGrabCursor();
        this.di.mouseState.setMouseDownCoords(payload.mouseX, payload.mouseY);
    }

    private readonly moveGrab = (payload: MoveGrabPayload) => {
        const nodeId = this.di.grabbedNodeState.getGrabbedNodeId();

        if (nodeId === null) {
            const coords = this.di.mouseState.getMouseDownCoords();

            if (coords) {
                const shift = this.di.canvasTransformState.getShift();

                const dx = payload.mouseX - coords.x;
                const dy = payload.mouseY - coords.y;

                this.di.canvasTransformState.setCurrentShift(dx, dy);

                this.di.graphController.setTransformShift(shift.dx + dx, shift.dy + dy)
            }
        } else {
            const nodeMouseDownCoords = this.di.nodeMouseState.getNodeMouseDownCoords();

            if (nodeMouseDownCoords === null) {
                return;
            }

            const nodeX = payload.mouseX - nodeMouseDownCoords.x;
            const nodeY = payload.mouseY - nodeMouseDownCoords.y;

            const node = this.di.graphController.getNode(nodeId);

            if (node) {
                const shift = this.di.canvasTransformState.getShift();

                node.moveTo(nodeX - shift.dx, nodeY - shift.dy);
            }
        }
    }

    private readonly scaleCanvas = (payload: ScaleCanvasPayload) => {
        this.di.canvasTransformState.updateScaleVector(payload.value);
        const scaleFactor = this.di.canvasTransformState.getScaleFactor();

        this.di.graphController.setTransformScale(scaleFactor)
    }

    private readonly releaseGrab = () => {
        this.di.canvasTransformState.releaseCurrentShift();
        this.di.htmlView.setDefaultCursor();
        this.di.mouseState.releaseMouse();
        this.di.nodeMouseState.releaseMouse();
        this.di.grabbedNodeState.releaseNode();
    }

    constructor(canvasWrapper: HTMLElement) {
        this.di = new DiContainer(canvasWrapper);

        this.di.eventSubject.on(GraphEventType.GrabNode, this.grabNode);
        this.di.eventSubject.on(GraphEventType.GrabCanvas, this.grabCanvas);
        this.di.eventSubject.on(GraphEventType.MoveGrab, this.moveGrab);
        this.di.eventSubject.on(GraphEventType.ReleaseGrab, this.releaseGrab);
        this.di.eventSubject.on(GraphEventType.ScaleCanvas, this.scaleCanvas);
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
