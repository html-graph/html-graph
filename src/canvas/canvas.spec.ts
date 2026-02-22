import { GraphStore } from "@/graph-store";
import { CoreHtmlView, HtmlView, LayoutHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { Canvas } from "./canvas";
import { createElement } from "@/mocks";
import { CenterFn, standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { PriorityFn } from "@/priority";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import {
  EdgeShapeFactory,
  GraphController,
  GraphControllerParams,
} from "@/graph-controller";
import {
  ViewportController,
  ViewportControllerParams,
} from "@/viewport-controller";

const createCanvas = (options?: {
  element?: HTMLElement;
  nodesCenterFn?: CenterFn;
  nodesPriorityFn?: PriorityFn;
  portsDirection?: number;
  edgeShapeFactory?: EdgeShapeFactory;
  edgesPriorityFn?: PriorityFn;
}): {
  canvas: Canvas;
  graphController: GraphController;
  viewportController: ViewportController;
} => {
  const element = options?.element ?? document.createElement("div");
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore(element);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);
  let htmlView: HtmlView = new CoreHtmlView(graphStore, viewportStore, element);
  htmlView = new LayoutHtmlView(htmlView, graphStore);

  const graphControllerParams: GraphControllerParams = {
    nodes: {
      centerFn: options?.nodesCenterFn ?? standardCenterFn,
      priorityFn: options?.nodesPriorityFn ?? ((): number => 0),
    },
    ports: {
      direction: options?.portsDirection ?? 0,
    },
    edges: {
      shapeFactory:
        options?.edgeShapeFactory ??
        ((): BezierEdgeShape => new BezierEdgeShape()),
      priorityFn: options?.edgesPriorityFn ?? ((): number => 0),
    },
  };

  const graphController = new GraphController(
    graphStore,
    htmlView,
    graphControllerParams,
  );

  const viewportControllerParams: ViewportControllerParams = {
    focus: {
      contentOffset: 100,
      minContentScale: 0,
    },
  };

  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    viewportControllerParams,
  );

  const canvas = new Canvas(
    graph,
    viewport,
    graphController,
    viewportController,
  );

  return { canvas, graphController, viewportController };
};

describe("Canvas", () => {
  it("should add node", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    const spy = jest.spyOn(graphController, "addNode");

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should update node", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(graphController, "updateNode");

    canvas.updateNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should remove node", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(graphController, "removeNode");

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should mark port", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(graphController, "markPort");

    canvas.markPort({
      nodeId: "node-1",
      element: createElement(),
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should update port", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    const spy = jest.spyOn(graphController, "updatePort");

    canvas.updatePort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should unmark port", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    const spy = jest.spyOn(graphController, "unmarkPort");

    canvas.unmarkPort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should add edge", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    const spy = jest.spyOn(graphController, "addEdge");

    canvas.addEdge({ from: "port-1", to: "port-1" });

    expect(spy).toHaveBeenCalled();
  });

  it("should update edge", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    const portElement = createElement();

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: portElement,
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    const spy = jest.spyOn(graphController, "updateEdge");

    canvas.updateEdge("edge-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should remove edge", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    const spy = jest.spyOn(graphController, "removeEdge");

    canvas.removeEdge("edge-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should clear graph", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    const spy = jest.spyOn(graphController, "clear");

    canvas.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should patch viewport matrix", () => {
    const element = document.createElement("div");
    const { canvas, viewportController } = createCanvas({ element });

    const spy = jest.spyOn(viewportController, "patchViewportMatrix");

    canvas.patchViewportMatrix({ scale: 2, x: 3, y: 4 });

    expect(spy).toHaveBeenCalled();
  });

  it("should patch content matrix", () => {
    const element = document.createElement("div");
    const { canvas, viewportController } = createCanvas({ element });

    const spy = jest.spyOn(viewportController, "patchContentMatrix");

    canvas.patchContentMatrix({ scale: 2, x: 3, y: 4 });

    expect(spy).toHaveBeenCalled();
  });

  it("should destroy graph controller on destroy", () => {
    const element = document.createElement("div");
    const { canvas, graphController } = createCanvas({ element });

    const spy = jest.spyOn(graphController, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should destroy viewport controller on destroy", () => {
    const element = document.createElement("div");
    const { canvas, viewportController } = createCanvas({ element });

    const spy = jest.spyOn(viewportController, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should emit event before destroy", () => {
    const element = document.createElement("div");
    const { canvas } = createCanvas({ element });

    const onBeforeDestroy = jest.fn();

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    canvas.destroy();

    expect(onBeforeDestroy).toHaveBeenCalled();
  });

  it("should not emit destroy event twice", () => {
    const element = document.createElement("div");
    const { canvas } = createCanvas({ element });

    const onBeforeDestroy = jest.fn();

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    canvas.destroy();
    canvas.destroy();

    expect(onBeforeDestroy).toHaveBeenCalledTimes(1);
  });

  it("should focus viewport", () => {
    const element = createElement({ width: 100, height: 100 });
    const { canvas, viewportController } = createCanvas({ element });

    const spy = jest.spyOn(viewportController, "focus");

    canvas.focus();

    expect(spy).toHaveBeenCalled();
  });
});
