import { HtmlController } from "@/html-controller";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { GraphStore, PublicGraphStore } from "@/graph-store";
import { CanvasController } from "@/canvas-controller";
import { LayersMode } from "@/layers";
import { BackgroundDrawingFn } from "@/background";
import { CenterFn } from "@/center-fn";

export class DiContainer {
  private readonly htmlController: HtmlController;

  private readonly viewportTransformer: ViewportTransformer;

  private readonly graphStore: GraphStore;

  public readonly publicViewportTransformer: PublicViewportTransformer;

  public readonly publicGraphStore: PublicGraphStore;

  public readonly canvasController: CanvasController;

  public constructor(
    layersMode: LayersMode,
    backgroundDrawingFn: BackgroundDrawingFn,
    nodesCenterFn: CenterFn,
    portsCenterFn: CenterFn,
  ) {
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
      layersMode,
      backgroundDrawingFn,
    );

    this.canvasController = new CanvasController(
      this.graphStore,
      this.htmlController,
      this.viewportTransformer,
      nodesCenterFn,
      portsCenterFn,
    );
  }
}
