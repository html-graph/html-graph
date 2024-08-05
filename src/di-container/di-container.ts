import { EventSubject } from "@/event-subject/event-subject";
import { HtmlController } from "@/html-controller/html-controller";

export class DiContainer {
    readonly htmlController: HtmlController;

    readonly eventSubject: EventSubject;

    constructor(canvasWrapper: HTMLElement) {
        this.htmlController = new HtmlController(canvasWrapper);

        this.eventSubject = new EventSubject();
    }
}
