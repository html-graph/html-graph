import { ViewportStore } from "@/viewport-store";
import { createOverlayCanvas } from "./create-overlay-canvas";
import { Canvas } from "@/canvas";
import { createElement } from "@/mocks";
import { DirectEdgeShape } from "@/edges";

const createCanvas = (): Canvas => {
  const element = document.createElement("div");
  const viewportStore = new ViewportStore(element);

  return createOverlayCanvas(element, viewportStore);
};

describe("createOverlayCanvas", () => {
  it("should create canvas with default node center function", () => {
    const canvas = createCanvas();

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    expect(nodeElement.style.transform).toBe("translate(-50px, -50px)");
  });

  it("should create canvas with default node priority set to 0", () => {
    const canvas = createCanvas();

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    expect(nodeElement.style.zIndex).toBe("0");
  });

  it("should create canvas with default direct edge shape", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [{ id: "node-1-1", element: document.createElement("div") }],
    });

    canvas.addEdge({ id: "edge", from: "node-1-1", to: "node-1-1" });

    expect(canvas.graph.getEdge("edge")!.shape instanceof DirectEdgeShape).toBe(
      true,
    );
  });

  it("should create canvas with default edge edge priority set to 0", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [{ id: "node-1-1", element: document.createElement("div") }],
    });

    canvas.addEdge({ id: "edge", from: "node-1-1", to: "node-1-1" });

    expect(canvas.graph.getEdge("edge")!.shape.svg.style.zIndex).toBe("0");
  });

  it("should create canvas with default port direction set to 0", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [{ id: "node-1-1", element: document.createElement("div") }],
    });

    expect(canvas.graph.getPort("node-1-1")!.direction).toBe(0);
  });
});
