import { createCanvas, DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { Identifier } from "@/identifier";
import { AnimatedLayoutApplier } from "./animated-layout-applier";

describe("AnimatedLayoutApplier", () => {
  it("should apply specified layout", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyAnimatedLayoutAlgorithm();
    const applier = new AnimatedLayoutApplier(canvas, layoutAlgorithm, {
      staticNodeResolver: (): boolean => false,
      onBeforeApplied: (): void => {},
      onAfterApplied: (): void => {},
    });

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
    const applier = new AnimatedLayoutApplier(canvas, layoutAlgorithm, {
      staticNodeResolver: (nodeId: Identifier): boolean => nodeId === "node-1",
      onBeforeApplied: (): void => {},
      onAfterApplied: (): void => {},
    });

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
    const applier = new AnimatedLayoutApplier(canvas, layoutAlgorithm, {
      staticNodeResolver: (): boolean => false,
      onBeforeApplied,
      onAfterApplied: (): void => {},
    });

    applier.apply(1);

    expect(onBeforeApplied).toHaveBeenCalled();
  });

  it("should emit onAfterApplied event", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyAnimatedLayoutAlgorithm();
    const onAfterApplied = jest.fn();
    const applier = new AnimatedLayoutApplier(canvas, layoutAlgorithm, {
      staticNodeResolver: (): boolean => false,
      onBeforeApplied: (): void => {},
      onAfterApplied,
    });

    applier.apply(1);

    expect(onAfterApplied).toHaveBeenCalled();
  });
});
