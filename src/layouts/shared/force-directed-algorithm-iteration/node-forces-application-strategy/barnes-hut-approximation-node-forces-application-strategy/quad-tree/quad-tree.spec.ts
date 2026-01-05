import { QuadTree } from "./quad-tree";
import { QuadTreeNode } from "./quad-tree-node";

describe("QuadTree", () => {
  it("should set initial root element", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map(),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    const expected: QuadTreeNode = {
      nodeIds: new Set(),
      totalMass: 0,
      totalCharge: 0,
      massCenter: {
        x: 0,
        y: 0,
      },
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    expect(tree.getRoot()).toEqual(expected);
  });

  it("should add node", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([["node-1", { x: 0, y: 0 }]]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().nodeIds).toEqual(new Set(["node-1"]));
  });

  it("should add first node to top right quarter", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 0, y: 0 }],
        ["node-2", { x: -1, y: -1 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rt!.nodeIds).toEqual(new Set(["node-1"]));
  });

  it("should set right top quarter dimensions", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 0, y: 0 }],
        ["node-2", { x: -1, y: -1 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rt!.box).toEqual({
      centerX: 5,
      centerY: 5,
      radius: 5,
    });
  });

  it("should add second node to left bottom quarter", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 0, y: 0 }],
        ["node-2", { x: -1, y: -1 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().lb!.nodeIds).toEqual(new Set(["node-2"]));
  });

  it("should set left bottom quarter dimensions", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 0, y: 0 }],
        ["node-2", { x: -1, y: -1 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().lb!.box).toEqual({
      centerX: -5,
      centerY: -5,
      radius: 5,
    });
  });

  it("should add first node to right bottom quarter", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: -1 }],
        ["node-2", { x: -1, y: 1 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rb!.nodeIds).toEqual(new Set(["node-1"]));
  });

  it("should set right bottom quarter dimensions", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: -1 }],
        ["node-2", { x: -1, y: 1 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rb!.box).toEqual({
      centerX: 5,
      centerY: -5,
      radius: 5,
    });
  });

  it("should add second node to left top quarter", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: -1 }],
        ["node-2", { x: -1, y: 1 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().lt!.nodeIds).toEqual(new Set(["node-2"]));
  });

  it("should set left top quarter dimensions", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: -1 }],
        ["node-2", { x: -1, y: 1 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().lt!.box).toEqual({
      centerX: -5,
      centerY: 5,
      radius: 5,
    });
  });

  it("should keep iterating until each node is the only one in quarter", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: 1 }],
        ["node-2", { x: 9, y: 9 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rt!.rt!.nodeIds).toEqual(new Set(["node-2"]));
  });

  it("should stop when minimum box size reached", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: 1 }],
        ["node-2", { x: 1, y: 1 }],
      ]),
      minAreaSize: 6,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rt!.nodeIds).toEqual(new Set(["node-1", "node-2"]));
  });

  it("should calculate total cell mass for leaf", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: 1 }],
        ["node-2", { x: 2, y: 2 }],
      ]),
      minAreaSize: 6,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rt!.totalMass).toBe(2);
  });

  it("should calculate total cell charge for leaf", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: 1 }],
        ["node-2", { x: 2, y: 2 }],
      ]),
      minAreaSize: 6,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rt!.totalCharge).toBe(2);
  });

  it("should calculate total cell mass for non-leaf", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: 1 }],
        ["node-2", { x: 2, y: 2 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rt!.totalMass).toBe(2);
  });

  it("should calculate total cell charge for non-leaf", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: 1 }],
        ["node-2", { x: 2, y: 2 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rt!.totalCharge).toBe(2);
  });

  it("should calculate center of mass", () => {
    const tree = new QuadTree({
      box: {
        centerX: 0,
        centerY: 0,
        radius: 10,
      },
      coords: new Map([
        ["node-1", { x: 1, y: 1 }],
        ["node-2", { x: 2, y: 2 }],
      ]),
      minAreaSize: 1e-3,
      nodeMass: 1,
      nodeCharge: 1,
    });

    expect(tree.getRoot().rt!.massCenter).toEqual({ x: 1.5, y: 1.5 });
  });
});
