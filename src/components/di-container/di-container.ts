import { Options } from "@/models/options/options";
import { HtmlController } from "../html-controller/html-controller";
import { EventSubject } from "../event-subject/event-subject";
import { EventHandler } from "../event-handler/event-handler";
import { ViewportTransformer } from "../viewport-transformer/viewport-transformer";
import { PublicViewportTransformer } from "../public-viewport-transformer/public-viewport-transformer";

export class DiContainer {
    readonly htmlController: HtmlController;

    readonly eventSubject: EventSubject;

    readonly eventHandler: EventHandler;

    readonly viewportTransformer: ViewportTransformer;

    readonly publicViewportTransformer: PublicViewportTransformer;

    constructor(canvasWrapper: HTMLElement, readonly options: Options) {
        this.htmlController = new HtmlController(canvasWrapper, this);

        this.eventSubject = new EventSubject();

        this.eventHandler = new EventHandler(this);

        this.viewportTransformer = new ViewportTransformer(this);

        this.publicViewportTransformer = new PublicViewportTransformer(this.viewportTransformer);
    }
}
