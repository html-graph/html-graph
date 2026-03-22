import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  defaultGraphControllerParams,
  defaultViewportControllerParams,
} from "@/mocks";
import { Viewport } from "@/viewport";
import { ViewportStore } from "@/viewport-store";
import { subscribeAnimatedLayoutStaticNodesUpdate } from "./subscribe-animated-layout-static-nodes-update";
import { Identifier } from "@/identifier";
import { GraphController } from "@/graph-controller";
import { ViewportController } from "@/viewport-controller";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
  const viewportStore = new ViewportStore(host);
  const element = document.createElement("div");
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

  const graphController = new GraphController(
    graphStore,
    htmlView,
    defaultGraphControllerParams,
  );

  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    defaultViewportControllerParams,
    window,
  );

  const canvas = new Canvas(
    graph,
    viewport,
    graphController,
    viewportController,
  );

  return canvas;
};

describe("subscribeAnimatedLayoutStaticNodesUpdate", () => {
  it("should remove static node when removing node from canvas", () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    subscribeAnimatedLayoutStaticNodesUpdate(canvas, animationStaticNodes);

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

    subscribeAnimatedLayoutStaticNodesUpdate(canvas, animationStaticNodes);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    animationStaticNodes.add("node-1");

    canvas.clear();

    expect(animationStaticNodes.has("node-1")).toBe(false);
  });

  it("should remove static node when canvas destroyed", () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    subscribeAnimatedLayoutStaticNodesUpdate(canvas, animationStaticNodes);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    animationStaticNodes.add("node-1");

    canvas.destroy();

    expect(animationStaticNodes.has("node-1")).toBe(false);
  });
});
