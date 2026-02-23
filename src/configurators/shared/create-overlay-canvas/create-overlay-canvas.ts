import { Canvas } from "@/canvas";
import { standardCenterFn } from "@/center-fn";
import { DirectEdgeShape } from "@/edges";
import { Graph } from "@/graph";
import { GraphController, GraphControllerParams } from "@/graph-controller";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { immediateScheduleFn } from "@/schedule-fn";
import { Viewport } from "@/viewport";
import {
  ViewportController,
  ViewportControllerParams,
} from "@/viewport-controller";
import { ViewportStore } from "@/viewport-store";

export const createOverlayCanvas = (
  overlayLayer: HTMLElement,
  viewportStore: ViewportStore,
): Canvas => {
  const graphStore = new GraphStore();
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

  const htmlView = new CoreHtmlView(graphStore, viewportStore, overlayLayer);

  const graphControllerParams: GraphControllerParams = {
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

  const graphController = new GraphController(
    graphStore,
    htmlView,
    graphControllerParams,
  );

  const viewportControllerParams: ViewportControllerParams = {
    focus: {
      contentOffset: 0,
      minContentScale: 0,
      schedule: immediateScheduleFn,
    },
  };

  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    viewportControllerParams,
  );

  return new Canvas(graph, viewport, graphController, viewportController);
};
