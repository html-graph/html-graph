import { Point } from "@/point";

export const calculateContainingRectangle = (
  contains: readonly Point[],
): { readonly from: Point; readonly to: Point } => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  contains.forEach((point) => {
    if (point.x < minX) {
      minX = point.x;
    }

    if (point.x > maxX) {
      maxX = point.x;
    }

    if (point.y < minY) {
      minY = point.y;
    }

    if (point.y > maxY) {
      maxY = point.y;
    }
  });

  return { from: { x: minX, y: minY }, to: { x: maxX, y: maxY } };
};
