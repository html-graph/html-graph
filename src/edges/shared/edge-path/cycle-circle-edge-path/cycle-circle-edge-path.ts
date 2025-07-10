import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../create-rotated-point";
import { EdgePath } from "../edge-path";

export class CycleCircleEdgePath implements EdgePath {
  public readonly path: string;

  public readonly median: Point = { x: 0, y: 0 };

  public constructor(
    private readonly params: {
      readonly sourceDirection: Point;
      readonly radius: number;
      readonly smallRadius: number;
      readonly arrowLength: number;
      readonly hasSourceArrow: boolean;
      readonly hasTargetArrow: boolean;
    },
  ) {
    const smallRadius = this.params.smallRadius;
    const radius = this.params.radius;
    const distance = Math.sqrt(smallRadius * smallRadius + radius * radius);
    const g = smallRadius + radius;
    const jointX = this.params.arrowLength + distance * (1 - radius / g);
    const jointY = (smallRadius * radius) / g;
    const farPoint =
      Math.sqrt(g * g - smallRadius * smallRadius) +
      radius +
      this.params.arrowLength;

    const points: Point[] = [
      { x: this.params.arrowLength, y: zero.y },
      { x: jointX, y: jointY },
      { x: jointX, y: -jointY },
      { x: farPoint, y: 0 },
    ];

    const rotatedPoints = points.map((p) =>
      createRotatedPoint(p, this.params.sourceDirection, zero),
    );

    const c = [
      `M ${rotatedPoints[0].x} ${rotatedPoints[0].y}`,
      `A ${smallRadius} ${smallRadius} 0 0 1 ${rotatedPoints[1].x} ${rotatedPoints[1].y}`,
      `A ${radius} ${radius} 0 1 0 ${rotatedPoints[2].x} ${rotatedPoints[2].y}`,
      `A ${smallRadius} ${smallRadius} 0 0 1 ${rotatedPoints[0].x} ${rotatedPoints[0].y}`,
    ].join(" ");

    const preLine = `M ${0} ${0} L ${rotatedPoints[0].x} ${rotatedPoints[0].y} `;

    this.path = `${this.params.hasSourceArrow || this.params.hasTargetArrow ? "" : preLine}${c}`;

    this.median = rotatedPoints[3];
  }
}
