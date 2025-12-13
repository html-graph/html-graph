import { createCanvas } from "@/mocks";
import { ForceDirectedLayoutAlgorithm } from "./force-directed-layout-algorithm";
import { LayoutAlgorithm } from "../layout-algorithm";
import { Canvas } from "@/canvas";

const initCanvas = (canvas: Canvas): void => {
  canvas.addNode({
    id: "node-1",
    element: document.createElement("div"),
    x: 10,
    y: 0,
    ports: [
      {
        id: "port-1",
        element: document.createElement("div"),
      },
    ],
  });

  canvas.addNode({
    id: "node-2",
    element: document.createElement("div"),
    x: 20,
    y: 0,
    ports: [
      {
        id: "port-2",
        element: document.createElement("div"),
      },
    ],
  });
};

const createAlgorithm = (): LayoutAlgorithm => {
  return new ForceDirectedLayoutAlgorithm({
    dtSec: 1,
    maxIterations: 1,
    rand: (): number => 0,
    maxTimeDeltaSec: 1,
    nodeCharge: 10,
    nodeMass: 1,
    edgeEquilibriumLength: 8,
    effectiveDistance: 1000,
    edgeStiffness: 1,
  });
};

describe("ForceDirectedLayoutAlgorithm", () => {
  it("should calculate coordinates based on total forces", () => {
    const canvas = createCanvas();
    initCanvas(canvas);

    const algorithm = createAlgorithm();

    const nextCoords = algorithm.calculateCoordinates(canvas.graph);

    expect(nextCoords).toEqual(
      new Map([
        ["node-1", { x: 9.5, y: 0 }],
        ["node-2", { x: 20.5, y: 0 }],
      ]),
    );
  });
});
