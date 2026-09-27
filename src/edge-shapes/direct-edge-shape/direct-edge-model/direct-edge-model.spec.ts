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
});
