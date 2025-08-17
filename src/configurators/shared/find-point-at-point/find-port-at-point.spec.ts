import { Canvas, CanvasParams } from "@/canvas";
import { findPortAtPoint } from "./find-port-at-point";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { createElement } from "@/mocks";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";

const createCanvas = (options?: { element?: HTMLElement }): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

  const element =
    options?.element ?? createElement({ width: 1000, height: 1000 });

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

describe("findPortAtPoint", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should return null if no port element at point", () => {
    const canvas = createCanvas();

    const nodeElement = document.createElement("div");
    const portElement = createElement({ x: 1, y: 1, width: 1, height: 1 });
    nodeElement.appendChild(portElement);

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          id: "node-1-1",
          element: portElement,
        },
      ],
    });

    const portId = findPortAtPoint(canvas.graph, { x: 0, y: 0 });

    expect(portId).toBe(null);
  });

  it("should return port id if port element is at point", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });

    document.body.appendChild(element);

    const nodeElement = document.createElement("div");
    const portElement = createElement({ x: 0, y: 0, width: 2, height: 2 });
    nodeElement.appendChild(portElement);

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          id: "node-1-1",
          element: portElement,
        },
      ],
    });

    const portId = findPortAtPoint(canvas.graph, { x: 1, y: 1 });

    expect(portId).toBe("node-1-1");
  });

  it("should return port id if port element is at point under non-port element", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const overlay = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });

    document.body.appendChild(element);
    document.body.appendChild(overlay);

    const nodeElement = document.createElement("div");
    const portElement = createElement({ x: 0, y: 0, width: 2, height: 2 });
    nodeElement.appendChild(portElement);

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          id: "node-1-1",
          element: portElement,
        },
      ],
    });

    const portId = findPortAtPoint(canvas.graph, { x: 1, y: 1 });

    expect(portId).toBe("node-1-1");
  });
});
