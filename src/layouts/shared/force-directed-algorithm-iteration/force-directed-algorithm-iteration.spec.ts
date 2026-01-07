import { createCanvas } from "@/mocks";
import { ForceDirectedAlgorithmIteration } from "./force-directed-algorithm-iteration";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { Graph } from "@/graph";
import { DistanceVectorGenerator } from "../distance-vector-generator";
import { DirectSumNodeForcesApplicationStrategy } from "../node-forces-application-strategy";

const createCurrentCoords = (graph: Graph): ReadonlyMap<Identifier, Point> => {
  const currentCoords = new Map<Identifier, Point>();
  const nodeIds = graph.getAllNodeIds();

  nodeIds.forEach((nodeId) => {
    const node = graph.getNode(nodeId)!;

    currentCoords.set(nodeId, {
      x: node.x ?? 0,
      y: node.y ?? 0,
    });
  });

  return currentCoords;
};

describe("ForceDirectedAlgorithmIteration", () => {
  it("should return unchanged coordinates when graph has one node", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 10,
      y: 10,
    });

    const currentCoords = createCurrentCoords(canvas.graph);

    const distance = new DistanceVectorGenerator(() => 0);

    const iteration = new ForceDirectedAlgorithmIteration(
      canvas.graph,
      currentCoords,
      {
        distance,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: 1e2,
            effectiveDistance: 1000,
            distance: distance,
          }),
        dtSec: 1,
        nodeMass: 1,
        edgeEquilibriumLength: 8,
        edgeStiffness: 1,
      },
    );

    iteration.apply();

    expect(currentCoords.get("node-1")).toEqual({ x: 10, y: 10 });
  });

  it("should apply for pulling back forces when two nodes are not connected", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 10,
      y: 0,
    });

    canvas.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 20,
      y: 0,
    });

    const currentCoords = createCurrentCoords(canvas.graph);
    const distance = new DistanceVectorGenerator(() => 0);

    const iteration = new ForceDirectedAlgorithmIteration(
      canvas.graph,
      currentCoords,
      {
        distance,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: 10,
            effectiveDistance: 1000,
            distance: distance,
          }),
        dtSec: 2,
        nodeMass: 1,
        edgeEquilibriumLength: 8,
        edgeStiffness: 1,
      },
    );

    iteration.apply();

    expect(currentCoords.get("node-1")).toEqual({ x: 8, y: 0 });
  });

  it("should account for edge spring forces when two nodes are connected", () => {
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

    canvas.addEdge({ from: "port-1", to: "port-2" });

    const currentCoords = createCurrentCoords(canvas.graph);
    const distance = new DistanceVectorGenerator(() => 0);

    const iteration = new ForceDirectedAlgorithmIteration(
      canvas.graph,
      currentCoords,
      {
        distance,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: 10,
            effectiveDistance: 1000,
            distance: distance,
          }),
        dtSec: 2,
        nodeMass: 1,
        edgeEquilibriumLength: 8,
        edgeStiffness: 1,
      },
    );

    iteration.apply();

    expect(currentCoords.get("node-1")).toEqual({ x: 12, y: 0 });
  });

  it("should not apply pulling back forces when effective distance is reached", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 10,
      y: 0,
    });

    canvas.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 20,
      y: 0,
    });

    const currentCoords = createCurrentCoords(canvas.graph);
    const distance = new DistanceVectorGenerator(() => 0);

    const iteration = new ForceDirectedAlgorithmIteration(
      canvas.graph,
      currentCoords,
      {
        distance,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: 10,
            effectiveDistance: 5,
            distance: distance,
          }),
        dtSec: 2,
        nodeMass: 1,
        edgeEquilibriumLength: 8,
        edgeStiffness: 1,
      },
    );

    iteration.apply();

    expect(currentCoords.get("node-1")).toEqual({ x: 10, y: 0 });
  });

  it("should calculate maximum delta", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 10,
      y: 0,
    });

    canvas.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 20,
      y: 0,
    });

    const currentCoords = createCurrentCoords(canvas.graph);
    const distance = new DistanceVectorGenerator(() => 0);

    const iteration = new ForceDirectedAlgorithmIteration(
      canvas.graph,
      currentCoords,
      {
        distance,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: 10,
            effectiveDistance: 1000,
            distance: distance,
          }),
        dtSec: 2,
        nodeMass: 1,
        edgeEquilibriumLength: 8,
        edgeStiffness: 1,
      },
    );

    const maxDelta = iteration.apply();

    expect(maxDelta).toBe(2);
  });
});
