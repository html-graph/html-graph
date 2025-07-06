import { createRotatedPoint } from "../../shared/create-rotated-point";
import { Point, zero } from "@/point";

export const createArrowPath = (
  directionVector: Point,
  shift: Point,
  arrowLength: number,
  arrowWidth: number,
): string => {
  const arrowPoints: Point[] = [
    zero,
    { x: arrowLength, y: arrowWidth },
    { x: arrowLength, y: -arrowWidth },
  ];

  const points: readonly Point[] = arrowPoints
    .map((point) => createRotatedPoint(point, directionVector, zero))
    .map((point) => ({ x: point.x + shift.x, y: point.y + shift.y }));

  const move = `M ${points[0].x} ${points[0].y}`;
  const line1 = `L ${points[1].x} ${points[1].y}`;
  const line2 = `L ${points[2].x} ${points[2].y}`;

  return `${move} ${line1} ${line2} Z`;
};
