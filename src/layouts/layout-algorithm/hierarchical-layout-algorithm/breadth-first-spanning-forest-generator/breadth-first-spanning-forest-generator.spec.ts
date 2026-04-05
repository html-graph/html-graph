import { createCanvas } from "@/mocks";
import { BreadthFirstSpanningForestGenerator } from "./breadth-first-spanning-forest-generator";
import { TreeNode } from "../tree";
import { adjacentNextLayerNodesResolver } from "../next-layer-nodes-resolver";

describe("BreadthFirstSpanningForestGenerator", () => {
  it("should generate empty forest for graph without nodes", () => {
    const canvas = createCanvas();

    const forestGenerator = new BreadthFirstSpanningForestGenerator(
      canvas.graph,
      adjacentNextLayerNodesResolver,
    );

    const forest = forestGenerator.generate();

    expect(forest.size).toBe(0);
  });

  it("should generate single node tree for single node graph", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new BreadthFirstSpanningForestGenerator(
      canvas.graph,
      adjacentNextLayerNodesResolver,
    );

    const [tree] = forestGenerator.generate();

    const expected: TreeNode = {
      nodeId: "node-1",
      children: new Set(),
    };

    expect(tree.root).toEqual(expected);
  });

  it("should generate tree for two connected nodes", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [{ id: "port-1", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [{ id: "port-2", element: document.createElement("div") }],
      })
      .addEdge({ from: "port-1", to: "port-2" });

    const forestGenerator = new BreadthFirstSpanningForestGenerator(
      canvas.graph,
      adjacentNextLayerNodesResolver,
    );

    const [tree] = forestGenerator.generate();

    const expected: TreeNode = {
      nodeId: "node-1",
      children: new Set([{ nodeId: "node-2", children: new Set() }]),
    };

    expect(tree.root).toEqual(expected);
  });

  it("should regard for incoming edges", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [{ id: "port-1", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [{ id: "port-2", element: document.createElement("div") }],
      })
      .addEdge({ from: "port-2", to: "port-1" });

    const forestGenerator = new BreadthFirstSpanningForestGenerator(
      canvas.graph,
      adjacentNextLayerNodesResolver,
    );

    const [tree] = forestGenerator.generate();

    const expected: TreeNode = {
      nodeId: "node-1",
      children: new Set([{ nodeId: "node-2", children: new Set() }]),
    };

    expect(tree.root).toEqual(expected);
  });

  it("should generate traversal sequence", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new BreadthFirstSpanningForestGenerator(
      canvas.graph,
      adjacentNextLayerNodesResolver,
    );

    const [tree] = forestGenerator.generate();

    const expected: TreeNode = {
      nodeId: "node-1",
      children: new Set(),
    };

    expect(tree.sequence).toEqual([expected]);
  });

  it("should handle child nodes with multiple parents", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [{ id: "port-1", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [{ id: "port-2", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-3",
        element: document.createElement("div"),
        ports: [{ id: "port-3", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-4",
        element: document.createElement("div"),
        ports: [{ id: "port-4", element: document.createElement("div") }],
      })
      .addEdge({ from: "port-1", to: "port-2" })
      .addEdge({ from: "port-1", to: "port-3" })
      .addEdge({ from: "port-2", to: "port-4" })
      .addEdge({ from: "port-3", to: "port-4" });

    const forestGenerator = new BreadthFirstSpanningForestGenerator(
      canvas.graph,
      adjacentNextLayerNodesResolver,
    );

    const [tree] = forestGenerator.generate();

    const expected: TreeNode = {
      nodeId: "node-1",
      children: new Set([
        {
          nodeId: "node-2",
          children: new Set([{ nodeId: "node-4", children: new Set() }]),
        },
        { nodeId: "node-3", children: new Set() },
      ]),
    };

    expect(tree.root).toEqual(expected);
  });
});
