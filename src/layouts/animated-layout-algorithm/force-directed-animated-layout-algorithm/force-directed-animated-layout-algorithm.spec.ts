import { createCanvas } from "@/mocks";
import { ForceDirectedAnimatedLayoutAlgorithm } from "./force-directed-animated-layout-algorithm";

describe("ForceDirectedAnimatedLayoutAlgorithm", () => {
  it("should calculate coordinates based on total forces", () => {
    const canvas = createCanvas();

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

    const algorithm = new ForceDirectedAnimatedLayoutAlgorithm({
      rand: (): number => 0,
      maxTimeDeltaSec: 1,
      nodeCharge: 10,
      nodeMass: 1,
      edgeEquilibriumLength: 8,
      effectiveDistance: 1000,
      edgeStiffness: 1,
    });

    const nextCoords = algorithm.calculateNextCoordinates(canvas.graph, 1);

    expect(nextCoords).toEqual(
      new Map([
        ["node-1", { x: 9.5, y: 0 }],
        ["node-2", { x: 20.5, y: 0 }],
      ]),
    );
  });

  it("should not change existing coordinates when time delta exeeds limit", () => {
    const canvas = createCanvas();

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

    const algorithm = new ForceDirectedAnimatedLayoutAlgorithm({
      rand: (): number => 0,
      maxTimeDeltaSec: 0.1,
      nodeCharge: 10,
      nodeMass: 1,
      edgeEquilibriumLength: 8,
      effectiveDistance: 1000,
      edgeStiffness: 1,
    });

    const nextCoords = algorithm.calculateNextCoordinates(canvas.graph, 1);

    expect(nextCoords).toEqual(new Map());
  });
});
