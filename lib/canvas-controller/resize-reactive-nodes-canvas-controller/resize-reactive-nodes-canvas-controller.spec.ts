import { ResizeReactiveNodesCanvasController } from "./resize-reactive-nodes-canvas-controller";
import { EdgeShapeMock } from "@/edges";
import { CoreCanvasController } from "../core-canvas-controller";
import { CanvasController } from "../canvas-controller";
import { standardCenterFn } from "@/center-fn";
import { GraphStore } from "@/graph-store";
import { ViewportTransformer } from "@/viewport-transformer";
import { CoreHtmlView } from "@/html-view";
import { triggerResizeFor } from "@/test-utils";

const createCanvas = (): CanvasController => {
  const graphStore = new GraphStore();
  const viewportTransformer = new ViewportTransformer();

  return new CoreCanvasController(
    graphStore,
    viewportTransformer,
    new CoreHtmlView(graphStore, viewportTransformer),
  );
};

describe("ResizeReactiveNodesCanvasController", () => {
  it("should call attach on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(canvasCore, "attach");

    canvas.attach(canvasElement);

    expect(spy).toHaveBeenCalledWith(canvasElement);
  });

  it("should call detach on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(canvasCore, "detach");

    canvas.attach(canvasElement);
    canvas.detach();

    expect(spy).toHaveBeenCalled();
  });

  it("should call addNode on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    const spy = jest.spyOn(canvasCore, "addNode");

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateNode on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(canvasCore, "updateNode");

    canvas.updateNode("node-1", {});

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeNode on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(canvasCore, "removeNode");

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call markPort on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(canvasCore, "markPort");

    canvas.markPort({
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updatePort on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
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

    const spy = jest.spyOn(canvasCore, "updatePort");

    canvas.updatePort("port-1", {});

    expect(spy).toHaveBeenCalled();
  });

  it("should call unmarkPort on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
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

    const spy = jest.spyOn(canvasCore, "unmarkPort");

    canvas.unmarkPort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call addEdge on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
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

    const spy = jest.spyOn(canvasCore, "addEdge");

    canvas.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new EdgeShapeMock(),
      priority: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateEdge on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
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

    canvas.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new EdgeShapeMock(),
      priority: 0,
    });

    const spy = jest.spyOn(canvasCore, "updateEdge");

    canvas.updateEdge("edge-1", {});

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeEdge on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
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

    canvas.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new EdgeShapeMock(),
      priority: 0,
    });

    const spy = jest.spyOn(canvasCore, "removeEdge");

    canvas.removeEdge("edge-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchViewportMatrix on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    const spy = jest.spyOn(canvasCore, "patchViewportMatrix");

    canvas.patchViewportMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchContentMatrix on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    const spy = jest.spyOn(canvasCore, "patchContentMatrix");

    canvas.patchContentMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    const spy = jest.spyOn(canvasCore, "clear");

    canvas.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should call destroy on canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    const spy = jest.spyOn(canvasCore, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on destroy canvas", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    const spy = jest.spyOn(canvas, "clear");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should react to node changes", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

    const element = document.createElement("div");

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(canvasCore, "updateNode");

    triggerResizeFor(element);

    expect(spy).toHaveBeenCalled();
  });

  it("should not react to node changes on removed nodes", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

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

    const spy = jest.spyOn(canvasCore, "updateNode");

    triggerResizeFor(element);

    expect(spy).not.toHaveBeenCalled();
  });

  it("should not react to node changes on cleared nodes", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

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

    const spy = jest.spyOn(canvasCore, "updateNode");

    triggerResizeFor(element);

    expect(spy).not.toHaveBeenCalled();
  });

  it("should react to edge node changes", () => {
    const canvasCore = createCanvas();
    const canvas = new ResizeReactiveNodesCanvasController(canvasCore);

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

    const shape = new EdgeShapeMock();

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
