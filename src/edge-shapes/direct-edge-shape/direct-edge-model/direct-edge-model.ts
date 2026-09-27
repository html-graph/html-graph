import {
  createEdgeRectangle,
  EdgeRenderParams,
  StructuredEdgeModel,
  svgPadding,
  EdgeBox,
} from "../../shared";
import { Point } from "@/point";
import { DirectEdgeModelShapeParams } from "./direct-edge-model-shape-params";

export class DirectEdgeModel implements StructuredEdgeModel {
  public readonly box: EdgeBox;

  public readonly linePath: string = "";

  public readonly sourceArrowPath: string = "";

  public readonly targetArrowPath: string = "";

  public readonly sourcePoint: Point;

  public readonly targetPoint: Point;

  public constructor(
    renderParams: EdgeRenderParams,
    shapeParams: DirectEdgeModelShapeParams,
  ) {
    const { box, from, to } = createEdgeRectangle(
      renderParams.from,
      renderParams.to,
      svgPadding,
    );

    this.box = box;

    const diagonal: Point = {
      x: to.x - from.x,
      y: to.y - from.y,
    };

    const diagonalLength = Math.sqrt(
      diagonal.x * diagonal.x + diagonal.y * diagonal.y,
    );

    if (diagonalLength === 0) {
      this.sourcePoint = from;
      this.targetPoint = to;

      return;
    }

    const sourceDirection: Point = {
      x: diagonal.x / diagonalLength,
      y: diagonal.y / diagonalLength,
    };

    const targetDirection: Point = {
      x: -sourceDirection.x,
      y: -sourceDirection.y,
    };

    const sourceOffset = shapeParams.sourceOffsetFn({
      direction: sourceDirection,
      radius: {
        horizontal: renderParams.from.width / 2,
        vertical: renderParams.from.height / 2,
      },
    });

    const targetOffset = shapeParams.targetOffsetFn({
      direction: targetDirection,
      radius: {
        horizontal: renderParams.to.width / 2,
        vertical: renderParams.to.height / 2,
      },
    });

    this.sourcePoint = {
      x: from.x + sourceDirection.x * sourceOffset,
      y: from.y + sourceDirection.y * sourceOffset,
    };

    this.targetPoint = {
      x: to.x + targetDirection.x * targetOffset,
      y: to.y + targetDirection.y * targetOffset,
    };

    const diagonalBegin = shapeParams.hasSourceArrow
      ? shapeParams.arrowLength
      : 0;

    const diagonalEnd = shapeParams.hasTargetArrow
      ? shapeParams.arrowLength
      : 0;

    const lineBegin: Point = {
      x: this.sourcePoint.x + sourceDirection.x * diagonalBegin,
      y: this.sourcePoint.y + sourceDirection.y * diagonalBegin,
    };

    const lineEnd: Point = {
      x: this.targetPoint.x + targetDirection.x * diagonalEnd,
      y: this.targetPoint.y + targetDirection.y * diagonalEnd,
    };

    this.linePath = `M ${lineBegin.x} ${lineBegin.y} L ${lineEnd.x} ${lineEnd.y}`;

    if (shapeParams.hasSourceArrow) {
      this.sourceArrowPath = shapeParams.arrowRenderer({
        direction: sourceDirection,
        shift: this.sourcePoint,
        arrowLength: shapeParams.arrowLength,
      });
    }

    if (shapeParams.hasTargetArrow) {
      this.targetArrowPath = shapeParams.arrowRenderer({
        direction: targetDirection,
        shift: this.targetPoint,
        arrowLength: shapeParams.arrowLength,
      });
    }
  }

  public calculateMidpoint(): Point {
    return {
      x: (this.sourcePoint.x + this.targetPoint.x) / 2,
      y: (this.sourcePoint.y + this.targetPoint.y) / 2,
    };
  }
}
