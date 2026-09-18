import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { EdgePort } from "@/edges/shapes/path-edge-shape";

export class CycleSquareEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: EdgePort;
    readonly arrowLength: number;
    readonly side: number;
    readonly arrowOffset: number;
    readonly roundness: number;
    readonly hasArrow: boolean;
  }) {
    const { side, arrowLength, arrowOffset, from, hasArrow } = params;
    const x1 = arrowLength + arrowOffset;
    const x2 = x1 + 2 * side;

    const linePoints = [
      { x: arrowLength, y: 0 },
      { x: x1, y: 0 },
      { x: x1, y: side },
      { x: x2, y: side },
      { x: x2, y: -side },
      { x: x1, y: -side },
      { x: x1, y: 0 },
      { x: arrowLength, y: 0 },
    ];

    const rp = linePoints
      .map((p) => createRotatedPoint(p, from.dir, { x: 0, y: 0 }))
      .map((p) => ({ x: p.x + from.coords.x, y: p.y + from.coords.y }));

    const preLine = `M ${from.coords.x} ${from.coords.y} L ${rp[0].x} ${rp[0].y} `;

    this.path = `${hasArrow ? "" : preLine}${createRoundedPath(rp, params.roundness)}`;

    this.midpoint = { x: (rp[3].x + rp[4].x) / 2, y: (rp[3].y + rp[4].y) / 2 };
  }
}
