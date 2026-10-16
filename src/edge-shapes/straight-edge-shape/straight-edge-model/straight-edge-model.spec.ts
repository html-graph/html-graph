import { describe, expect, it } from "vitest";
import { EdgeRenderParams, ConnectionCategory } from "../../shared";
import { StraightEdgeModelShapeParams } from "./straight-edge-model-shape-params";
import { StraightEdgeModel } from "./straight-edge-model";

const createShapeParams = (params?: {
  hasSourceArrow?: boolean;
  hasTargetArrow?: boolean;
}): StraightEdgeModelShapeParams => {
  return {
    hasSourceArrow: params?.hasSourceArrow ?? false,
    hasTargetArrow: params?.hasTargetArrow ?? false,
    arrowRenderer: () => "",
    arrowLength: 10,
    arrowOffset: 5,
    roundness: 5,
    cycleSquareSide: 50,
    detourDistance: 100,
    detourDirection: Math.PI / 2,
  };
};

describe("StraightEdgeModel", () => {
  it("should initialize rendering box", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: StraightEdgeModelShapeParams = createShapeParams();

    const model = new StraightEdgeModel(renderingParams, shapeParams);

    expect(model.box).toEqual({ x: -50, y: -50, width: 200, height: 200 });
  });

  it("should set source point", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: StraightEdgeModelShapeParams = createShapeParams();

    const model = new StraightEdgeModel(renderingParams, shapeParams);

    expect(model.shapeSourcePoint).toEqual({ x: 50, y: 50 });
  });

  it("should set target point", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: StraightEdgeModelShapeParams = createShapeParams();

    const model = new StraightEdgeModel(renderingParams, shapeParams);

    expect(model.shapeTargetPoint).toEqual({ x: 150, y: 150 });
  });

  it("should set line path without arrows", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: StraightEdgeModelShapeParams = createShapeParams();

    const model = new StraightEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe(
      "M 50 50 L 60 50 C 65 50 65 50 70 50 L 130 50 C 135 50 135 50 140 50 L 150 50",
    );
  });

  it("should set line path accounting for source arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: StraightEdgeModelShapeParams = createShapeParams({
      hasSourceArrow: true,
    });

    const model = new StraightEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe(
      "M 60 50 L 60 50 C 65 50 65 50 70 50 L 130 50 C 135 50 135 50 140 50 L 150 50",
    );
  });

  it("should set line path accounting for target arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: StraightEdgeModelShapeParams = createShapeParams({
      hasTargetArrow: true,
    });

    const model = new StraightEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe(
      "M 50 50 L 60 50 C 65 50 65 50 70 50 L 130 50 C 135 50 135 50 140 50 L 140 50",
    );
  });

  it("should calculate midpoint", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: StraightEdgeModelShapeParams = createShapeParams();

    const model = new StraightEdgeModel(renderingParams, shapeParams);

    expect(model.calculateMidpoint()).toEqual({ x: 100, y: 50 });
  });

  it("should adjust target direction for port cycle", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.PortCycle,
    };

    const shapeParams: StraightEdgeModelShapeParams = createShapeParams();

    const model = new StraightEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe(
      "M 50 50 L 60 50 M 60 50 L 60 50 C 65 50 65 50 65 55 L 65 95 C 65 100 65 100 70 100 L 160 100 C 165 100 165 100 165 95 L 165 5 C 165 0 165 0 160 0 L 70 0 C 65 0 65 0 65 5 L 65 45 C 65 50 65 50 60 50 L 60 50",
    );
  });
});
