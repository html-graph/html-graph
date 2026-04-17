import { Point } from "@/point";
import { Line } from "./line";
import { PortParams } from "./port-params";

export const createLine = (
  fromParams: PortParams,
  toParams: PortParams,
): Line => {
  const from = fromParams.linePoint;
  const to = toParams.linePoint;
  const horizontalLineDir = to.x - from.x >= 0;
  const fromPortDir = fromParams.dirX >= 0;
  const toPortDir = toParams.dirX >= 0;

  const isSameDirPorts = fromPortDir === toPortDir;

  if (isSameDirPorts) {
    const isSameDirLine = fromPortDir === horizontalLineDir;
    const centerX = (from.x + to.x) / 2;
    const centerY = (from.y + to.y) / 2;
    const midpoint: Point = { x: centerX, y: centerY };

    if (isSameDirLine) {
      return {
        points: [
          fromParams.arrowPoint,
          { x: midpoint.x, y: from.y },
          { x: midpoint.x, y: to.y },
          toParams.arrowPoint,
        ],
        midpoint,
      };
    }

    return {
      points: [
        fromParams.arrowPoint,
        { x: from.x, y: from.y },
        { x: from.x, y: midpoint.y },
        { x: to.x, y: midpoint.y },
        { x: to.x, y: to.y },
        toParams.arrowPoint,
      ],
      midpoint,
    };
  }

  const isSameSourceDir = fromPortDir === horizontalLineDir;
  const centerY = (from.y + to.y) / 2;

  if (isSameSourceDir) {
    const joint: Point = { x: to.x, y: from.y };

    return {
      points: [
        fromParams.arrowPoint,
        joint,
        { x: to.x, y: to.y },
        toParams.arrowPoint,
      ],
      midpoint: { x: joint.x, y: centerY },
    };
  }

  const joint: Point = { x: from.x, y: to.y };

  return {
    points: [
      fromParams.arrowPoint,
      { x: from.x, y: from.y },
      joint,
      toParams.arrowPoint,
    ],
    midpoint: { x: joint.x, y: centerY },
  };
};
