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
import { immediateScheduleFn } from "@/schedule-fn";

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
      schedule: immediateScheduleFn,
      animationDuration: 0,
    },
  };

  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    viewportControllerParams,
    window,
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
    const { canvas, graphController } = createCanvas();

    const spy = jest.spyOn(graphController, "addNode");

    canvas.addNode({
      element: createElement(),
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should update node", () => {
    const { canvas, graphController } = createCanvas();
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
    });

    const spy = jest.spyOn(graphController, "updateNode");

    canvas.updateNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should remove node", () => {
    const { canvas, graphController } = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: createElement(),
    });

    const spy = jest.spyOn(graphController, "removeNode");

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should mark port", () => {
    const { canvas, graphController } = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: createElement(),
    });

    const spy = jest.spyOn(graphController, "markPort");

    canvas.markPort({
      nodeId: "node-1",
      element: createElement(),
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should update port", () => {
    const { canvas, graphController } = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: createElement(),
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
    const { canvas, graphController } = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: createElement(),
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
    const { canvas, graphController } = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: createElement(),
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
    const { canvas, graphController } = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: createElement(),
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
    const { canvas, graphController } = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: createElement(),
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
    const { canvas, graphController } = createCanvas();

    const spy = jest.spyOn(graphController, "clear");

    canvas.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should patch viewport matrix", () => {
    const { canvas, viewportController } = createCanvas();

    const spy = jest.spyOn(viewportController, "patchViewportMatrix");

    canvas.patchViewportMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should patch content matrix", () => {
    const { canvas, viewportController } = createCanvas();

    const spy = jest.spyOn(viewportController, "patchContentMatrix");

    canvas.patchContentMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should destroy graph controller on destroy", () => {
    const { canvas, graphController } = createCanvas();

    const spy = jest.spyOn(graphController, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should destroy viewport controller on destroy", () => {
    const { canvas, viewportController } = createCanvas();

    const spy = jest.spyOn(viewportController, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should emit event before destroy", () => {
    const { canvas } = createCanvas();

    const onBeforeDestroy = jest.fn();

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    canvas.destroy();

    expect(onBeforeDestroy).toHaveBeenCalled();
  });

  it("should not emit destroy event twice", () => {
    const { canvas } = createCanvas();

    const onBeforeDestroy = jest.fn();

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    canvas.destroy();
    canvas.destroy();

    expect(onBeforeDestroy).toHaveBeenCalledTimes(1);
  });

  it("should focus viewport", () => {
    const { canvas, viewportController } = createCanvas();

    const spy = jest.spyOn(viewportController, "focus");

    canvas.focus();

    expect(spy).toHaveBeenCalled();
  });

  it("should center viewport", () => {
    const { canvas, viewportController } = createCanvas();

    const spy = jest.spyOn(viewportController, "center");

    canvas.center({ x: 0, y: 0 });

    expect(spy).toHaveBeenCalled();
  });
});
