import { Canvas, CanvasParams } from "@/canvas";
import { standardCenterFn } from "@/center-fn";
import { DeferredGraphStore } from "@/deferred-graph-store";
import { DirectEdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";

export const createOverlayCanvas = (
  overlayLayer: HTMLElement,
  viewportStore: ViewportStore,
): Canvas => {
  const graphStore = new GraphStore<number>();

  const htmlView = new CoreHtmlView(graphStore, viewportStore, overlayLayer);

  const defaults: CanvasParams = {
    nodes: {
      centerFn: standardCenterFn,
      priorityFn: (): number => 0,
    },
    edges: {
      shapeFactory: () => new DirectEdgeShape(),
      priorityFn: (): number => 0,
    },
    ports: {
      direction: 0,
    },
  };

  const deferredGraphStore = new DeferredGraphStore(graphStore);

  return new Canvas(
    graphStore,
    deferredGraphStore,
    viewportStore,
    htmlView,
    defaults,
  );
};
