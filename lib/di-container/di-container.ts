import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { PublicGraphStore, GraphStore } from "@/graph-store";
import { CanvasController } from "@/canvas-controller";
import { CenterFn } from "@/center-fn";
import { PriorityFn } from "@/priority";
import { HtmlController } from "@/html-controller";

export class DiContainer {
  public readonly publicViewportTransformer: PublicViewportTransformer;

  public readonly publicGraphStore: PublicGraphStore;

  public readonly canvasController: CanvasController;

  public constructor(
    nodeResizeObserverFactory: (
      callback: ResizeObserverCallback,
    ) => ResizeObserver,
    getBoundingClientRect: (element: HTMLElement) => DOMRect,
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

    const htmlController = new HtmlController(
      nodeResizeObserverFactory,
      getBoundingClientRect,
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
