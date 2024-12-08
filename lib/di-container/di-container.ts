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
  public readonly publicViewportTransformer: PublicViewportTransformer;

  public readonly publicGraphStore: PublicGraphStore;

  public readonly canvasController: CanvasController;

  public constructor(
    layersMode: LayersMode,
    backgroundDrawingFn: BackgroundDrawingFn,
    nodesCenterFn: CenterFn,
    portsCenterFn: CenterFn,
  ) {
    const viewportTransformer = new ViewportTransformer();

    this.publicViewportTransformer = new PublicViewportTransformer(
      viewportTransformer,
    );

    const graphStore = new GraphStore();

    this.publicGraphStore = new PublicGraphStore(graphStore);

    const htmlController = new HtmlController(
      graphStore,
      viewportTransformer,
      this.publicViewportTransformer,
      layersMode,
      backgroundDrawingFn,
    );

    this.canvasController = new CanvasController(
      graphStore,
      htmlController,
      viewportTransformer,
      nodesCenterFn,
      portsCenterFn,
    );
  }
}
