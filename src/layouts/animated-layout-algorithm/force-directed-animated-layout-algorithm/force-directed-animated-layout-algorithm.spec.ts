import { createCanvas } from "@/mocks";
import { ForceDirectedAnimatedLayoutAlgorithm } from "./force-directed-animated-layout-algorithm";
import { Canvas } from "@/canvas";
import { AnimatedLayoutAlgorithm } from "../animated-layout-algorithm";

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

const createAlgorithm = (params?: {
  convergeDelta?: number;
  convergeVelocity?: number;
}): AnimatedLayoutAlgorithm => {
  return new ForceDirectedAnimatedLayoutAlgorithm({
    rand: (): number => 0.5,
    maxTimeDeltaSec: 1,
    nodeCharge: 10,
    nodeMass: 1,
    edgeEquilibriumLength: 8,
    effectiveDistance: 1000,
    edgeStiffness: 1,
    convergenceDelta: params?.convergeDelta ?? 0,
    convergenceVelocity: params?.convergeVelocity ?? 0,
    maxForce: 1e9,
    nodeForceCoefficient: 1,
    barnesHutTheta: 0,
    barnesHutAreaRadiusThreshold: 1e-2,
  });
};
describe("ForceDirectedAnimatedLayoutAlgorithm", () => {
  it("should calculate coordinates based on total forces", () => {
    const canvas = createCanvas();
    initCanvas(canvas);

    const algorithm = createAlgorithm();

    const nextCoords = algorithm.calculateNextCoordinates(
      canvas.graph,
      1,
      canvas.viewport,
    );

    expect(nextCoords).toEqual(
      new Map([
        ["node-1", { x: 9, y: 0 }],
        ["node-2", { x: 21, y: 0 }],
      ]),
    );
  });

  it("should stop when converged by delta", () => {
    const canvas = createCanvas();
    initCanvas(canvas);

    const algorithm = createAlgorithm({
      convergeDelta: 0.5 + 1e10,
    });

    const nextCoords = algorithm.calculateNextCoordinates(
      canvas.graph,
      1,
      canvas.viewport,
    );

    expect(nextCoords).toEqual(new Map([]));
  });

  it("should stop when converged by velocity", () => {
    const canvas = createCanvas();
    initCanvas(canvas);

    const algorithm = createAlgorithm({
      convergeVelocity: 1.1,
    });

    const nextCoords = algorithm.calculateNextCoordinates(
      canvas.graph,
      1,
      canvas.viewport,
    );

    expect(nextCoords).toEqual(new Map([]));
  });

  it("should not stop when converged but has unset coordinates", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
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
      x: 10,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: document.createElement("div"),
        },
      ],
    });

    const algorithm = createAlgorithm({
      convergeVelocity: 1.1,
    });

    const nextCoords = algorithm.calculateNextCoordinates(
      canvas.graph,
      1,
      canvas.viewport,
    );

    expect(nextCoords).toEqual(
      new Map([
        ["node-1", { x: -1, y: 0 }],
        ["node-2", { x: 11, y: 0 }],
      ]),
    );
  });
});
