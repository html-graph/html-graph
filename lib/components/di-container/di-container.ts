import { Options } from "../../models/options/options";
import { HtmlController } from "../html-controller/html-controller";
import { ViewportTransformer } from "../viewport-transformer/viewport-transformer";
import { PublicViewportTransformer } from "../public-viewport-transformer/public-viewport-transformer";
import { Controller } from "../controller/controller";
import { GraphStore } from "../graph-store/graph-store";
import { IdGenerator } from "../id-generator/id-generator";

export class DiContainer {
  readonly htmlController: HtmlController;

  readonly viewportTransformer: ViewportTransformer;

  readonly publicViewportTransformer: PublicViewportTransformer;

  readonly controller: Controller;

  readonly graphStore: GraphStore;

  readonly nodeIdGenerator: IdGenerator;

  readonly portIdGenerator: IdGenerator;

  readonly connectionIdGenerator: IdGenerator;

  constructor(readonly options: Options) {
    this.htmlController = new HtmlController(this);

    this.viewportTransformer = new ViewportTransformer();

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
