import { createRotatedPoint } from "../../geometry";
import { Point, zero } from "@/point";
import { ArrowRenderer } from "../arrow-renderer";
import { ArrowRenderingParams } from "../arrow-rendering-params";

export const createPolygonArrowRenderer = (params: {
  readonly radius: number;
}): ArrowRenderer => {
  return (renderingParams: ArrowRenderingParams): string => {
    const arrowPoints: Point[] = [
      zero,
      { x: renderingParams.arrowLength, y: params.radius },
      { x: renderingParams.arrowLength, y: -params.radius },
    ];

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
    const line2 = `L ${points[2].x} ${points[2].y}`;

    return `${move} ${line1} ${line2} Z`;
  };
};
