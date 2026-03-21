import { Point } from "@/point";
import { Line } from "./line";
import { PortParams } from "./port-params";

export const createLine = (from: PortParams, to: PortParams): Line => {
  const verticalLineDir = to.y - from.y >= 0;
  const fromPortDir = from.dirY >= 0;
  const toPortDir = to.dirY >= 0;

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

  if (isSameSourceDir) {
    const midpoint: Point = { x: from.x, y: to.y };

    return {
      points: [{ x: from.x, y: from.y }, midpoint, { x: to.x, y: to.y }],
      midpoint,
    };
  }

  const midpoint: Point = { x: to.x, y: from.y };

  return {
    points: [{ x: from.x, y: from.y }, midpoint, { x: to.x, y: to.y }],
    midpoint,
  };
};
