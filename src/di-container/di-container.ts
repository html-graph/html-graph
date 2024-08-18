import { EventHandler } from "@/event-handler/event-handler";
import { EventSubject } from "@/event-subject/event-subject";
import { HtmlController } from "@/html-controller/html-controller";
import { Options } from "@/models/options";
import { ViewportTransformer } from "@/viewport-transformer/viewport-transformer";

export class DiContainer {
    readonly htmlController: HtmlController;

    readonly eventSubject: EventSubject;

    readonly eventHandler: EventHandler;

    readonly viewportTransformer: ViewportTransformer;

    constructor(canvasWrapper: HTMLElement, readonly options: Options) {
        this.htmlController = new HtmlController(canvasWrapper, this);

        this.eventSubject = new EventSubject();

        this.eventHandler = new EventHandler(this);

        this.viewportTransformer = new ViewportTransformer();
    }
}
