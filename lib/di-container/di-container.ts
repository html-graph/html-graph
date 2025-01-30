import {
  AbstractPublicViewportTransformer,
  AbstractViewportTransformer,
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import {
  AbstractPublicGraphStore,
  GraphStore,
  AbstractGraphStore,
} from "@/graph-store";
import { CanvasController } from "@/canvas-controller";
import { CenterFn } from "@/center-fn";
import { PublicGraphStore } from "@/graph-store";
import { PriorityFn } from "@/priority";
import { HtmlController } from "@/html-controller";

export class DiContainer {
  public readonly publicViewportTransformer: AbstractPublicViewportTransformer;

  public readonly publicGraphStore: AbstractPublicGraphStore;

  public readonly canvasController: CanvasController;

  public constructor(
    resizeObserverConstructor: typeof ResizeObserver,
    nodesCenterFn: CenterFn,
    portsCenterFn: CenterFn,
    portsDirection: number,
    nodesPriorityFn: PriorityFn,
    edgesPriorityFn: PriorityFn,
  ) {
    const viewportTransformer: AbstractViewportTransformer =
      new ViewportTransformer();
    const graphStore: AbstractGraphStore = new GraphStore();

    this.publicGraphStore = new PublicGraphStore(graphStore);

    this.publicViewportTransformer = new PublicViewportTransformer(
      viewportTransformer,
    );

    const htmlController = new HtmlController(
      resizeObserverConstructor,
      graphStore,
      viewportTransformer,
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
