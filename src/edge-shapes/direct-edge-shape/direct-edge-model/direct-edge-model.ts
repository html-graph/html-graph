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

  public readonly sourceArrowPoint: Point;

  public readonly targetArrowPoint: Point;

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
      this.sourceArrowPoint = from;
      this.targetArrowPoint = to;

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

    this.sourceArrowPoint = {
      x: from.x + sourceDirection.x * sourceOffset,
      y: from.y + sourceDirection.y * sourceOffset,
    };

    this.targetArrowPoint = {
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
      x: this.sourceArrowPoint.x + sourceDirection.x * diagonalBegin,
      y: this.sourceArrowPoint.y + sourceDirection.y * diagonalBegin,
    };

    const lineEnd: Point = {
      x: this.targetArrowPoint.x + targetDirection.x * diagonalEnd,
      y: this.targetArrowPoint.y + targetDirection.y * diagonalEnd,
    };

    this.linePath = `M ${lineBegin.x} ${lineBegin.y} L ${lineEnd.x} ${lineEnd.y}`;

    if (shapeParams.hasSourceArrow) {
      this.sourceArrowPath = shapeParams.arrowRenderer({
        direction: sourceDirection,
        shift: this.sourceArrowPoint,
        arrowLength: shapeParams.arrowLength,
      });
    }

    if (shapeParams.hasTargetArrow) {
      this.targetArrowPath = shapeParams.arrowRenderer({
        direction: targetDirection,
        shift: this.targetArrowPoint,
        arrowLength: shapeParams.arrowLength,
      });
    }
  }

  public calculateMidpoint(): Point {
    return {
      x: (this.sourceArrowPoint.x + this.targetArrowPoint.x) / 2,
      y: (this.sourceArrowPoint.y + this.targetArrowPoint.y) / 2,
    };
  }
}
