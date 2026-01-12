import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView, LayoutHtmlView } from "@/html-view";
import { Viewport } from "@/viewport";
import { ViewportStore } from "@/viewport-store";
import { defaultCanvasParams } from "./default-canvas-params";

export const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const element = document.createElement("div");
  const viewportStore = new ViewportStore(element);
  const htmlView = new LayoutHtmlView(
    new CoreHtmlView(graphStore, viewportStore, element),
    graphStore,
  );
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

  const canvas = new Canvas(
    graph,
    viewport,
    graphStore,
    viewportStore,
    htmlView,
    defaultCanvasParams,
  );

  return canvas;
};
