import { BarnesHutApproximationNodeForcesApplicationStrategy } from "./barnes-hut-approximation-node-forces-application-strategy";

describe("BarnesHutNodeForcesApplicationStrategy", () => {
  it("should apply repulsive forces by x axis when two nodes exist", () => {
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeCharge: 100,
      nodeMass: 1,
      minAreaSize: 1e-2,
      rand: (): number => 0,
      theta: 1,
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
    const strategy = new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeCharge: 100,
      nodeMass: 1,
      minAreaSize: 1e-2,
      rand: (): number => 0,
      theta: 1,
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
});
