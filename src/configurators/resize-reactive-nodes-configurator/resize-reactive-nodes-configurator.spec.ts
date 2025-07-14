import { ResizeReactiveNodesConfigurator } from "./resize-reactive-nodes-configurator";
import { BezierEdgeShape } from "@/edges";
import { standardCenterFn } from "@/center-fn";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import { triggerResizeFor } from "@/mocks";
import { Canvas, CanvasParams } from "@/canvas";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = document.createElement("div");
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

  const canvasParams: CanvasParams = {
    nodes: {
      centerFn: standardCenterFn,
      priorityFn: (): number => 0,
    },
    ports: {
      direction: 0,
    },
    edges: {
      shapeFactory: (): BezierEdgeShape => new BezierEdgeShape(),
      priorityFn: (): number => 0,
    },
  };

  const canvas = new Canvas(
    element,
    graphStore,
    viewportStore,
    htmlView,
    canvasParams,
  );

  ResizeReactiveNodesConfigurator.configure(canvas);

  return canvas;
};

describe("ResizeReactiveNodesConfigurator", () => {
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

  it("should unsubscribe before destroy", () => {
    const canvas = createCanvas();

    canvas.destroy();
  });
});
