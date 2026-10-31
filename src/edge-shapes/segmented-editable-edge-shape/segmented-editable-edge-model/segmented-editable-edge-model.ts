import { Point } from "@/point";
import {
  createEdgeRectangle,
  createRotatedPoint,
  createRoundedPath,
  EdgeBox,
  EdgeRenderParams,
  StructuredEdgeModel,
  svgPadding,
} from "../../shared";
import { SegmentedEditableEdgeModelShapeParams } from "./segmented-editable-edge-model-shape-params";
import { createOrthogonalDirectionVector } from "./create-orthogonal-direction-vector";
import { createOrthogonalLinePoints } from "./create-orthogonal-line-points";
import { createArrowPoint } from "./create-arrow-point";
import { calculateMidpoint } from "./calculate-midpoint";

export class SegmentedEditableEdgeModel implements StructuredEdgeModel {
  public readonly box: EdgeBox;

  public readonly linePath: string;

  public readonly sourceArrowPath: string = "";

  public readonly targetArrowPath: string = "";

  public readonly shapeSourcePoint: Point;

  public readonly shapeTargetPoint: Point;

  public readonly linePoints: readonly Point[];

  public constructor(
    private readonly renderParams: EdgeRenderParams,
    private readonly shapeParams: SegmentedEditableEdgeModelShapeParams,
  ) {
    const { box, from, to } = createEdgeRectangle(
      this.renderParams.from,
      this.renderParams.to,
      svgPadding,
    );

    this.box = box;
    this.shapeSourcePoint = from;
    this.shapeTargetPoint = to;

    const sourceVector = createOrthogonalDirectionVector(
      this.renderParams.from.direction,
    );

    const targetVector = createOrthogonalDirectionVector(
      this.renderParams.to.direction,
    );

    const beginArrow: Point = createArrowPoint({
      origin: from,
      direction: sourceVector,
      arrowLength: this.shapeParams.arrowLength,
      hasArrow: this.shapeParams.hasSourceArrow,
    });

    const endArrow: Point = createArrowPoint({
      origin: to,
      direction: targetVector,
      arrowLength: -this.shapeParams.arrowLength,
      hasArrow: this.shapeParams.hasTargetArrow,
    });

    const gap = this.shapeParams.arrowLength + this.shapeParams.arrowOffset;

    const beginLine = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      sourceVector,
      from,
    );

    const endLine = createRotatedPoint(
      { x: to.x - gap, y: to.y },
      targetVector,
      to,
    );

    this.linePoints = createOrthogonalLinePoints(
      { arrowPoint: beginArrow, linePoint: beginLine, dir: sourceVector },
      { arrowPoint: endArrow, linePoint: endLine, dir: targetVector },
    );

    this.linePath = createRoundedPath(
      this.linePoints,
      this.shapeParams.roundness,
    );

    if (this.shapeParams.hasSourceArrow) {
      this.sourceArrowPath = this.shapeParams.arrowRenderer({
        direction: sourceVector,
        shift: from,
        arrowLength: this.shapeParams.arrowLength,
      });
    }

    if (this.shapeParams.hasTargetArrow) {
      this.targetArrowPath = this.shapeParams.arrowRenderer({
        direction: { x: -targetVector.x, y: -targetVector.y },
        shift: to,
        arrowLength: this.shapeParams.arrowLength,
      });
    }
  }

  public calculateMidpoint(): Point {
    const middlePoints = this.linePoints.slice(1, this.linePoints.length - 1);

    return calculateMidpoint([
      this.shapeSourcePoint,
      ...middlePoints,
      this.shapeTargetPoint,
    ]);
  }
}
