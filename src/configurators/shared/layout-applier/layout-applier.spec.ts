import { createCanvas, DummyLayoutAlgorithm } from "@/mocks";
import { LayoutApplier } from "./layout-applier";
import { Identifier } from "@/identifier";

describe("LayoutApplier", () => {
  it("should apply specified layout", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyLayoutAlgorithm();
    const applier = new LayoutApplier(canvas, layoutAlgorithm, {
      staticNodeResolver: (): boolean => false,
    });

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    applier.apply();

    expect(canvas.graph.getNode("node-1").x).toBe(0);
  });

  it("should not apply layout for static nodes", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyLayoutAlgorithm();
    const applier = new LayoutApplier(canvas, layoutAlgorithm, {
      staticNodeResolver: (nodeId: Identifier): boolean => nodeId === "node-1",
    });

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    applier.apply();

    expect(canvas.graph.getNode("node-1").x).toBe(null);
  });
});
