import { TreeSpans } from "../tree-spans";
import { AggregatedSubtreeGenerator } from "./aggregated-subtree-generator";

describe("AggregatedSubtreeGenerator", () => {
  it("should position single subtree at 0", () => {
    const subtreeLayers: TreeSpans = [{ start: -50, end: 50 }];

    const generator = new AggregatedSubtreeGenerator({
      spaceAroundRadius: 50,
    });

    const result = generator.generate([subtreeLayers]);

    expect(result.childOffsets).toEqual([0]);
  });

  it("should position two subtrees on a distance apart", () => {
    const subtreeLayers1: TreeSpans = [{ start: -50, end: 50 }];
    const subtreeLayers2: TreeSpans = [{ start: -50, end: 50 }];

    const generator = new AggregatedSubtreeGenerator({
      spaceAroundRadius: 50,
    });

    const result = generator.generate([subtreeLayers1, subtreeLayers2]);

    expect(result.childOffsets).toEqual([-50, 50]);
  });

  it("should account for child spans", () => {
    const subtreeLayers1: TreeSpans = [
      { start: -50, end: 50 },
      { start: -100, end: 100 },
    ];

    const subtreeLayers2: TreeSpans = [
      { start: -50, end: 50 },
      { start: -100, end: 100 },
    ];

    const generator = new AggregatedSubtreeGenerator({
      spaceAroundRadius: 50,
    });

    const result = generator.generate([subtreeLayers1, subtreeLayers2]);

    expect(result.childOffsets).toEqual([-100, 100]);
  });

  it("should generate aggregated subtree spans for single child span", () => {
    const subtreeLayers: TreeSpans = [{ start: -50, end: 50 }];

    const generator = new AggregatedSubtreeGenerator({
      spaceAroundRadius: 50,
    });

    const result = generator.generate([subtreeLayers]);

    expect(result.subtreeSpans).toEqual([{ start: -50, end: 50 }]);
  });

  it("should generate aggregated subtree spans for two child spans", () => {
    const subtreeLayers1: TreeSpans = [{ start: -50, end: 50 }];
    const subtreeLayers2: TreeSpans = [{ start: -50, end: 50 }];

    const generator = new AggregatedSubtreeGenerator({
      spaceAroundRadius: 50,
    });

    const result = generator.generate([subtreeLayers1, subtreeLayers2]);

    expect(result.subtreeSpans).toEqual([{ start: -100, end: 100 }]);
  });

  it("should generate space between subtrees", () => {
    const subtreeLayers1: TreeSpans = [
      { start: -50, end: 50 },
      { start: -150, end: 150 },
    ];

    const subtreeLayers2: TreeSpans = [{ start: -50, end: 50 }];

    const subtreeLayers3: TreeSpans = [
      { start: -50, end: 50 },
      { start: -150, end: 150 },
    ];

    const generator = new AggregatedSubtreeGenerator({
      spaceAroundRadius: 50,
    });

    const result = generator.generate([
      subtreeLayers1,
      subtreeLayers2,
      subtreeLayers3,
    ]);

    expect(result.subtreeSpans[1]).toEqual({ start: -300, end: 300 });
  });
});
