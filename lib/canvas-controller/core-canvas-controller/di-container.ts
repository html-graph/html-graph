import { GraphStoreController } from "@/graph-store-controller";
import { Viewport, ViewportTransformer } from "@/viewport-transformer";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { HtmlView } from "@/html-view";

export class DiContainer {
  public readonly viewport: Viewport;

  public readonly graph: Graph;

  public readonly viewportTransformer: ViewportTransformer;

  public readonly graphStore: GraphStore;

  public readonly htmlView: HtmlView;

  public readonly graphStoreController: GraphStoreController;

  public constructor(
    htmlViewFactory: (
      graphStore: GraphStore,
      viewportTransformer: ViewportTransformer,
    ) => HtmlView,
  ) {
    this.graphStore = new GraphStore();
    this.graph = new Graph(this.graphStore);

    this.viewportTransformer = new ViewportTransformer();
    this.viewport = new Viewport(this.viewportTransformer);

    this.htmlView = htmlViewFactory(this.graphStore, this.viewportTransformer);

    this.graphStoreController = new GraphStoreController(this.graphStore);
  }
}
