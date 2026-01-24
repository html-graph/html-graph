import { createCanvas } from "@/mocks";
import { WidthFirstSpanningForestGenerator } from "./width-first-spanning-forest-generator";
import { TreeNode } from "../tree";

describe("WidthFirstSpanningForestGenerator", () => {
  it("should generate empty forest for graph without nodes", () => {
    const canvas = createCanvas();

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const forest = forestGenerator.generate();

    expect(forest.size).toBe(0);
  });

  it("should generate single node tree for single node graph", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
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

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
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

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
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

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();

    const expected: TreeNode = {
      nodeId: "node-1",
      children: new Set(),
    };

    expect(tree.sequence).toEqual([expected]);
  });
});
