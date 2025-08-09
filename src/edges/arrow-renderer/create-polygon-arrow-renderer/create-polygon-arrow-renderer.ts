import { createRotatedPoint } from "../../shared";
import { Point, zero } from "@/point";
import { ArrowRenderer } from "../arrow-renderer";

export const createPolygonArrowRenderer = (params: {
  readonly width: number;
  readonly length: number;
}): ArrowRenderer => {
  return (direction: Point, shift: Point): string => {
    const arrowPoints: Point[] = [
      zero,
      { x: params.length, y: params.width },
      { x: params.length, y: -params.width },
    ];

    const points: readonly Point[] = arrowPoints
      .map((point) => createRotatedPoint(point, direction, zero))
      .map((point) => ({ x: point.x + shift.x, y: point.y + shift.y }));

    const move = `M ${points[0].x} ${points[0].y}`;
    const line1 = `L ${points[1].x} ${points[1].y}`;
    const line2 = `L ${points[2].x} ${points[2].y}`;

    return `${move} ${line1} ${line2} Z`;
  };
};
