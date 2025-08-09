import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";

export class CycleCircleEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

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
    const diagonal = smallRadius + radius;
    const jointY = (smallRadius * radius) / diagonal;
    const distance = Math.sqrt(diagonal * diagonal - smallRadius * smallRadius);
    const jointX = (distance * smallRadius) / diagonal;
    const farPoint = distance + radius + this.params.arrowLength;
    const totalX = this.params.arrowLength + jointX;

    const points: Point[] = [
      { x: this.params.arrowLength, y: zero.y },
      { x: totalX, y: jointY },
      { x: totalX, y: -jointY },
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

    this.midpoint = rotatedPoints[3];
  }
}
