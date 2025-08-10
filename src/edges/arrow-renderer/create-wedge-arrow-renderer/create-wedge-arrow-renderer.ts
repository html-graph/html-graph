import { createRotatedPoint } from "../../geometry";
import { Point, zero } from "@/point";
import { ArrowRenderer } from "../arrow-renderer";
import { ArrowRenderingParams } from "../arrow-rendering-params";

export const createWedgeArrowRenderer = (params: {
  readonly smallRadius: number;
  readonly radius: number;
  readonly angle: number;
}): ArrowRenderer => {
  return (renderingParams: ArrowRenderingParams): string => {
    const p: Point = createRotatedPoint(
      {
        x: renderingParams.arrowLength,
        y: 0,
      },
      {
        x: Math.cos(params.angle),
        y: Math.sin(params.angle),
      },
      {
        x: renderingParams.arrowLength + params.smallRadius,
        y: 0,
      },
    );

    const arrowPoints: Point[] = [zero, { x: p.x, y: -p.y }, p];

    const points: readonly Point[] = arrowPoints
      .map((point) =>
        createRotatedPoint(point, renderingParams.direction, zero),
      )
      .map((point) => ({
        x: point.x + renderingParams.shift.x,
        y: point.y + renderingParams.shift.y,
      }));

    const move = `M ${points[0].x} ${points[0].y}`;
    const line1 = `L ${points[1].x} ${points[1].y}`;
    const arc = `A ${params.smallRadius} ${params.smallRadius} 0 0 1 ${points[2].x} ${points[2].y}`;
    const line2 = `L ${points[0].x} ${points[0].y}`;

    return `${move} ${line1} ${arc} ${line2}`;
  };
};
