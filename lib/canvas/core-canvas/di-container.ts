import { GraphStoreController } from "@/graph-store-controller";
import { CoreOptions, createDefaults } from "./options";
import {
  Viewport,
  ViewportTransformer,
} from "@/viewport-transformer";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { HtmlView } from "@/html-view";

export class DiContainer {
  public readonly publicViewportTransformer: Viewport;

  public readonly publicGraphStore: Graph;

  public readonly viewportTransformer: ViewportTransformer;

  public readonly graphStore: GraphStore;

  public readonly htmlView: HtmlView;

  public readonly graphStoreController: GraphStoreController;

  public constructor(
    coreOptions: CoreOptions,
    htmlViewFactory: (
      graphStore: GraphStore,
      viewportTransformer: ViewportTransformer,
    ) => HtmlView,
  ) {
    this.graphStore = new GraphStore();
    this.publicGraphStore = new Graph(this.graphStore);

    this.viewportTransformer = new ViewportTransformer();
    this.publicViewportTransformer = new Viewport(
      this.viewportTransformer,
    );

    this.htmlView = htmlViewFactory(this.graphStore, this.viewportTransformer);

    this.graphStoreController = new GraphStoreController(
      this.graphStore,
      createDefaults(coreOptions),
    );
  }
}
