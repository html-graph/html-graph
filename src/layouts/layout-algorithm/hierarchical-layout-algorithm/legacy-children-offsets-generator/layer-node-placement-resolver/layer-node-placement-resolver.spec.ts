import { LayerNodePlacementResolver } from "./layer-node-placement-resolver";

describe("LayerNodePlacementResolver", () => {
  it("should resolve empty offsets array when no nodes are provided", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([]);

    expect(placement.offsets).toEqual([]);
  });

  it("should resolve zero radius no nodes are provided", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([]);

    expect(placement.radius).toBe(0);
  });

  it("should resolve one node in the center for leaf node", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([null]);

    expect(placement.offsets).toEqual([0]);
  });

  it("should resolve radius to specified radius for one leaf node", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([null]);

    expect(placement.radius).toBe(50);
  });

  it("should resolve two nodes with a space between them when two leafs are provided", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([null, null]);

    expect(placement.offsets).toEqual([-50, 50]);
  });

  it("should account for child radius when resolving offsets", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([100, 100]);

    expect(placement.offsets).toEqual([-100, 100]);
  });

  it("should account for child radius overflow at the end when resolving radius", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([null, 100, 100]);

    expect(placement.radius).toBe(250);
  });

  it("should account for child radius overflow at the beginning when resolving radius", () => {
    const resolver = new LayerNodePlacementResolver({
      radius: 50,
    });

    const placement = resolver.resolve([100, 100, null]);

    expect(placement.radius).toBe(250);
  });
});
