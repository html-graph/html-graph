import { createCanvas } from "@/mocks";
import { ChildrenOffsetsGenerator } from "./children-offsets-generator";
import { WidthFirstSpanningForestGenerator } from "../width-first-spanning-forest-generator";

describe("ChildrenOffsetsGenerator", () => {
  it("should zero offset when node is root", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenOffsetsGenerator(tree, {
      spaceAroundRadius: 50,
    });

    const result = generator.generate();
    const offset = result.get("node-1");

    expect(offset).toEqual(0);
  });

  it("should set offset to zero for single child node", () => {
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
    const generator = new ChildrenOffsetsGenerator(tree, {
      spaceAroundRadius: 50,
    });

    const result = generator.generate();
    const offset = result.get("node-2");

    expect(offset).toEqual(0);
  });

  it("should offset offset by radius when node has two children", () => {
    /**
     *   /\
     */
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
      .addEdge({ from: "port-1", to: "port-2" })
      .addEdge({ from: "port-1", to: "port-3" });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenOffsetsGenerator(tree, {
      spaceAroundRadius: 50,
    });

    const result = generator.generate();
    const offset = result.get("node-2");

    expect(offset).toEqual(-50);
  });

  it("should adjust parent offsets when children overlap", () => {
    /**
     *        1
     *       / \
     *      /   \
     *     /     \
     *    2       3
     *   / \     / \
     *   | |     | |
     *   / \     / \
     *  5   6   7   8
     */
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
      .addNode({
        id: "node-5",
        element: document.createElement("div"),
        ports: [{ id: "port-5", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-6",
        element: document.createElement("div"),
        ports: [{ id: "port-6", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-7",
        element: document.createElement("div"),
        ports: [{ id: "port-7", element: document.createElement("div") }],
      })
      .addEdge({ from: "port-1", to: "port-2" })
      .addEdge({ from: "port-1", to: "port-3" })
      .addEdge({ from: "port-2", to: "port-4" })
      .addEdge({ from: "port-2", to: "port-5" })
      .addEdge({ from: "port-3", to: "port-6" })
      .addEdge({ from: "port-3", to: "port-7" });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenOffsetsGenerator(tree, {
      spaceAroundRadius: 50,
    });

    const result = generator.generate();
    const offset = result.get("node-2");

    expect(offset).toEqual(-100);
  });

  it("should not increase offset of node without children", () => {
    /**
     *        1
     *       / \
     *      /   \
     *     /     \
     *    2       3
     *          // \\
     *         / | | \
     *        /  / \  \
     *       4  5   6  7
     */
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
      .addNode({
        id: "node-5",
        element: document.createElement("div"),
        ports: [{ id: "port-5", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-6",
        element: document.createElement("div"),
        ports: [{ id: "port-6", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-7",
        element: document.createElement("div"),
        ports: [{ id: "port-7", element: document.createElement("div") }],
      })
      .addEdge({ from: "port-1", to: "port-2" })
      .addEdge({ from: "port-1", to: "port-3" })
      .addEdge({ from: "port-3", to: "port-4" })
      .addEdge({ from: "port-3", to: "port-5" })
      .addEdge({ from: "port-3", to: "port-6" })
      .addEdge({ from: "port-3", to: "port-7" });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenOffsetsGenerator(tree, {
      spaceAroundRadius: 50,
    });

    const result = generator.generate();
    const offset = result.get("node-2");

    expect(offset).toEqual(-50);
  });
});
