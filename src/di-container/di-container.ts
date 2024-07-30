import { CommandsQueue } from "@/commands-queue/commands-queue";
import { EventSubject } from "@/event-subject/event-subject";
import { GrabbedNodeState } from "@/grabbed-node-state/grabbed-node-state";
import { GraphStore } from "@/graph-store/graph-store";
import { HtmlView } from "@/html-view/html-view";
import { MouseState } from "@/mouse-state/mouse-state";

export class DiContainer {
    readonly graphStore: GraphStore;

    readonly eventSubject: EventSubject;

    readonly mouseState: MouseState;

    readonly grabbedNodeState: GrabbedNodeState;

    readonly htmlView: HtmlView;

    readonly commandsQueue: CommandsQueue;

    constructor() {
        this.graphStore = new GraphStore(this);

        this.eventSubject = new EventSubject(this);

        this.mouseState = new MouseState(this);

        this.grabbedNodeState = new GrabbedNodeState(this);

        this.htmlView = new HtmlView(this);

        this.commandsQueue = new CommandsQueue(this);
    }
}
