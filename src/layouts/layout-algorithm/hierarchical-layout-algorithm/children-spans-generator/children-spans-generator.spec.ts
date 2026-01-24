import { createCanvas } from "@/mocks";
import { ChildrenSpansGenerator } from "./children-spans-generator";
import { WidthFirstSpanningForestGenerator } from "../spanning-forest-generator";
import { ChildrenSpan } from "./children-span";

describe("ChildrenSpansGenerator", () => {
  it("should have [0, 0] span when node is a leaf", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenSpansGenerator(tree, { layerSparsity: 100 });

    const diameters = generator.generate();

    const expected: ChildrenSpan = { start: 0, end: 0 };

    expect(diameters.get("node-1")).toEqual(expected);
  });

  it("should have [0, 0] span when node has one leaf", () => {
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
    const generator = new ChildrenSpansGenerator(tree, { layerSparsity: 100 });

    const diameters = generator.generate();

    const expected: ChildrenSpan = { start: 0, end: 0 };

    expect(diameters.get("node-1")).toEqual(expected);
  });

  it("should adjust span when node has 2 leaf children", () => {
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
    const generator = new ChildrenSpansGenerator(tree, { layerSparsity: 100 });

    const diameters = generator.generate();

    const expected: ChildrenSpan = { start: -50, end: 50 };

    expect(diameters.get("node-1")).toEqual(expected);
  });
});
