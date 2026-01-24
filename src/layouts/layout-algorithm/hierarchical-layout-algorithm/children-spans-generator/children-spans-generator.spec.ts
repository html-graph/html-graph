import { createCanvas } from "@/mocks";
import { ChildrenSpansGenerator } from "./children-spans-generator";
import { WidthFirstSpanningForestGenerator } from "../spanning-forest-generator";

describe("ChildrenSpansGenerator", () => {
  it("should have null span when node is a leaf", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenSpansGenerator(tree, { sparsityRadius: 50 });

    const result = generator.generate();
    const radius = result.radii.get("node-1");

    expect(radius).toEqual(50);
  });

  it("should zero delta when node is root", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenSpansGenerator(tree, { sparsityRadius: 50 });

    const result = generator.generate();
    const delta = result.deltas.get("node-1");

    expect(delta).toEqual(0);
  });

  it("should inherit child span when node has one leaf", () => {
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
    const generator = new ChildrenSpansGenerator(tree, { sparsityRadius: 50 });

    const result = generator.generate();
    const radius = result.radii.get("node-1");

    expect(radius).toEqual(50);
  });

  it("should account for childnen radii", () => {
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
    const generator = new ChildrenSpansGenerator(tree, { sparsityRadius: 50 });

    const result = generator.generate();
    const radius = result.radii.get("node-1");

    expect(radius).toEqual(100);
  });

  it("should set delta to zero for single child node", () => {
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
    const generator = new ChildrenSpansGenerator(tree, { sparsityRadius: 50 });

    const result = generator.generate();
    const delta = result.deltas.get("node-2");

    expect(delta).toEqual(0);
  });

  it("should offset delta by radius when node has two children", () => {
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
    const generator = new ChildrenSpansGenerator(tree, { sparsityRadius: 50 });

    const result = generator.generate();
    const delta = result.deltas.get("node-2");

    expect(delta).toEqual(-50);
  });

  it("should account for combination of leaf and non-leaf nodes when calculating radius", () => {
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
      .addEdge({ from: "port-1", to: "port-2" })
      .addEdge({ from: "port-1", to: "port-3" })
      .addEdge({ from: "port-3", to: "port-4" })
      .addEdge({ from: "port-3", to: "port-5" });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenSpansGenerator(tree, { sparsityRadius: 50 });

    const result = generator.generate();
    const radius = result.radii.get("node-1");

    expect(radius).toEqual(125);
  });
});
