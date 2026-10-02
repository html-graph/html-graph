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

  public readonly from: Point;

  public readonly to: Point;

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
      this.from = from;
      this.to = to;

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

    this.from = {
      x: from.x + sourceDirection.x * sourceOffset,
      y: from.y + sourceDirection.y * sourceOffset,
    };

    this.to = {
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
      x: this.from.x + sourceDirection.x * diagonalBegin,
      y: this.from.y + sourceDirection.y * diagonalBegin,
    };

    const lineEnd: Point = {
      x: this.to.x + targetDirection.x * diagonalEnd,
      y: this.to.y + targetDirection.y * diagonalEnd,
    };

    this.linePath = `M ${lineBegin.x} ${lineBegin.y} L ${lineEnd.x} ${lineEnd.y}`;

    if (shapeParams.hasSourceArrow) {
      this.sourceArrowPath = shapeParams.arrowRenderer({
        direction: sourceDirection,
        shift: this.from,
        arrowLength: shapeParams.arrowLength,
      });
    }

    if (shapeParams.hasTargetArrow) {
      this.targetArrowPath = shapeParams.arrowRenderer({
        direction: targetDirection,
        shift: this.to,
        arrowLength: shapeParams.arrowLength,
      });
    }
  }

  public calculateMidpoint(): Point {
    return {
      x: (this.from.x + this.to.x) / 2,
      y: (this.from.y + this.to.y) / 2,
    };
  }
}
