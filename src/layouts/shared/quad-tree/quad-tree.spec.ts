import { createCanvas } from "@/mocks";
import { QuadTree } from "./quad-tree";
import { QuadTreeNode } from "./quad-tree-node";

describe("QuadTree", () => {
  it("should set initial root element", () => {
    const canvas = createCanvas();
    const tree = new QuadTree(canvas.graph, { x: 0, y: 0 }, 1);

    const expected: QuadTreeNode = {
      nodeId: null,
      mass: 0,
      position: { x: 0, y: 0 },
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    expect(tree.root).toEqual(expected);
  });

  it("should position first node in right top corner", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const tree = new QuadTree(canvas.graph, { x: 0, y: 0 }, 1);

    expect(tree.root.rt!.nodeId).toBe("node-1");
  });

  it("should position first node in left top corner", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: -1,
      y: 0,
    });

    const tree = new QuadTree(canvas.graph, { x: 0, y: 0 }, 1);

    expect(tree.root.lt!.nodeId).toBe("node-1");
  });

  it("should position first node in right bottom corner", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: -1,
    });

    const tree = new QuadTree(canvas.graph, { x: 0, y: 0 }, 1);

    expect(tree.root.rb!.nodeId).toBe("node-1");
  });

  it("should position first node in left bottom corner", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: -1,
      y: -1,
    });

    const tree = new QuadTree(canvas.graph, { x: 0, y: 0 }, 1);

    expect(tree.root.lb!.nodeId).toBe("node-1");
  });

  it("should regard for provided center when positioning nodes", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: -1,
      y: -1,
    });

    const tree = new QuadTree(canvas.graph, { x: -10, y: -10 }, 1);

    expect(tree.root.rt!.nodeId).toBe("node-1");
  });

  it("should position set provided node mass", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const tree = new QuadTree(canvas.graph, { x: 0, y: 0 }, 1);

    expect(tree.root.rt!.mass).toBe(1);
  });
});
