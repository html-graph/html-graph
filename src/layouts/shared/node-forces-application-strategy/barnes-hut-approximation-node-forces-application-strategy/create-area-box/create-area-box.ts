import { Identifier } from "@/identifier";
import { AreaBox } from "../quad-tree";
import { Point } from "@/point";

export const createAreaBox = (
  nodeCoords: ReadonlyMap<Identifier, Point>,
): AreaBox => {
  if (nodeCoords.size === 0) {
    return {
      centerX: 0,
      centerY: 0,
      radius: 0,
    };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodeCoords.forEach((point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });

  const width = maxX - minX;
  const height = maxY - minY;
  const side = Math.max(width, height);

  return {
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
    radius: side / 2,
  };
};
