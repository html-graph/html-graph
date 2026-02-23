import { RandomFillerLayoutAlgorithm } from "./random-filler-layout-algorithm";
import { createCanvas, createElement } from "@/mocks";

describe("RandomFillerLayoutAlgorithm", () => {
  it("should set single node coordinates to maximum of specified edge length", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const layout = new RandomFillerLayoutAlgorithm({
      rand: (): number => 1,
      sparsity: 10,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords).toEqual(new Map([["node-1", { x: 5, y: 5 }]]));
  });

  it("should keep existing node coordinates when specified", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 5,
      y: 5,
    });

    const layout = new RandomFillerLayoutAlgorithm({
      rand: (): number => 1,
      sparsity: 10,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords).toEqual(new Map([["node-1", { x: 5, y: 5 }]]));
  });

  it("should limit node coordinates to square root of nodes count", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    canvas.addNode({
      id: "node-2",
      element: document.createElement("div"),
    });

    canvas.addNode({
      id: "node-3",
      element: document.createElement("div"),
    });

    canvas.addNode({
      id: "node-4",
      element: document.createElement("div"),
    });

    const layout = new RandomFillerLayoutAlgorithm({
      rand: (): number => 1,
      sparsity: 10,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords).toEqual(
      new Map([
        ["node-1", { x: 10, y: 10 }],
        ["node-2", { x: 10, y: 10 }],
        ["node-3", { x: 10, y: 10 }],
        ["node-4", { x: 10, y: 10 }],
      ]),
    );
  });

  it("should regard for viewport center", () => {
    const element = createElement({ width: 2000, height: 1000 });
    const canvas = createCanvas(element);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const layout = new RandomFillerLayoutAlgorithm({
      rand: (): number => 1,
      sparsity: 10,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords).toEqual(new Map([["node-1", { x: 1005, y: 505 }]]));
  });

  it("should regard for viewport transformed center", () => {
    const element = createElement({ width: 2000, height: 1000 });
    const canvas = createCanvas(element);

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
      })
      .patchViewportMatrix({ x: -100, y: -100 });

    const layout = new RandomFillerLayoutAlgorithm({
      rand: (): number => 1,
      sparsity: 10,
    });

    const coords = layout.calculateCoordinates({
      graph: canvas.graph,
      viewport: canvas.viewport,
    });

    expect(coords).toEqual(new Map([["node-1", { x: 905, y: 405 }]]));
  });
});
