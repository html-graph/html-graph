import { Point } from "@/point";
import { ConnectionCategory } from "../connection-category";

export const adjustTargetVector = (
  sourceVector: Point,
  targetVector: Point,
  category: ConnectionCategory,
): Point => {
  return category === ConnectionCategory.PortCycle
    ? sourceVector
    : { x: -targetVector.x, y: -targetVector.y };
};
