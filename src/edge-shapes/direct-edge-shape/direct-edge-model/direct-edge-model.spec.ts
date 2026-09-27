import { ConnectionCategory, EdgeRenderParams } from "@/edge-shapes/shared";
import { describe, expect, it } from "vitest";
import { DirectEdgeModel } from "./direct-edge-model";
import { DirectEdgeModelShapeParams } from "./direct-edge-model-shape-params";

describe("DirectEdgeModel", () => {
  it("should initialize rendering box", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 0,
      targetOffsetFn: () => 0,
      hasSourceArrow: false,
      hasTargetArrow: false,
      arrowRenderer: () => "",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.box).toEqual({ x: -50, y: -50, width: 200, height: 200 });
  });

  it("should set source point when diagonal has 0 length", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 0,
      targetOffsetFn: () => 0,
      hasSourceArrow: false,
      hasTargetArrow: false,
      arrowRenderer: () => "",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.sourcePoint).toEqual({ x: 50, y: 50 });
  });

  it("should set target point when diagonal has 0 length", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 0,
      targetOffsetFn: () => 0,
      hasSourceArrow: false,
      hasTargetArrow: false,
      arrowRenderer: () => "",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.targetPoint).toEqual({ x: 50, y: 50 });
  });

  it("should set source point accounting for arrow offset", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 10,
      targetOffsetFn: () => 0,
      hasSourceArrow: true,
      hasTargetArrow: false,
      arrowRenderer: () => "",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.sourcePoint).toEqual({ x: 60, y: 50 });
  });

  it("should set target point accounting for arrow offset", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 0,
      targetOffsetFn: () => 10,
      hasSourceArrow: false,
      hasTargetArrow: true,
      arrowRenderer: () => "",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.targetPoint).toEqual({ x: 140, y: 50 });
  });

  it("should set line path without arrows", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 10,
      targetOffsetFn: () => 10,
      hasSourceArrow: false,
      hasTargetArrow: false,
      arrowRenderer: () => "",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe("M 60 50 L 140 50");
  });

  it("should set line path accounting for source arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 10,
      targetOffsetFn: () => 10,
      hasSourceArrow: true,
      hasTargetArrow: false,
      arrowRenderer: () => "",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe("M 70 50 L 140 50");
  });

  it("should set line path accounting for target arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 10,
      targetOffsetFn: () => 10,
      hasSourceArrow: false,
      hasTargetArrow: true,
      arrowRenderer: () => "",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toBe("M 60 50 L 130 50");
  });

  it("should set path for source arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 10,
      targetOffsetFn: () => 10,
      hasSourceArrow: true,
      hasTargetArrow: false,
      arrowRenderer: () => "arrow path",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.sourceArrowPath).toBe("arrow path");
  });

  it("should set path for target arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 10,
      targetOffsetFn: () => 10,
      hasSourceArrow: false,
      hasTargetArrow: true,
      arrowRenderer: () => "arrow path",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.targetArrowPath).toBe("arrow path");
  });

  it("should calculate midpoint", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 0, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: DirectEdgeModelShapeParams = {
      sourceOffsetFn: () => 10,
      targetOffsetFn: () => 10,
      hasSourceArrow: false,
      hasTargetArrow: true,
      arrowRenderer: () => "arrow path",
      arrowLength: 10,
    };

    const model = new DirectEdgeModel(renderingParams, shapeParams);

    expect(model.calculateMidpoint()).toEqual({ x: 100, y: 50 });
  });
});
