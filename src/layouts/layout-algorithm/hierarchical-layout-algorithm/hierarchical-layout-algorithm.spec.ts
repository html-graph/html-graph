import { createCanvas } from "@/mocks";
import { HierarchicalLayoutAlgorithm } from "./hierarchical-layout-algorithm";

describe("HierarchicalLayoutAlgorithm", () => {
  it("should return empty map when graph has no nodes", () => {
    const canvas = createCanvas();

    const layout = new HierarchicalLayoutAlgorithm({
      layerWidth: 100,
      layerSpace: 50,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords).toEqual(new Map());
  });

  it("should put first node in the initial position", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const layout = new HierarchicalLayoutAlgorithm({
      layerWidth: 100,
      layerSpace: 50,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords.get("node-1")).toEqual({ x: 0, y: 0 });
  });

  it("should put second node in the second layer", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [{ id: "port-1", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [{ id: "port-2", element: document.createElement("div") }],
      })
      .addEdge({ from: "port-1", to: "port-2" });

    const layout = new HierarchicalLayoutAlgorithm({
      layerWidth: 100,
      layerSpace: 50,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords.get("node-2")).toEqual({ x: 100, y: 0 });
  });
});
