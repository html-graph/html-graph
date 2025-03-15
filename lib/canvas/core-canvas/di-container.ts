import { GraphStoreController } from "@/graph-store-controller";
import { CoreOptions, createDefaults } from "./options";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { PublicGraphStore } from "@/public-graph-store";
import { GraphStore } from "@/graph-store";
import { HtmlView } from "@/html-view";

export class DiContainer {
  public readonly publicViewportTransformer: PublicViewportTransformer;

  public readonly publicGraphStore: PublicGraphStore;

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
    this.publicGraphStore = new PublicGraphStore(this.graphStore);

    this.viewportTransformer = new ViewportTransformer();
    this.publicViewportTransformer = new PublicViewportTransformer(
      this.viewportTransformer,
    );

    this.htmlView = htmlViewFactory(this.graphStore, this.viewportTransformer);

    this.graphStoreController = new GraphStoreController(
      this.graphStore,
      createDefaults(coreOptions),
    );
  }
}
