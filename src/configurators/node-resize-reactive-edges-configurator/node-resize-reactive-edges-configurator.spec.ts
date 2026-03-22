import { NodeResizeReactiveEdgesConfigurator } from "./node-resize-reactive-edges-configurator";
import { BezierEdgeShape } from "@/edges";
import { standardCenterFn } from "@/center-fn";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import {
  defaultGraphControllerParams,
  defaultViewportControllerParams,
  triggerResizeFor,
} from "@/mocks";
import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { GraphController } from "@/graph-controller";
import { ViewportController } from "@/viewport-controller";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const element = document.createElement("div");
  const viewportStore = new ViewportStore(element);
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

  NodeResizeReactiveEdgesConfigurator.configure(canvas);

  return canvas;
};

describe("NodeResizeReactiveEdgesConfigurator", () => {
  it("should react to node changes", () => {
    const canvas = createCanvas();

    const element = document.createElement("div");

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(canvas, "updateNode");

    triggerResizeFor(element);

    expect(spy).toHaveBeenCalled();
  });

  it("should not react to node changes on removed nodes", () => {
    const canvas = createCanvas();

    const element = document.createElement("div");

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.removeNode("node-1");

    const spy = jest.spyOn(canvas, "updateNode");

    triggerResizeFor(element);

    expect(spy).not.toHaveBeenCalled();
  });

  it("should not react to node changes on cleared nodes", () => {
    const canvas = createCanvas();

    const element = document.createElement("div");

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.clear();

    const spy = jest.spyOn(canvas, "updateNode");

    triggerResizeFor(element);

    expect(spy).not.toHaveBeenCalled();
  });

  it("should not react to node changes on destroyed canvas", () => {
    const canvas = createCanvas();

    const element = document.createElement("div");

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.destroy();

    const spy = jest.spyOn(canvas, "updateNode");

    triggerResizeFor(element);

    expect(spy).not.toHaveBeenCalled();
  });

  it("should react to edge node changes", () => {
    const canvas = createCanvas();

    const element = document.createElement("div");

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    const shape = new BezierEdgeShape();

    canvas.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape,
      priority: 0,
    });

    const spy = jest.spyOn(shape, "render");

    triggerResizeFor(element);

    expect(spy).toHaveBeenCalled();
  });
});
