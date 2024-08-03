import { CommandsQueue } from "../commands-queue/commands-queue";
import { EventSubject } from "../event-subject/event-subject";
import { GraphController } from "../graph-controller/graph-controller";
import { HtmlView } from "../html-view/html-view";
import { CanvasTransformState } from "../states/canvas-transform-state/canvas-transform-state";
import { GrabbedNodeState } from "../states/grabbed-node-state/grabbed-node-state";
import { MouseState } from "../states/mouse-state/mouse-state";
import { NodeMouseState } from "../states/node-mouse-state/node-mouse-state";

export class DiContainer {
    readonly graphController: GraphController;

    readonly eventSubject: EventSubject;

    readonly mouseState: MouseState;

    readonly nodeMouseState: NodeMouseState;

    readonly grabbedNodeState: GrabbedNodeState;

    readonly canvasTransformState: CanvasTransformState;

    readonly htmlView: HtmlView;

    readonly commandsQueue: CommandsQueue;

    constructor(canvasWrapper: HTMLElement) {
        this.eventSubject = new EventSubject();

        this.mouseState = new MouseState();

        this.nodeMouseState = new NodeMouseState();

        this.grabbedNodeState = new GrabbedNodeState();

        this.canvasTransformState = new CanvasTransformState();

        this.graphController = new GraphController(this);

        this.commandsQueue = new CommandsQueue(this);

        this.htmlView = new HtmlView(this, canvasWrapper);
    }
}
