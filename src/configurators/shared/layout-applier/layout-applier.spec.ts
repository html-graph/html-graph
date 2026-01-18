import { createCanvas, DummyLayoutAlgorithm } from "@/mocks";
import { LayoutApplier } from "./layout-applier";
import { Identifier } from "@/identifier";

describe("LayoutApplier", () => {
  it("should apply specified layout", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyLayoutAlgorithm();
    const applier = new LayoutApplier(canvas, layoutAlgorithm, {
      staticNodeResolver: (): boolean => false,
      onBeforeApplied: (): void => {},
      onAfterApplied: (): void => {},
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
      onBeforeApplied: (): void => {},
      onAfterApplied: (): void => {},
    });

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    applier.apply();

    expect(canvas.graph.getNode("node-1").x).toBe(null);
  });

  it("should emit onBeforeApplied event", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyLayoutAlgorithm();
    const onBeforeApplied = jest.fn();
    const applier = new LayoutApplier(canvas, layoutAlgorithm, {
      staticNodeResolver: (): boolean => false,
      onBeforeApplied,
      onAfterApplied: (): void => {},
    });

    applier.apply();

    expect(onBeforeApplied).toHaveBeenCalled();
  });

  it("should emit onAfterApplied event", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyLayoutAlgorithm();
    const onAfterApplied = jest.fn();
    const applier = new LayoutApplier(canvas, layoutAlgorithm, {
      staticNodeResolver: (): boolean => false,
      onBeforeApplied: (): void => {},
      onAfterApplied,
    });

    applier.apply();

    expect(onAfterApplied).toHaveBeenCalled();
  });
});
