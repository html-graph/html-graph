import { Point } from "@/point";
import { PortParams } from "../shared";

export const createHorizontalLinePoints = (
  from: PortParams,
  to: PortParams,
): readonly Point[] => {
  const fromLine = from.linePoint;
  const toLine = to.linePoint;
  const horizontalLineDir = toLine.x - fromLine.x >= 0;
  const fromPortDir = from.dir.x >= 0;
  const toPortDir = to.dir.x >= 0;

  const isSameDirPorts = fromPortDir === toPortDir;

  if (isSameDirPorts) {
    const isSameDirLine = fromPortDir === horizontalLineDir;

    const midpoint: Point = {
      x: (fromLine.x + toLine.x) / 2,
      y: (fromLine.y + toLine.y) / 2,
    };

    if (isSameDirLine) {
      return [
        from.arrowPoint,
        { x: midpoint.x, y: fromLine.y },
        { x: midpoint.x, y: toLine.y },
        to.arrowPoint,
      ];
    }

    return [
      from.arrowPoint,
      fromLine,
      { x: fromLine.x, y: midpoint.y },
      { x: toLine.x, y: midpoint.y },
      toLine,
      to.arrowPoint,
    ];
  }

  const isSameSourceDir = fromPortDir === horizontalLineDir;

  if (isSameSourceDir) {
    const joint: Point = { x: toLine.x, y: fromLine.y };

    return [from.arrowPoint, joint, toLine, to.arrowPoint];
  }

  const joint: Point = { x: fromLine.x, y: toLine.y };

  return [from.arrowPoint, fromLine, joint, to.arrowPoint];
};
