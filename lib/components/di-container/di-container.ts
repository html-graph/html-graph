import { Options } from "../../models/options/options";
import { HtmlController } from "../html-controller/html-controller";
import { EventSubject } from "../event-subject/event-subject";
import { EventHandler } from "../event-handler/event-handler";
import { ViewportTransformer } from "../viewport-transformer/viewport-transformer";
import { PublicViewportTransformer } from "../public-viewport-transformer/public-viewport-transformer";
import { Controller } from "../controller/controller";
import { GraphStore } from "../graph-store/graph-store";
import { IdGenerator } from "../id-generator/id-generator";

export class DiContainer {
  readonly htmlController: HtmlController;

  readonly eventSubject: EventSubject;

  readonly eventHandler: EventHandler;

  readonly viewportTransformer: ViewportTransformer;

  readonly publicViewportTransformer: PublicViewportTransformer;

  readonly controller: Controller;

  readonly graphStore: GraphStore;

  readonly nodeIdGenerator: IdGenerator;

  readonly portIdGenerator: IdGenerator;

  readonly connectionIdGenerator: IdGenerator;

  constructor(
    canvasWrapper: HTMLElement,
    readonly options: Options,
  ) {
    this.htmlController = new HtmlController(canvasWrapper, this);

    this.eventSubject = new EventSubject();

    this.eventHandler = new EventHandler(this);

    this.viewportTransformer = new ViewportTransformer(this);

    this.publicViewportTransformer = new PublicViewportTransformer(
      this.viewportTransformer,
    );

    this.controller = new Controller(this);

    this.graphStore = new GraphStore();

    this.nodeIdGenerator = new IdGenerator();

    this.portIdGenerator = new IdGenerator();

    this.connectionIdGenerator = new IdGenerator();
  }
}
