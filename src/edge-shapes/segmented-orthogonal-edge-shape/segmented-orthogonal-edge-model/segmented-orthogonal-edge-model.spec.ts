import { ConnectionCategory, EdgeRenderParams } from "../../shared";
import { describe, expect, it } from "vitest";
import { SegmentedOrthogonalEdgeModel } from "./segmented-orthogonal-edge-model";
import { SegmentedOrthogonalEdgeModelShapeParams } from "./segmented-orthogonal-edge-model-shape-params";

const createShapeParams = (params?: {
  hasSourceArrow?: boolean;
  hasTargetArrow?: boolean;
}): SegmentedOrthogonalEdgeModelShapeParams => {
  return {
    hasSourceArrow: params?.hasSourceArrow ?? false,
    hasTargetArrow: params?.hasTargetArrow ?? false,
    arrowLength: 10,
    arrowOffset: 5,
    arrowRenderer: () => "arrow path",
    roundness: 5,
  };
};

describe("SegmentedOrthogonalEdgeModel", () => {
  it("should initialize rendering box", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedOrthogonalEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedOrthogonalEdgeModel(
      renderingParams,
      shapeParams,
    );

    expect(model.box).toEqual({ x: -50, y: -50, width: 200, height: 200 });
  });

  it("should set source point", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedOrthogonalEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedOrthogonalEdgeModel(
      renderingParams,
      shapeParams,
    );

    expect(model.shapeSourcePoint).toEqual({ x: 50, y: 50 });
  });

  it("should set target point", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedOrthogonalEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedOrthogonalEdgeModel(
      renderingParams,
      shapeParams,
    );

    expect(model.shapeTargetPoint).toEqual({ x: 150, y: 150 });
  });

  it("should set line points", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedOrthogonalEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedOrthogonalEdgeModel(
      renderingParams,
      shapeParams,
    );

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

  it("should calculate midpoint", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedOrthogonalEdgeModelShapeParams =
      createShapeParams();

    const model = new SegmentedOrthogonalEdgeModel(
      renderingParams,
      shapeParams,
    );

    expect(model.calculateMidpoint()).toEqual({ x: 100, y: 100 });
  });

  it("should calculate midpoint when has source arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedOrthogonalEdgeModelShapeParams =
      createShapeParams({ hasSourceArrow: true });

    const model = new SegmentedOrthogonalEdgeModel(
      renderingParams,
      shapeParams,
    );

    expect(model.calculateMidpoint()).toEqual({ x: 100, y: 100 });
  });

  it("should calculate midpoint when has target arrow", () => {
    const renderingParams: EdgeRenderParams = {
      from: { x: 0, y: 0, width: 0, height: 0, direction: 0 },
      to: { x: 100, y: 100, width: 0, height: 0, direction: 0 },
      category: ConnectionCategory.Line,
    };

    const shapeParams: SegmentedOrthogonalEdgeModelShapeParams =
      createShapeParams({ hasTargetArrow: true });

    const model = new SegmentedOrthogonalEdgeModel(
      renderingParams,
      shapeParams,
    );

    expect(model.calculateMidpoint()).toEqual({ x: 100, y: 100 });
  });
});
