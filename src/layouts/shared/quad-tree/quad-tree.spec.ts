import { QuadTree } from "./quad-tree";
import { QuadTreeNode } from "./quad-tree-node";

describe("QuadTree", () => {
  it("should set initial root element", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radiusHorizontal: 10,
        radiusVertical: 10,
      },
      coords: new Map(),
    });

    const expected: QuadTreeNode = {
      nodeIds: new Set(),
      box: {
        centerX: 0,
        centerY: 0,
        radiusHorizontal: 10,
        radiusVertical: 10,
      },
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    expect(tree.root).toEqual(expected);
  });

  it("should add node", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radiusHorizontal: 10,
        radiusVertical: 10,
      },
      coords: new Map([["node-1", { x: 0, y: 0 }]]),
    });

    expect(tree.root.nodeIds).toEqual(new Set(["node-1"]));
  });

  it("should add first node to top right quarter", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radiusHorizontal: 10,
        radiusVertical: 10,
      },
      coords: new Map([
        ["node-1", { x: 0, y: 0 }],
        ["node-2", { x: -1, y: -1 }],
      ]),
    });

    expect(tree.root.rt!.nodeIds).toEqual(new Set(["node-1"]));
  });
});
