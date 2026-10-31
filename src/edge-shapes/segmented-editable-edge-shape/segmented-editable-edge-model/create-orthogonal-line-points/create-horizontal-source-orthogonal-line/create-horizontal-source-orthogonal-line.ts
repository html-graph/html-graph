import { Point } from "@/point";
import { PortParams } from "../shared";

export const createHorizontalSourceOrthogonalLinePoints = (
  from: PortParams,
  to: PortParams,
): readonly Point[] => {
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

      return [fromArrow, joint, toArrow];
    }

    const middleX = (fromLine.x + toLine.x) / 2;

    const jointStart: Point = { x: middleX, y: fromLine.y };
    const jointEnd: Point = { x: middleX, y: toLine.y };

    return [fromArrow, jointStart, jointEnd, toLine, toArrow];
  }

  if (isSameTargetVertical) {
    const middleY = (fromLine.y + toLine.y) / 2;

    const jointStart: Point = { x: fromLine.x, y: middleY };
    const jointEnd: Point = { x: toLine.x, y: middleY };

    return [fromArrow, fromLine, jointStart, jointEnd, toArrow];
  }

  const joint: Point = { x: fromLine.x, y: toLine.y };

  return [fromArrow, fromLine, joint, toLine, toArrow];
};
