import { HtmlController } from "@/html-controller";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { GraphStore, PublicGraphStore } from "@/graph-store";
import { Options } from "@/canvas/canvas-core/options";
import { CanvasController } from "@/canvas-controller";

export class DiContainer {
  private readonly htmlController: HtmlController;

  private readonly viewportTransformer: ViewportTransformer;

  private readonly graphStore: GraphStore;

  public readonly publicViewportTransformer: PublicViewportTransformer;

  public readonly publicGraphStore: PublicGraphStore;

  public readonly canvasController: CanvasController;

  public constructor(private readonly options: Options) {
    this.viewportTransformer = new ViewportTransformer();

    this.publicViewportTransformer = new PublicViewportTransformer(
      this.viewportTransformer,
    );

    this.graphStore = new GraphStore();

    this.publicGraphStore = new PublicGraphStore(this.graphStore);

    this.htmlController = new HtmlController(
      this.graphStore,
      this.viewportTransformer,
      this.publicViewportTransformer,
      this.options.layers.mode,
      this.options.background.drawingFn,
    );

    this.canvasController = new CanvasController(
      this.graphStore,
      this.htmlController,
      this.viewportTransformer,
      this.options.nodes.centerFn,
      this.options.ports.centerFn,
    );
  }
}
