import { Point } from "../../models/point/point";
import { PortPayload } from "../../models/store/port-payload";

export class ConnectionUtils {
  static getPortCenter(port: PortPayload): Point {
    const { top, left, width, height } = port.element.getBoundingClientRect();

    const center = port.centerFn(width, height);

    return [left + center[0], top + center[1]];
  }

  static rotate(point: Point, vector: Point, center: Point): Point {
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
  }

  static getDirectionVector(
    direction: number | null,
    flipX: number,
    flipY: number,
  ): Point {
    return [flipX * Math.cos(direction ?? 0), flipY * Math.sin(direction ?? 0)];
  }

  static getArrowPath(
    vect: Point,
    shiftX: number,
    shiftY: number,
    arrowLength: number,
    arrowWidth: number,
  ): string {
    const arrowPoints: [number, number][] = [
      [0, 0],
      [arrowLength, arrowWidth],
      [arrowLength, -arrowWidth],
    ];

    const transformedPoints = arrowPoints
      .map((p) => this.rotate(p, vect, [0, 0]))
      .map((p) => [p[0] + shiftX, p[1] + shiftY]);

    const amove = `M ${transformedPoints[0][0]} ${transformedPoints[0][1]}`;
    const aline1 = `L ${transformedPoints[1][0]} ${transformedPoints[1][1]}`;
    const aline2 = `L ${transformedPoints[2][0]} ${transformedPoints[2][1]}`;

    return `${amove} ${aline1} ${aline2}`;
  }
}
