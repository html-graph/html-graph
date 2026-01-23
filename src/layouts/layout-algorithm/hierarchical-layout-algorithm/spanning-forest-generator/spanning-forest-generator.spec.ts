import { createCanvas } from "@/mocks";
import { SpanningForestGenerator } from "./spanning-forest-generator";

describe("SpanningForestGenerator", () => {
  it("should generate empty forest for graph without nodes", () => {
    const canvas = createCanvas();

    const forestGenerator = new SpanningForestGenerator(canvas.graph);
    const forest = forestGenerator.generate();

    expect(forest).toEqual(new Set());
  });

  it("should generate single node tree for single node graph", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new SpanningForestGenerator(canvas.graph);
    const forest = forestGenerator.generate();

    expect(forest).toEqual(
      new Set([{ parent: null, nodeId: "node-1", children: new Set() }]),
    );
  });
});
