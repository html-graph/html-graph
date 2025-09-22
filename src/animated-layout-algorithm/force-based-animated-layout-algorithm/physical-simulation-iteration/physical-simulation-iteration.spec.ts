import { createCanvas } from "@/mocks";
import { PhysicalSimulationIteration } from "./physical-simulation-iteration";
import { Identifier } from "@/identifier";

describe("PhysicalSimulationIteration", () => {
  it("should return empty map when graph has no nodes", () => {
    const canvas = createCanvas();
    const iteration = new PhysicalSimulationIteration(canvas.graph, {
      dtSec: 1,
      nodeCharge: 1e2,
      nodeMass: 1,
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
      dtSec: 1,
      nodeCharge: 1e2,
      nodeMass: 1,
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
      dtSec: 1,
      nodeCharge: 1e2,
      nodeMass: 1,
      xFallbackResolver: (nodeId: Identifier): number =>
        nodeId === "node-1" ? 1 : 0,
      yFallbackResolver: (nodeId: Identifier): number =>
        nodeId === "node-1" ? 2 : 0,
    });

    const nextCoords = iteration.calculateNextCoordinates();

    expect(nextCoords.get("node-1")).toEqual({ x: 1, y: 2 });
  });

  it("should apply pulling back forces when graph has two not connected nodes", () => {
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
      dtSec: 2,
      nodeCharge: 1e2,
      nodeMass: 1,
      xFallbackResolver: (): number => 0,
      yFallbackResolver: (): number => 0,
    });

    const nextCoords = iteration.calculateNextCoordinates();

    expect(nextCoords.get("node-1")).toEqual({ x: 9, y: 0 });
  });
});
