import {
  ArrowRenderer,
  createEdgeRectangle,
  EdgeRenderParams,
  StructuredEdgeModel,
  svgPadding,
} from "../../shared";
import { Point } from "@/point";
import { PortOffsetFn } from "../resolve-port-offset-fn";
import { EdgeBox } from "../../shared";

export class DirectEdgeModel implements StructuredEdgeModel {
  public readonly box: EdgeBox;

  public readonly linePath: string = "";

  public readonly sourceArrowPath: string = "";

  public readonly targetArrowPath: string = "";

  public readonly sourcePoint: Point;

  public readonly targetPoint: Point;

  public readonly linePoints: readonly Point[];

  private readonly lineBegin: Point;

  private readonly lineEnd: Point;

  public constructor(
    renderParams: EdgeRenderParams,
    shapeParams: {
      readonly sourceOffsetFn: PortOffsetFn;
      readonly targetOffsetFn: PortOffsetFn;
      readonly diagonalBegin: number;
      readonly diagonalEnd: number;
      readonly hasSourceArrow: boolean;
      readonly hasTargetArrow: boolean;
      readonly arrowRenderer: ArrowRenderer;
      readonly arrowLength: number;
    },
  ) {
    const { x, y, width, height, from, to } = createEdgeRectangle(
      renderParams.from,
      renderParams.to,
      svgPadding,
    );

    this.box = { x, y, width, height };

    const diagonal: Point = {
      x: to.x - from.x,
      y: to.y - from.y,
    };

    const diagonalLength = Math.sqrt(
      diagonal.x * diagonal.x + diagonal.y * diagonal.y,
    );

    if (diagonalLength > 0) {
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

      this.lineBegin = {
        x: this.sourcePoint.x + sourceDirection.x * shapeParams.diagonalBegin,
        y: this.sourcePoint.y + sourceDirection.y * shapeParams.diagonalBegin,
      };

      this.lineEnd = {
        x: this.targetPoint.x + targetDirection.x * shapeParams.diagonalEnd,
        y: this.targetPoint.y + targetDirection.y * shapeParams.diagonalEnd,
      };

      this.linePath = `M ${this.lineBegin.x} ${this.lineBegin.y} L ${this.lineEnd.x} ${this.lineEnd.y}`;

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
    } else {
      this.sourcePoint = from;
      this.targetPoint = to;
      this.lineBegin = from;
      this.lineEnd = to;
    }

    this.linePoints = [this.lineBegin, this.lineEnd];
  }

  public calculateMidpoint(): Point {
    return {
      x: (this.sourcePoint.x + this.targetPoint.x) / 2,
      y: (this.sourcePoint.y + this.targetPoint.y) / 2,
    };
  }
}
