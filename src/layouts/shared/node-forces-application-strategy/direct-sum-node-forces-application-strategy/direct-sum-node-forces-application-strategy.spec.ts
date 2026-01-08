import { DistanceVectorGenerator } from "../../distance-vector-generator";
import { DirectSumNodeForcesApplicationStrategy } from "./direct-sum-node-forces-application-strategy";

describe("DirectSumNodeForcesApplicationStrategy", () => {
  it("should not apply force when one node exist", () => {
    const distance = new DistanceVectorGenerator(() => 0);

    const strategy = new DirectSumNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      nodeCharge: 1000,
      distance,
      effectiveDistance: 1000,
      maxForce: 1e9,
    });

    const nodeCoords = new Map([["node-1", { x: 10, y: 10 }]]);

    const forces = new Map([["node-1", { x: 0, y: 0 }]]);

    strategy.apply(nodeCoords, forces);

    expect(forces).toEqual(new Map([["node-1", { x: 0, y: 0 }]]));
  });

  it("should apply repulsive forces by x axis when two nodes exist", () => {
    const distance = new DistanceVectorGenerator(() => 0);

    const strategy = new DirectSumNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      nodeCharge: 100,
      distance,
      effectiveDistance: 1000,
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

    expect(forces).toEqual(
      new Map([
        ["node-1", { x: -100, y: 0 }],
        ["node-2", { x: 100, y: 0 }],
      ]),
    );
  });

  it("should apply repulsive forces by y axis when two nodes exist", () => {
    const distance = new DistanceVectorGenerator(() => 0);

    const strategy = new DirectSumNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      nodeCharge: 100,
      distance,
      effectiveDistance: 1000,
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

    expect(forces).toEqual(
      new Map([
        ["node-1", { x: 0, y: -100 }],
        ["node-2", { x: 0, y: 100 }],
      ]),
    );
  });

  it("should not apply pulling back forces when effective distance is reached", () => {
    const distance = new DistanceVectorGenerator(() => 0);

    const strategy = new DirectSumNodeForcesApplicationStrategy({
      nodeForceCoefficient: 1,
      nodeCharge: 100,
      distance,
      effectiveDistance: 5,
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

    expect(forces).toEqual(
      new Map([
        ["node-1", { x: 0, y: 0 }],
        ["node-2", { x: 0, y: 0 }],
      ]),
    );
  });
});
