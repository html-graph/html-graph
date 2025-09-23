import { createCanvas } from "@/mocks";
import { PhysicalSimulationIteration } from "./physical-simulation-iteration";
import { Identifier } from "@/identifier";

describe("PhysicalSimulationIteration", () => {
  it("should return empty map when graph has no nodes", () => {
    const canvas = createCanvas();
    const iteration = new PhysicalSimulationIteration(canvas.graph, {
      rand: (): number => 0,
      dtSec: 1,
      nodeCharge: 1e2,
      nodeMass: 1,
      edgeEquilibriumLength: 8,
      effectiveDistance: 1000,
      edgeStiffness: 1,
      xFallbackResolver: (): number => 0,
      yFallbackResolver: (): number => 0,
    });
    const nextCoords = iteration.calculateNextCoordinates();

    expect(nextCoords.size).toBe(0);
  });

  it("should return unchanged coordinates when graph has one node", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 10,
      y: 10,
    });

    const iteration = new PhysicalSimulationIteration(canvas.graph, {
      rand: (): number => 0,
      dtSec: 1,
      nodeCharge: 1e2,
      nodeMass: 1,
      edgeEquilibriumLength: 8,
      effectiveDistance: 1000,
      edgeStiffness: 1,
      xFallbackResolver: (): number => 0,
      yFallbackResolver: (): number => 0,
    });
    const nextCoords = iteration.calculateNextCoordinates();

    expect(nextCoords.get("node-1")).toEqual({ x: 10, y: 10 });
  });

  it("should apply specified node coordinate fallbacks when node coordinates not set", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const iteration = new PhysicalSimulationIteration(canvas.graph, {
      rand: (): number => 0,
      dtSec: 1,
      nodeCharge: 1e2,
      nodeMass: 1,
      edgeEquilibriumLength: 8,
      effectiveDistance: 1000,
      edgeStiffness: 1,
      xFallbackResolver: (nodeId: Identifier): number =>
        nodeId === "node-1" ? 1 : 0,
      yFallbackResolver: (nodeId: Identifier): number =>
        nodeId === "node-1" ? 2 : 0,
    });

    const nextCoords = iteration.calculateNextCoordinates();

    expect(nextCoords.get("node-1")).toEqual({ x: 1, y: 2 });
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

    const iteration = new PhysicalSimulationIteration(canvas.graph, {
      rand: (): number => 0,
      dtSec: 2,
      nodeCharge: 10,
      nodeMass: 1,
      effectiveDistance: 1000,
      edgeEquilibriumLength: 8,
      edgeStiffness: 1,
      xFallbackResolver: (): number => 0,
      yFallbackResolver: (): number => 0,
    });

    const nextCoords = iteration.calculateNextCoordinates();

    expect(nextCoords.get("node-1")).toEqual({ x: 8, y: 0 });
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

    const iteration = new PhysicalSimulationIteration(canvas.graph, {
      rand: (): number => 0,
      dtSec: 2,
      nodeCharge: 10,
      nodeMass: 1,
      edgeEquilibriumLength: 8,
      effectiveDistance: 1000,
      edgeStiffness: 1,
      xFallbackResolver: (): number => 0,
      yFallbackResolver: (): number => 0,
    });

    const nextCoords = iteration.calculateNextCoordinates();

    expect(nextCoords.get("node-1")).toEqual({ x: 12, y: 0 });
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

    const iteration = new PhysicalSimulationIteration(canvas.graph, {
      rand: (): number => 0,
      dtSec: 2,
      nodeCharge: 10,
      nodeMass: 1,
      effectiveDistance: 5,
      edgeEquilibriumLength: 8,
      edgeStiffness: 1,
      xFallbackResolver: (): number => 0,
      yFallbackResolver: (): number => 0,
    });

    const nextCoords = iteration.calculateNextCoordinates();

    expect(nextCoords.get("node-1")).toEqual({ x: 10, y: 0 });
  });
});
