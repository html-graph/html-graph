import { Canvas, CanvasParams } from "@/canvas";
import { standardCenterFn } from "@/center-fn";
import { DirectEdgeShape } from "@/edges";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { Viewport } from "@/viewport";
import { ViewportStore } from "@/viewport-store";

export const createOverlayCanvas = (
  overlayLayer: HTMLElement,
  viewportStore: ViewportStore,
): Canvas => {
  const graphStore = new GraphStore();
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

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
    focus: {
      contentOffset: 0,
      minContentScale: 0,
    },
  };

  return new Canvas(
    graph,
    viewport,
    graphStore,
    viewportStore,
    htmlView,
    defaults,
  );
};
