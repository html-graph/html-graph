import { LayerNodePlacementResolver } from "./layer-node-placement-resolver";

describe("LayerNodePlacementResolver", () => {
  it("should resolve empty array when no nodes are provided", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([]);

    expect(placement).toEqual([]);
  });

  it("should resolve one node in the center for leaf node", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([null]);

    expect(placement).toEqual([0]);
  });

  it("should resolve two node on a distance for two leaf node", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([null, null]);

    expect(placement).toEqual([-50, 50]);
  });

  it("should account for child radii when specified", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([100, 100]);

    expect(placement).toEqual([-100, 100]);
  });
});
