import { DirectSumNodeForcesApplicationStrategy } from "./direct-sum-node-forces-application-strategy";

describe("DirectSumNodeForcesApplicationStrategy", () => {
  it("should not apply force when one node exist", () => {
    const strategy = new DirectSumNodeForcesApplicationStrategy({
      nodeCharge: 1000,
      rand: (): number => 0,
      effectiveDistance: 1000,
    });

    const nodeCoords = new Map([["node-1", { x: 10, y: 10 }]]);

    const forces = new Map([["node-1", { x: 0, y: 0 }]]);

    strategy.apply(nodeCoords, forces);

    expect(forces).toEqual(new Map([["node-1", { x: 0, y: 0 }]]));
  });

  it("should apply repulsive forces by x axis when two nodes exist", () => {
    const strategy = new DirectSumNodeForcesApplicationStrategy({
      nodeCharge: 100,
      rand: (): number => 0,
      effectiveDistance: 1000,
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
        ["node-1", { x: -50, y: 0 }],
        ["node-2", { x: 50, y: 0 }],
      ]),
    );
  });

  it("should apply repulsive forces by y axis when two nodes exist", () => {
    const strategy = new DirectSumNodeForcesApplicationStrategy({
      nodeCharge: 100,
      rand: (): number => 0,
      effectiveDistance: 1000,
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
        ["node-1", { x: 0, y: -50 }],
        ["node-2", { x: 0, y: 50 }],
      ]),
    );
  });

  it("should not apply pulling back forces when effective distance is reached", () => {
    const strategy = new DirectSumNodeForcesApplicationStrategy({
      nodeCharge: 100,
      rand: (): number => 0,
      effectiveDistance: 5,
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
