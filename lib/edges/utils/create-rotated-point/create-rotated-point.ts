import { Point } from "../../point";

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

  return [
    vector[0] * point[0] -
      vector[1] * point[1] +
      ((1 - vector[0]) * center[0] + vector[1] * center[1]),
    vector[1] * point[0] +
      vector[0] * point[1] +
      ((1 - vector[0]) * center[1] - vector[1] * center[0]),
  ];
};