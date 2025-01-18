import { Point } from "@html-graph/html-graph";

export const createRotatedPoint: (
  point: Point,
  vector: Point,
  center: Point,
) => Point = (point: Point, vector: Point, center: Point) => {
  /**
   * translate to center
   *  1  0  c1
   *  0  1  c2
   *  0  0  1
   *
   * rotate
   *  v0 -v1  0
   *  v1  v0  0
   *  0   0   1
   *
   * translate back
   *  1  0  -c1
   *  0  1  -c2
   *  0  0  1
   *
   *  v0 -v1 (1 - v0) * c1 + v1 * c2
   *  v1  v0 (1 - v0) * c2 -v1 * c1
   *  0   0  1
   */

  return {
    x:
      vector.x * point.x -
      vector.y * point.y +
      ((1 - vector.x) * center.x + vector.y * center.y),
    y:
      vector.y * point.x +
      vector.x * point.y +
      ((1 - vector.x) * center.y - vector.y * center.x),
  };
};
