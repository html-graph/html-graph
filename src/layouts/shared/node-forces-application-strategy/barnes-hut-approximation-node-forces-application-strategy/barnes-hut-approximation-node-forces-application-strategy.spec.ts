import { DistanceVectorGenerator } from "../../distance-vector-generator";
import { BarnesHutApproximationNodeForcesApplicationStrategy } from "./barnes-hut-approximation-node-forces-application-strategy";

describe("BarnesHutNodeForcesApplicationStrategy", () => {
  it("should apply near repulsive forces of right top quadrant by x axis", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 0,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 10, y: 0 }],
      ["node-2", { x: 20, y: 0 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-1")).toEqual({ x: -100, y: 0 });
  });

  it("should apply near repulsive forces by y axis", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 0,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 0, y: 10 }],
      ["node-2", { x: 0, y: 20 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-1")).toEqual({ x: 0, y: -100 });
  });

  it("should descend recursively in right top quadrant", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 0,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 10, y: 0 }],
      ["node-2", { x: 15, y: 0 }],
      ["node-3", { x: 20, y: 0 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
      ["node-3", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-1")).toEqual({ x: -500, y: 0 });
  });

  it("should descend recursively in left bottom quadrant", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 0,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 10, y: 0 }],
      ["node-2", { x: 15, y: 0 }],
      ["node-3", { x: 20, y: 0 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
      ["node-3", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-3")).toEqual({ x: 500, y: 0 });
  });

  it("should descend recursively in right bottom quadrant", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 0,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 10, y: 0 }],
      ["node-2", { x: 15, y: 0 }],
      ["node-3", { x: 20, y: 0 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
      ["node-3", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-2")).toEqual({ x: 0, y: 0 });
  });

  it("should descend recursively in left top quadrant", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 0,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 0, y: 10 }],
      ["node-2", { x: 0, y: 15 }],
      ["node-3", { x: 0, y: 20 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
      ["node-3", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-1")).toEqual({ x: 0, y: -500 });
  });

  it("should descend recursively in right top quadrant", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 0,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 10, y: 10 }],
      ["node-2", { x: 15, y: 15 }],
      ["node-3", { x: 20, y: 20 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
      ["node-3", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-1")).toEqual({
      x: -250 / Math.sqrt(2),
      y: -250 / Math.sqrt(2),
    });
  });

  it("should apply far forces of top right quadrant", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 10,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 10, y: 0 }],
      ["node-2", { x: 15, y: 0 }],
      ["node-3", { x: 20, y: 0 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
      ["node-3", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-1")).toEqual({
      x: -((100 * 2 * 100) / (7.5 * 7.5)),
      y: 0,
    });
  });

  it("should apply far forces of right bottom quadrant", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 10,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 0, y: 10 }],
      ["node-2", { x: 0, y: 14 }],
      ["node-3", { x: 0, y: 20 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
      ["node-3", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-3")).toEqual({
      x: 0,
      y: (100 * 2 * 100) / (8 * 8),
    });
  });

  it("should apply far forces of left bottom quadrant", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 10,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 10, y: 10 }],
      ["node-2", { x: 14, y: 14 }],
      ["node-3", { x: 20, y: 20 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
      ["node-3", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    const d = Math.sqrt(2 * 8 * 8);
    const f = (100 * 2 * 100) / (d * d);

    expect(forces.get("node-3")).toEqual({
      x: f / Math.sqrt(2),
      y: f / Math.sqrt(2),
    });
  });

  it("should forces between nodes in the same cell", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      distance: new DistanceVectorGenerator(() => 0),
      nodeCharge: 100,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
      theta: 10,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([
      ["node-1", { x: 10, y: 0 }],
      ["node-2", { x: 10, y: 0 }],
    ]);

    const forces = new Map([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
    ]);

    strategy.apply(nodeCoords, forces);

    expect(forces.get("node-1")).toEqual({
      x: 1e9,
      y: 0,
    });
  });
});
