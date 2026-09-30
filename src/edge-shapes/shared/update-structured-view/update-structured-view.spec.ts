import { describe, expect, it } from "vitest";
import { StructuredEdgeModel } from "../structured-edge-shape-model";
import { updateStructuredView } from "./update-structured-view";
import { StructuredEdgeView } from "../structured-view";
import { Point } from "@/point";

const createModel = (): StructuredEdgeModel => {
  return {
    box: { x: 0, y: 0, width: 100, height: 100 },
    linePath: "line path",
    sourceArrowPath: "source arrow path",
    targetArrowPath: "target arrow path",
    sourceArrowPoint: { x: 0, y: 0 },
    targetArrowPoint: { x: 100, y: 100 },
    calculateMidpoint: (): Point => {
      return { x: 50, y: 50 };
    },
  };
};

describe("updateStructuredView", () => {
  it("should set main element width", () => {
    const model = createModel();

    const view = new StructuredEdgeView({
      color: "red",
      width: 1,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    updateStructuredView(view, model);

    expect(view.element.style.width).toBe("100px");
  });

  it("should set line path", () => {
    const model = createModel();

    const view = new StructuredEdgeView({
      color: "red",
      width: 1,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    updateStructuredView(view, model);

    expect(view.line.getAttribute("d")).toBe("line path");
  });

  it("should set source arrow path", () => {
    const model = createModel();

    const view = new StructuredEdgeView({
      color: "red",
      width: 1,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    updateStructuredView(view, model);

    expect(view.sourceArrow!.getAttribute("d")).toBe("source arrow path");
  });

  it("should set target arrow path", () => {
    const model = createModel();

    const view = new StructuredEdgeView({
      color: "red",
      width: 1,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    updateStructuredView(view, model);

    expect(view.targetArrow!.getAttribute("d")).toBe("target arrow path");
  });
});
