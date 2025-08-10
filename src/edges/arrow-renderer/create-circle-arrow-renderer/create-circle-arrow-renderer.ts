import { createRotatedPoint } from "../../geometry";
import { Point, zero } from "@/point";
import { ArrowRenderer } from "../arrow-renderer";
import { ArrowRenderingParams } from "../arrow-rendering-params";

export const createCircleArrowRenderer = (params: {
  readonly radius: number;
}): ArrowRenderer => {
  return (renderingParams: ArrowRenderingParams): string => {
    const r = params.radius;
    const l = renderingParams.arrowLength;
    const R = (l * l + 2 * l * r) / (2 * r);
    const D = R + r;
    const x = l + r - (r * (l + r)) / D;
    const y = (r * R) / D;

    const arrowPoints: Point[] = [zero, { x, y: -y }, { x, y }];

    const points: readonly Point[] = arrowPoints
      .map((point) =>
        createRotatedPoint(point, renderingParams.direction, zero),
      )
      .map((point) => ({
        x: point.x + renderingParams.shift.x,
        y: point.y + renderingParams.shift.y,
      }));

    const move = `M ${points[0].x} ${points[0].y}`;
    const arc1 = `A ${R} ${R} 0 0 0 ${points[1].x} ${points[1].y}`;
    const arc2 = `A ${r} ${r} 0 0 0 ${points[2].x} ${points[2].y}`;
    const arc3 = `A ${R} ${R} 0 0 0 ${points[0].x} ${points[0].y}`;

    return `${move} ${arc1} ${arc2} ${arc3}`;
  };
};
