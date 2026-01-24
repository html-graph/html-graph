import { createCanvas } from "@/mocks";
import { ChildrenOffsetsGenerator } from "./children-offsets-generator";
import { WidthFirstSpanningForestGenerator } from "../spanning-forest-generator";

describe("ChildrenOffsetsGenerator", () => {
  it("should zero delta when node is root", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenOffsetsGenerator(tree, {
      sparsityRadius: 50,
    });

    const result = generator.generate();
    const delta = result.get("node-1");

    expect(delta).toEqual(0);
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
    const generator = new ChildrenOffsetsGenerator(tree, {
      sparsityRadius: 50,
    });

    const result = generator.generate();
    const delta = result.get("node-2");

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
    const generator = new ChildrenOffsetsGenerator(tree, {
      sparsityRadius: 50,
    });

    const result = generator.generate();
    const delta = result.get("node-2");

    expect(delta).toEqual(-50);
  });

  it("should account for children of children", () => {
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
      .addEdge({ from: "port-4", to: "port-6" })
      .addEdge({ from: "port-4", to: "port-7" });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenOffsetsGenerator(tree, {
      sparsityRadius: 50,
    });

    const result = generator.generate();
    const delta = result.get("node-2");

    expect(delta).toEqual(-100);
  });
});
