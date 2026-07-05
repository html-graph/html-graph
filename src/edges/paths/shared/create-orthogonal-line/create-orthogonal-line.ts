import { Line, PortParams } from "../shared";

export const createOrthogonalLine = (
  from: PortParams,
  to: PortParams,
): Line => {
  const fromLine = from.linePoint;
  const toLine = to.linePoint;
  const targetPortDir = to.dir.y >= 0;
  const sourcePortDir = from.dir.x >= 0;
  const verticalLineDir = toLine.y - fromLine.y >= 0;
  const horizontalLineDir = toLine.x - fromLine.x >= 0;

  if (sourcePortDir === horizontalLineDir) {
    if (targetPortDir === verticalLineDir) {
      return {
        points: [
          from.arrowPoint,
          { x: to.arrowPoint.x, y: from.arrowPoint.y },
          to.arrowPoint,
        ],
        midpoint: { x: 0, y: 0 },
      };
    }

    const middleX = (fromLine.x + toLine.x) / 2;

    return {
      points: [
        from.arrowPoint,
        { x: middleX, y: from.linePoint.y },
        { x: middleX, y: to.linePoint.y },
        to.linePoint,
        to.arrowPoint,
      ],
      midpoint: { x: 0, y: 0 },
    };
  }

  if (targetPortDir === verticalLineDir) {
    const middleY = (fromLine.y + toLine.y) / 2;

    return {
      points: [
        from.arrowPoint,
        from.linePoint,
        { x: from.linePoint.x, y: middleY },
        { x: to.linePoint.x, y: middleY },
        to.arrowPoint,
      ],
      midpoint: { x: 0, y: 0 },
    };
  }

  return {
    points: [
      from.arrowPoint,
      from.linePoint,
      { x: from.linePoint.x, y: to.linePoint.y },
      to.linePoint,
      to.arrowPoint,
    ],
    midpoint: { x: 0, y: 0 },
  };
};
