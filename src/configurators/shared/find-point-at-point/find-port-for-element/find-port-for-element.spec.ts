import { Canvas, CanvasParams } from "@/canvas";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { GenericGraphStore } from "@/generic-graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { findPortForElement } from "./find-port-for-element";

const createCanvas = (): Canvas => {
  const graphStore = new GenericGraphStore<number>();
  const viewportStore = new ViewportStore();
  const element = document.createElement("div");

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

  return new Canvas(graphStore, viewportStore, htmlView, defaults);
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

    const portId = findPortForElement(
      canvas.graph,
      document.createElement("div"),
    );

    expect(portId).toBe(null);
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

    const portId = findPortForElement(canvas.graph, portElement);

    expect(portId).toBe("node-1-1");
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

    const portId = findPortForElement(canvas.graph, insideElement);

    expect(portId).toBe("node-1-1");
  });
});
