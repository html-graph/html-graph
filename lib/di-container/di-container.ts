import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { GraphStore } from "@/graph-store";
import { CanvasController } from "@/canvas-controller";
import { BackgroundDrawingFn } from "@/background";
import { CenterFn } from "@/center-fn";
import { PublicGraphStore } from "@/graph-store";
import { PriorityFn } from "@/priority";
import { BasicHtmlController } from "@/html-controller/basic-html-controller";

export class DiContainer {
  public readonly publicViewportTransformer: PublicViewportTransformer;

  public readonly publicGraphStore: PublicGraphStore;

  public readonly canvasController: CanvasController;

  public constructor(
    backgroundDrawingFn: BackgroundDrawingFn,
    nodesCenterFn: CenterFn,
    portsCenterFn: CenterFn,
    portsDirection: number,
    nodesPriorityFn: PriorityFn,
    edgesPriorityFn: PriorityFn,
  ) {
    const viewportTransformer = new ViewportTransformer();
    const graphStore = new GraphStore();

    this.publicGraphStore = new PublicGraphStore(graphStore);

    this.publicViewportTransformer = new PublicViewportTransformer(
      viewportTransformer,
    );

    const htmlController = new BasicHtmlController(
      graphStore,
      viewportTransformer,
      this.publicViewportTransformer,
      backgroundDrawingFn,
    );

    this.canvasController = new CanvasController(
      graphStore,
      htmlController,
      viewportTransformer,
      nodesCenterFn,
      portsCenterFn,
      portsDirection,
      nodesPriorityFn,
      edgesPriorityFn,
    );
  }
}
