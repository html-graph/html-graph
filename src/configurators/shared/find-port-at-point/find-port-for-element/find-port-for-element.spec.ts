import { Canvas, CanvasParams } from "@/canvas";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { findPortForElement } from "./find-port-for-element";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const element = document.createElement("div");
  const viewportStore = new ViewportStore(element);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

  const defaults: CanvasParams = {
    nodes: {
      centerFn: standardCenterFn,
      priorityFn: (): number => 0,
    },
    edges: {
      shapeFactory: () => new BezierEdgeShape(),
      priorityFn: (): number => 0,
    },
    ports: {
      direction: 0,
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

describe("findPortForElement", () => {
  it("should return null when element is not inside any port element", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [{ id: "node-1-1", element: document.createElement("div") }],
    });

    const result = findPortForElement(
      canvas.graph,
      document.createElement("div"),
    );

    expect(result).toEqual({ status: "notFound" });
  });

  it("should return port id when element is port element", () => {
    const canvas = createCanvas();

    const portElement = document.createElement("div");

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [{ id: "node-1-1", element: portElement }],
    });

    const result = findPortForElement(canvas.graph, portElement);

    expect(result).toEqual({ status: "portFound", portId: "node-1-1" });
  });

  it("should return port id when element is inside port element", () => {
    const canvas = createCanvas();

    const portElement = document.createElement("div");
    const insideElement = document.createElement("div");
    portElement.appendChild(insideElement);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [{ id: "node-1-1", element: portElement }],
    });

    const result = findPortForElement(canvas.graph, insideElement);

    expect(result).toEqual({ status: "portFound", portId: "node-1-1" });
  });

  it("should return node encountered when node element found", () => {
    const canvas = createCanvas();

    const childElement = document.createElement("div");
    const nodeElement = document.createElement("div");
    nodeElement.appendChild(childElement);

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    const result = findPortForElement(canvas.graph, childElement);

    expect(result).toEqual({ status: "nodeEncountered" });
  });
});
