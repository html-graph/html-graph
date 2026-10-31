import { ConnectionCategory, EdgeRenderParams } from "../../shared";
import { describe, expect, it } from "vitest";
import { SegmentedEditableEdgeModel } from "./segmented-editable-edge-model";
import { SegmentedEditableEdgeModelShapeParams } from "./segmented-editable-edge-model-shape-params";

const createShapeParams = (params?: {
  hasSourceArrow?: boolean;
  hasTargetArrow?: boolean;
}): SegmentedEditableEdgeModelShapeParams => {
  return {
    hasSourceArrow: params?.hasSourceArrow ?? false,
    hasTargetArrow: params?.hasTargetArrow ?? false,
    arrowLength: 10,
    arrowOffset: 5,
    arrowRenderer: () => "arrow path",
    roundness: 5,
  };
};

describe("SegmentedEditableEdgeModel", () => {
  it("should initialize rendering box", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.box).toEqual({ x: -50, y: -50, width: 200, height: 200 });
  });

  it("should set source point", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.shapeSourcePoint).toEqual({ x: 50, y: 50 });
  });

  it("should set target point", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.shapeTargetPoint).toEqual({ x: 150, y: 150 });
  });

  it("should set line points", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.linePoints).toEqual([
      {
        x: 50,
        y: 50,
      },
      {
        x: 100,
        y: 50,
      },
      {
        x: 100,
        y: 150,
      },
      {
        x: 150,
        y: 150,
      },
    ]);
  });

  it("should set line path", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.linePath).toEqual(
      "M 50 50 L 95 50 C 100 50 100 50 100 55 L 100 145 C 100 150 100 150 105 150 L 150 150",
    );
  });

  it("should set source arrow path", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams({ hasSourceArrow: true });

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.sourceArrowPath).toEqual("arrow path");
  });

  it("should set target arrow path", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams({ hasTargetArrow: true });

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.targetArrowPath).toEqual("arrow path");
  });

  it("should calculate midpoint", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.calculateMidpoint()).toEqual({ x: 100, y: 100 });
  });

  it("should calculate midpoint when has source arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams({ hasSourceArrow: true });

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.calculateMidpoint()).toEqual({ x: 100, y: 100 });
  });

  it("should calculate midpoint when has target arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedEditableEdgeModelShapeParams =
      createShapeParams({ hasTargetArrow: true });

    const model = new SegmentedEditableEdgeModel(renderingParams, shapeParams);

    expect(model.calculateMidpoint()).toEqual({ x: 100, y: 100 });
  });
});
