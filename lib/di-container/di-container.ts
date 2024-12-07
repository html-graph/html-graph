import { HtmlController } from "../html-controller";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "../viewport-transformer";
import { GraphStore, PublicGraphStore } from "../graph-store";
import { IdGenerator } from "../id-generator";
import { Options } from "../canvas/canvas-core/options";
import { CanvasController } from "../canvas-controller";

export class DiContainer {
  readonly htmlController: HtmlController;

  readonly viewportTransformer: ViewportTransformer;

  readonly publicViewportTransformer: PublicViewportTransformer;

  readonly controller: CanvasController;

  readonly graphStore: GraphStore;

  readonly publicGraphStore: PublicGraphStore;

  readonly nodeIdGenerator: IdGenerator;

  readonly portIdGenerator: IdGenerator;

  readonly connectionIdGenerator: IdGenerator;

  constructor(readonly options: Options) {
    this.htmlController = new HtmlController(this);

    this.viewportTransformer = new ViewportTransformer();

    this.publicViewportTransformer = new PublicViewportTransformer(
      this.viewportTransformer,
    );

    this.controller = new CanvasController(this);

    this.graphStore = new GraphStore();

    this.publicGraphStore = new PublicGraphStore(this.graphStore);

    this.nodeIdGenerator = new IdGenerator();

    this.portIdGenerator = new IdGenerator();

    this.connectionIdGenerator = new IdGenerator();
  }
}
