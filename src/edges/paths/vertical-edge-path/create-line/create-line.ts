import { Point } from "@/point";
import { Line } from "./line";
import { PortParams } from "./port-params";

export const createLine = (
  fromParams: PortParams,
  toParams: PortParams,
): Line => {
  const from = fromParams.linePoint;
  const to = toParams.linePoint;
  const verticalLineDir = to.y - from.y >= 0;
  const fromPortDir = fromParams.dirY >= 0;
  const toPortDir = toParams.dirY >= 0;

  const isSameDirPorts = fromPortDir === toPortDir;

  if (isSameDirPorts) {
    const isSameDirLine = fromPortDir === verticalLineDir;
    const centerX = (from.x + to.x) / 2;
    const centerY = (from.y + to.y) / 2;
    const midpoint: Point = { x: centerX, y: centerY };

    if (isSameDirLine) {
      return {
        points: [
          { x: from.x, y: from.y },
          { x: from.x, y: midpoint.y },
          { x: to.x, y: midpoint.y },
          { x: to.x, y: to.y },
        ],
        midpoint,
      };
    }

    return {
      points: [
        { x: from.x, y: from.y },
        { x: midpoint.x, y: from.y },
        { x: midpoint.x, y: to.y },
        { x: to.x, y: to.y },
      ],
      midpoint,
    };
  }

  const isSameSourceDir = fromPortDir === verticalLineDir;
  const centerX = (from.x + to.x) / 2;

  if (isSameSourceDir) {
    const joint: Point = { x: from.x, y: to.y };

    return {
      points: [{ x: from.x, y: from.y }, joint, { x: to.x, y: to.y }],
      midpoint: { x: centerX, y: joint.y },
    };
  }

  const joint: Point = { x: to.x, y: from.y };

  return {
    points: [{ x: from.x, y: from.y }, joint, { x: to.x, y: to.y }],
    midpoint: { x: centerX, y: joint.y },
  };
};
