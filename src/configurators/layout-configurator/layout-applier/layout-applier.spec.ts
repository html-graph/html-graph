import { createCanvas, DummyLayoutAlgorithm } from "@/mocks";
import { LayoutApplier } from "./layout-applier";
import { Identifier } from "@/identifier";
import { LayoutApplierParams } from "./layout-applier-params";

describe("LayoutApplier", () => {
  it("should apply specified layout", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyLayoutAlgorithm();
    const params: LayoutApplierParams = {
      staticNodeResolver: (): boolean => false,
      onBeforeApplied: (): void => {},
      onAfterApplied: (): void => {},
    };

    const applier = new LayoutApplier(canvas, layoutAlgorithm, params);

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
    const params: LayoutApplierParams = {
      staticNodeResolver: (nodeId: Identifier): boolean => nodeId === "node-1",
      onBeforeApplied: (): void => {},
      onAfterApplied: (): void => {},
    };

    const applier = new LayoutApplier(canvas, layoutAlgorithm, params);

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
    const params: LayoutApplierParams = {
      staticNodeResolver: (): boolean => false,
      onBeforeApplied,
      onAfterApplied: (): void => {},
    };

    const applier = new LayoutApplier(canvas, layoutAlgorithm, params);

    applier.apply();

    expect(onBeforeApplied).toHaveBeenCalled();
  });

  it("should emit onAfterApplied event", () => {
    const canvas = createCanvas();
    const layoutAlgorithm = new DummyLayoutAlgorithm();
    const onAfterApplied = jest.fn();
    const params: LayoutApplierParams = {
      staticNodeResolver: (): boolean => false,
      onBeforeApplied: (): void => {},
      onAfterApplied,
    };

    const applier = new LayoutApplier(canvas, layoutAlgorithm, params);

    applier.apply();

    expect(onAfterApplied).toHaveBeenCalled();
  });
});
