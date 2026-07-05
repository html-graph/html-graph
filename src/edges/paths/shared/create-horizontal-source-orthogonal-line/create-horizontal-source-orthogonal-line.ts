import { Point } from "@/point";
import { Line, PortParams } from "../shared";
import { calculateMidpoint } from "./calculate-midpoint";

export const createHorizontalSourceOrthogonalLine = (
  from: PortParams,
  to: PortParams,
): Line => {
  const fromLine = from.linePoint;
  const fromArrow = from.arrowPoint;
  const toLine = to.linePoint;
  const toArrow = to.arrowPoint;

  const targetPortDir = to.dir.y >= 0;
  const sourcePortDir = from.dir.x >= 0;
  const verticalLineDir = toLine.y - fromLine.y >= 0;
  const horizontalLineDir = toLine.x - fromLine.x >= 0;

  const isSameSourceHorizontal = sourcePortDir === horizontalLineDir;
  const isSameTargetVertical = targetPortDir === verticalLineDir;

  if (isSameSourceHorizontal) {
    if (isSameTargetVertical) {
      const joint: Point = { x: toArrow.x, y: fromArrow.y };

      return {
        points: [fromArrow, joint, toArrow],
        midpoint: calculateMidpoint([fromLine, joint, toLine]),
      };
    }

    const middleX = (fromLine.x + toLine.x) / 2;

    const jointStart: Point = { x: middleX, y: fromLine.y };
    const jointEnd: Point = { x: middleX, y: toLine.y };

    return {
      points: [fromArrow, jointStart, jointEnd, toLine, toArrow],
      midpoint: calculateMidpoint([fromLine, jointStart, jointEnd, toLine]),
    };
  }

  if (isSameTargetVertical) {
    const middleY = (fromLine.y + toLine.y) / 2;

    const jointStart: Point = { x: fromLine.x, y: middleY };
    const jointEnd: Point = { x: toLine.x, y: middleY };

    return {
      points: [fromArrow, fromLine, jointStart, jointEnd, toArrow],
      midpoint: calculateMidpoint([fromLine, jointStart, jointEnd, toLine]),
    };
  }

  const joint: Point = { x: fromLine.x, y: toLine.y };

  return {
    points: [fromArrow, fromLine, joint, toLine, toArrow],
    midpoint: calculateMidpoint([fromLine, joint, toLine]),
  };
};
