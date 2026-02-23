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
    const node = graph.getNode(nodeId);

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

    const distanceVectorGenerator = new DistanceVectorGenerator(() => 0);

    const iteration = new ForceDirectedAlgorithmIteration(
      canvas.graph,
      currentCoords,
      {
        distanceVectorGenerator,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: 1e2,
            distanceVectorGenerator,
            maxForce: 1e9,
            nodeForceCoefficient: 1,
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
    const distanceVectorGenerator = new DistanceVectorGenerator(() => 0);

    const iteration = new ForceDirectedAlgorithmIteration(
      canvas.graph,
      currentCoords,
      {
        distanceVectorGenerator,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: 10,
            distanceVectorGenerator,
            maxForce: 1e9,
            nodeForceCoefficient: 1,
          }),
        dtSec: 2,
        nodeMass: 1,
        edgeEquilibriumLength: 8,
        edgeStiffness: 1,
      },
    );

    iteration.apply();

    expect(currentCoords.get("node-1")).toEqual({ x: 6, y: 0 });
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
    const distanceVectorGenerator = new DistanceVectorGenerator(() => 0);

    const iteration = new ForceDirectedAlgorithmIteration(
      canvas.graph,
      currentCoords,
      {
        distanceVectorGenerator,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: 10,
            distanceVectorGenerator,
            maxForce: 1e9,
            nodeForceCoefficient: 1,
          }),
        dtSec: 2,
        nodeMass: 1,
        edgeEquilibriumLength: 8,
        edgeStiffness: 1,
      },
    );

    iteration.apply();

    expect(currentCoords.get("node-1")).toEqual({ x: 14, y: 0 });
  });

  it("should calculate maximum velocity", () => {
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
    const distanceVectorGenerator = new DistanceVectorGenerator(() => 0);

    const iteration = new ForceDirectedAlgorithmIteration(
      canvas.graph,
      currentCoords,
      {
        distanceVectorGenerator,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: 10,
            distanceVectorGenerator,
            maxForce: 1e9,
            nodeForceCoefficient: 1,
          }),
        dtSec: 2,
        nodeMass: 1,
        edgeEquilibriumLength: 8,
        edgeStiffness: 1,
      },
    );

    const maxVelocity = iteration.apply();

    expect(maxVelocity).toBe(2);
  });
});
