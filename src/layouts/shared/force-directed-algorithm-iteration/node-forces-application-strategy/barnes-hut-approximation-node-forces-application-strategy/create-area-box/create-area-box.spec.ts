import { createAreaBox } from "./create-area-box";

describe("createAreaBox", () => {
  it("should return default value when no nodes provided", () => {
    const nodeCoords = new Map();

    const box = createAreaBox(nodeCoords);

    expect(box).toEqual({ centerX: 0, centerY: 0, radius: 0 });
  });

  it("should contain one node", () => {
    const nodeCoords = new Map([["node-1", { x: 10, y: 10 }]]);

    const box = createAreaBox(nodeCoords);

    expect(box).toEqual({ centerX: 10, centerY: 10, radius: 0 });
  });

  it("should contain two node", () => {
    const nodeCoords = new Map([
      ["node-1", { x: 10, y: 10 }],
      ["node-2", { x: 20, y: 20 }],
    ]);

    const box = createAreaBox(nodeCoords);

    expect(box).toEqual({ centerX: 15, centerY: 15, radius: 5 });
  });
});
