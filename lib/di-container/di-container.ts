import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { PublicGraphStore, GraphStore } from "@/graph-store";
import { CanvasController } from "@/canvas-controller";
import { HtmlController } from "@/html-controller";
import { DiOptions } from "./di-options";

export class DiContainer {
  public readonly publicViewportTransformer: PublicViewportTransformer;

  public readonly publicGraphStore: PublicGraphStore;

  public readonly canvasController: CanvasController;

  public constructor(options: DiOptions) {
    const viewportTransformer = new ViewportTransformer();
    const graphStore = new GraphStore();

    this.publicGraphStore = new PublicGraphStore(graphStore);

    this.publicViewportTransformer = new PublicViewportTransformer(
      viewportTransformer,
    );

    const htmlController = new HtmlController(graphStore, viewportTransformer);

    this.canvasController = new CanvasController(
      graphStore,
      htmlController,
      viewportTransformer,
      options.nodesCenterFn,
      options.portsCenterFn,
      options.portsDirection,
      options.nodesPriorityFn,
      options.edgesPriorityFn,
    );
  }
}
