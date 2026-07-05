import { Line, PortParams } from "../shared";

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
      return {
        points: [fromArrow, { x: toArrow.x, y: fromArrow.y }, toArrow],
        midpoint: { x: 0, y: 0 },
      };
    }

    const middleX = (fromLine.x + toLine.x) / 2;

    return {
      points: [
        fromArrow,
        { x: middleX, y: fromLine.y },
        { x: middleX, y: toLine.y },
        toLine,
        toArrow,
      ],
      midpoint: { x: 0, y: 0 },
    };
  }

  if (isSameTargetVertical) {
    const middleY = (fromLine.y + toLine.y) / 2;

    return {
      points: [
        fromArrow,
        fromLine,
        { x: fromLine.x, y: middleY },
        { x: toLine.x, y: middleY },
        toArrow,
      ],
      midpoint: { x: 0, y: 0 },
    };
  }

  return {
    points: [
      fromArrow,
      fromLine,
      { x: fromLine.x, y: toLine.y },
      toLine,
      toArrow,
    ],
    midpoint: { x: 0, y: 0 },
  };
};
