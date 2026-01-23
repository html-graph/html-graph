import { createCanvas, createElement } from "@/mocks";
import { HierarchicalLayoutAlgorithm } from "./hierarchical-layout-algorithm";

describe("HierarchicalLayoutAlgorithm", () => {
  it("should return empty map when graph has no nodes", () => {
    const canvas = createCanvas();

    const layout = new HierarchicalLayoutAlgorithm({
      layerSize: 100,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords).toEqual(new Map());
  });

  it("should put first node in the center of the viewport", () => {
    const element = createElement({ width: 2000, height: 1000 });
    const canvas = createCanvas(element);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const layout = new HierarchicalLayoutAlgorithm({
      layerSize: 100,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords.get("node-1")).toEqual({ x: 1000, y: 500 });
  });
});
