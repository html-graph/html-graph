import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";

export class BezierEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: Point;
    readonly to: Point;
    readonly fromDir: Point;
    readonly toDir: Point;
    readonly arrowLength: number;
    readonly curvature: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
  }) {
    const {
      from,
      to,
      arrowLength,
      fromDir,
      toDir,
      curvature,
      hasSourceArrow,
      hasTargetArrow,
    } = params;

    const centerX = (from.x + to.x) / 2;
    const centerY = (from.y + to.y) / 2;

    this.midpoint = { x: centerX, y: centerY };

    const begin = createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from,
    );

    const end = createRotatedPoint(
      { x: to.x - arrowLength, y: to.y },
      toDir,
      to,
    );

    const bezierBegin: Point = {
      x: begin.x + fromDir.x * curvature,
      y: begin.y + fromDir.y * curvature,
    };

    const bezierEnd: Point = {
      x: end.x - toDir.x * curvature,
      y: end.y - toDir.y * curvature,
    };

    const curve = `M ${begin.x} ${begin.y} C ${bezierBegin.x} ${bezierBegin.y}, ${bezierEnd.x} ${bezierEnd.y}, ${end.x} ${end.y}`;

    const preLine = hasSourceArrow
      ? ""
      : `M ${from.x} ${from.y} L ${begin.x} ${begin.y} `;

    const postLine = hasTargetArrow
      ? ""
      : ` M ${end.x} ${end.y} L ${to.x} ${to.y}`;

    this.path = `${preLine}${curve}${postLine}`;
  }
}
