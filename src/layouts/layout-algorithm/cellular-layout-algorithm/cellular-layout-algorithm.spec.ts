import { createCanvas } from "@/mocks";
import { CellularLayoutAlgorithm } from "./cellular-layout-algorithm";
import { Canvas } from "@/canvas";
import { Identifier } from "@/identifier";

const createNode = (canvas: Canvas, nodeId: Identifier): void => {
  canvas.addNode({
    id: nodeId,
    element: document.createElement("div"),
    x: null,
    y: null,
    ports: [
      {
        id: nodeId,
        element: document.createElement("div"),
      },
    ],
  });
};

describe("CellularLayoutAlgorithm", () => {
  it("should set first node to zero", () => {
    const canvas = createCanvas();

    createNode(canvas, 1);

    const algorithm = new CellularLayoutAlgorithm({
      edgeLength: 100,
    });

    const coords = algorithm.calculateCoordinates(canvas.graph);

    expect(coords.get(1)).toEqual({ x: 0, y: 0 });
  });

  it("should set second node to specified edge length", () => {
    const canvas = createCanvas();

    createNode(canvas, 1);
    createNode(canvas, 2);

    const algorithm = new CellularLayoutAlgorithm({
      edgeLength: 100,
    });

    const coords = algorithm.calculateCoordinates(canvas.graph);

    expect(coords.get(2)).toEqual({ x: 100, y: 0 });
  });
});
