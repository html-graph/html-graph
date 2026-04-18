import { Point } from "@/point";
import { Line } from "./line";
import { PortParams } from "./port-params";

export const createLine = (from: PortParams, to: PortParams): Line => {
  const fromLine = from.linePoint;
  const toLine = to.linePoint;
  const verticalLineDir = toLine.y - fromLine.y >= 0;
  const fromPortDir = from.dirY >= 0;
  const toPortDir = to.dirY >= 0;

  const isSameDirPorts = fromPortDir === toPortDir;

  if (isSameDirPorts) {
    const isSameDirLine = fromPortDir === verticalLineDir;
    const centerX = (fromLine.x + toLine.x) / 2;
    const centerY = (fromLine.y + toLine.y) / 2;
    const midpoint: Point = { x: centerX, y: centerY };

    if (isSameDirLine) {
      return {
        points: [
          from.arrowPoint,
          { x: fromLine.x, y: midpoint.y },
          { x: toLine.x, y: midpoint.y },
          to.arrowPoint,
        ],
        midpoint,
      };
    }

    return {
      points: [
        from.arrowPoint,
        fromLine,
        { x: midpoint.x, y: fromLine.y },
        { x: midpoint.x, y: toLine.y },
        toLine,
        to.arrowPoint,
      ],
      midpoint,
    };
  }

  const isSameSourceDir = fromPortDir === verticalLineDir;
  const centerX = (fromLine.x + toLine.x) / 2;

  if (isSameSourceDir) {
    const joint: Point = { x: fromLine.x, y: toLine.y };

    return {
      points: [from.arrowPoint, joint, toLine, to.arrowPoint],
      midpoint: { x: centerX, y: joint.y },
    };
  }

  const joint: Point = { x: toLine.x, y: fromLine.y };

  return {
    points: [from.arrowPoint, fromLine, joint, to.arrowPoint],
    midpoint: { x: centerX, y: joint.y },
  };
};
