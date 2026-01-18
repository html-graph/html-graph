import { createCanvas, DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { Identifier } from "@/identifier";
import { AnimatedLayoutApplier } from "./animated-layout-applier";
import { AnimatedLayoutApplierParams } from "./animated-layout-applier-params";

describe("AnimatedLayoutApplier", () => {
  it("should apply specified layout", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyAnimatedLayoutAlgorithm();
    const params: AnimatedLayoutApplierParams = {
      staticNodeResolver: () => false,
      onBeforeApplied: () => {},
      onAfterApplied: () => {},
    };

    const applier = new AnimatedLayoutApplier(canvas, layoutAlgorithm, params);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    applier.apply(1);

    expect(canvas.graph.getNode("node-1").x).toBe(0);
  });

  it("should not apply layout for static nodes", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyAnimatedLayoutAlgorithm();
    const params: AnimatedLayoutApplierParams = {
      staticNodeResolver: (nodeId: Identifier) => nodeId === "node-1",
      onBeforeApplied: () => {},
      onAfterApplied: () => {},
    };

    const applier = new AnimatedLayoutApplier(canvas, layoutAlgorithm, params);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    applier.apply(1);

    expect(canvas.graph.getNode("node-1").x).toBe(null);
  });

  it("should emit onBeforeApplied event", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyAnimatedLayoutAlgorithm();
    const onBeforeApplied = jest.fn();

    const params: AnimatedLayoutApplierParams = {
      staticNodeResolver: () => false,
      onBeforeApplied,
      onAfterApplied: () => {},
    };

    const applier = new AnimatedLayoutApplier(canvas, layoutAlgorithm, params);

    applier.apply(1);

    expect(onBeforeApplied).toHaveBeenCalled();
  });

  it("should emit onAfterApplied event", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyAnimatedLayoutAlgorithm();
    const onAfterApplied = jest.fn();

    const params: AnimatedLayoutApplierParams = {
      staticNodeResolver: () => false,
      onBeforeApplied: () => {},
      onAfterApplied,
    };

    const applier = new AnimatedLayoutApplier(canvas, layoutAlgorithm, params);

    applier.apply(1);

    expect(onAfterApplied).toHaveBeenCalled();
  });
});
