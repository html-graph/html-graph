import { HtmlController } from "@/html-controller";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { GraphStore, PublicGraphStore } from "@/graph-store";
import { IdGenerator } from "@/id-generator";
import { Options } from "@/canvas/canvas-core/options";
import { CanvasController } from "@/canvas-controller";

export class DiContainer {
  public readonly htmlController: HtmlController;

  public readonly viewportTransformer: ViewportTransformer;

  public readonly publicViewportTransformer: PublicViewportTransformer;

  public readonly controller: CanvasController;

  public readonly graphStore: GraphStore;

  public readonly publicGraphStore: PublicGraphStore;

  public readonly nodeIdGenerator: IdGenerator;

  public readonly portIdGenerator: IdGenerator;

  public readonly connectionIdGenerator: IdGenerator;

  public constructor(public readonly options: Options) {
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
