import { describe, expect, it } from "vitest";
import { EdgeRenderParams } from "../../edge-render-params";
import { ConnectionCategory } from "../../connection-category";
import { PathEdgeModelShapeParams } from "./path-edge-model-shape-params";
import { PathEdgeModel } from "./path-edge-model";
import { svgPadding } from "../../svg-padding";
import {
  BezierEdgePath,
  CycleCircleEdgePath,
  DetourBezierEdgePath,
} from "../../paths";

const createShapeParams = (params?: {
  hasSourceArrow?: boolean;
  hasTargetArrow?: boolean;
}): PathEdgeModelShapeParams => {
  return {
    createLinePath: (from, to) =>
      new BezierEdgePath({
        from,
        to,
        arrowLength: 10,
        curvature: 90,
      }),
    createNodeCyclePath: (from, to) =>
      new DetourBezierEdgePath({
        from,
        to,
        arrowLength: 10,
        curvature: 90,
        detourDistance: 100,
        detourDir: 0,
      }),
    createPortCyclePath: (from, to) =>
      new CycleCircleEdgePath({
        from,
        to,
        radius: 10,
        smallRadius: 2,
        arrowLength: 10,
      }),
    hasSourceArrow: params?.hasSourceArrow ?? false,
    hasTargetArrow: params?.hasTargetArrow ?? false,
    arrowRenderer: () => "",
    arrowLength: 10,
    padding: svgPadding,
  };
};

describe("PathEdgeModel", () => {
  it("should initialize rendering box", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: PathEdgeModelShapeParams = createShapeParams();

    const model = new PathEdgeModel(renderingParams, shapeParams);

    expect(model.box).toEqual({ x: -50, y: -50, width: 200, height: 200 });
  });

  it("should set source point", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: PathEdgeModelShapeParams = createShapeParams();

    const model = new PathEdgeModel(renderingParams, shapeParams);

    expect(model.sourcePoint).toEqual({ x: 50, y: 50 });
  });

  it("should set target point", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: PathEdgeModelShapeParams = createShapeParams();

    const model = new PathEdgeModel(renderingParams, shapeParams);

    expect(model.targetPoint).toEqual({ x: 150, y: 150 });
  });

  it("should set line path without arrows", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: PathEdgeModelShapeParams = createShapeParams();

    const model = new PathEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe(
      "M 50 50 L 60 50 M 60 50 C 150 50, 50 50, 140 50 M 140 50 L 150 50",
    );
  });

  it("should set line path accounting for source arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: PathEdgeModelShapeParams = createShapeParams({
      hasSourceArrow: true,
    });

    const model = new PathEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe(
      "M 60 50 C 150 50, 50 50, 140 50 M 140 50 L 150 50",
    );
  });

  it("should set line path accounting for target arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: PathEdgeModelShapeParams = createShapeParams({
      hasTargetArrow: true,
    });

    const model = new PathEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe(
      "M 50 50 L 60 50 M 60 50 C 150 50, 50 50, 140 50",
    );
  });

  it("should calculate midpoint", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: PathEdgeModelShapeParams = createShapeParams();

    const model = new PathEdgeModel(renderingParams, shapeParams);

    expect(model.calculateMidpoint()).toEqual({ x: 100, y: 50 });
  });

  it("should adjust target direction for port cycle", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.PortCycle,
    };

    const shapeParams: PathEdgeModelShapeParams = createShapeParams();

    const model = new PathEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe(
      "M 50 50 L 60 50 M 60 50 A 2 2 0 0 1 61.97202659436654 51.666666666666664 A 10 10 0 1 0 61.97202659436654 48.333333333333336 A 2 2 0 0 1 60 50",
    );
  });
});
