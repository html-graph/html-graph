import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { createElement, defaultCanvasParams } from "@/mocks";
import { Viewport } from "@/viewport";
import { ViewportStore } from "@/viewport-store";
import { subscribeAnimatedLayoutStaticNodesUpdate } from "./subscribe-animated-layout-static-nodes-update";
import { Identifier } from "@/identifier";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = createElement({ width: 2500, height: 1000 });
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);
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

describe("subscribeAnimatedLayoutStaticNodesUpdate", () => {
  it("should remove static node when removing node from canvas", () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    subscribeAnimatedLayoutStaticNodesUpdate(
      canvas.graph,
      animationStaticNodes,
    );

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    animationStaticNodes.add("node-1");

    canvas.removeNode("node-1");

    expect(animationStaticNodes.has("node-1")).toBe(false);
  });

  it("should remove static node when clearing canvas", () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    subscribeAnimatedLayoutStaticNodesUpdate(
      canvas.graph,
      animationStaticNodes,
    );

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    animationStaticNodes.add("node-1");

    canvas.clear();

    expect(animationStaticNodes.has("node-1")).toBe(false);
  });
});
