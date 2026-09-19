import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { PathPort } from "../../path-port";

export class CycleCircleEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: PathPort;
    readonly radius: number;
    readonly smallRadius: number;
    readonly arrowLength: number;
    readonly hasArrow: boolean;
  }) {
    const { arrowLength, radius, smallRadius, from, hasArrow } = params;

    const diagonal = smallRadius + radius;
    const jointY = (smallRadius * radius) / diagonal;
    const distance = Math.sqrt(diagonal * diagonal - smallRadius * smallRadius);
    const jointX = (distance * smallRadius) / diagonal;
    const farPoint = distance + radius + arrowLength;
    const totalX = arrowLength + jointX;

    const points: Point[] = [
      { x: arrowLength, y: 0 },
      { x: totalX, y: jointY },
      { x: totalX, y: -jointY },
      { x: farPoint, y: 0 },
    ];

    const absPoints = points
      .map((p) => createRotatedPoint(p, from.dir, { x: 0, y: 0 }))
      .map((p) => ({ x: p.x + from.coords.x, y: p.y + from.coords.y }));

    const c = [
      `M ${absPoints[0].x} ${absPoints[0].y}`,
      `A ${smallRadius} ${smallRadius} 0 0 1 ${absPoints[1].x} ${absPoints[1].y}`,
      `A ${radius} ${radius} 0 1 0 ${absPoints[2].x} ${absPoints[2].y}`,
      `A ${smallRadius} ${smallRadius} 0 0 1 ${absPoints[0].x} ${absPoints[0].y}`,
    ].join(" ");

    const preLine = `M ${from.coords.x} ${from.coords.y} L ${absPoints[0].x} ${absPoints[0].y} `;

    this.path = `${hasArrow ? "" : preLine}${c}`;

    this.midpoint = absPoints[3];
  }
}
