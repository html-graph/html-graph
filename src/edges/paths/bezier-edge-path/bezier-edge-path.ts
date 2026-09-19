import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { PathPort } from "../../path-port";

const halfCube = 0.5 * 0.5 * 0.5;
const halfCube3 = 3 * halfCube;

export class BezierEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: PathPort;
    readonly to: PathPort;
    readonly arrowLength: number;
    readonly curvature: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
  }) {
    const { from, to, arrowLength, curvature, hasSourceArrow, hasTargetArrow } =
      params;

    const begin = createRotatedPoint(
      { x: from.coords.x + arrowLength, y: from.coords.y },
      from.dir,
      from.coords,
    );

    const end = createRotatedPoint(
      { x: to.coords.x - arrowLength, y: to.coords.y },
      to.dir,
      to.coords,
    );

    const bezierBegin: Point = {
      x: begin.x + from.dir.x * curvature,
      y: begin.y + from.dir.y * curvature,
    };

    const bezierEnd: Point = {
      x: end.x - to.dir.x * curvature,
      y: end.y - to.dir.y * curvature,
    };

    const centerX =
      halfCube * begin.x +
      halfCube3 * bezierBegin.x +
      halfCube3 * bezierEnd.x +
      halfCube * end.x;

    const centerY =
      halfCube * begin.y +
      halfCube3 * bezierBegin.y +
      halfCube3 * bezierEnd.y +
      halfCube * end.y;

    this.midpoint = { x: centerX, y: centerY };

    const curve = `M ${begin.x} ${begin.y} C ${bezierBegin.x} ${bezierBegin.y}, ${bezierEnd.x} ${bezierEnd.y}, ${end.x} ${end.y}`;

    const preLine = hasSourceArrow
      ? ""
      : `M ${from.coords.x} ${from.coords.y} L ${begin.x} ${begin.y} `;

    const postLine = hasTargetArrow
      ? ""
      : ` M ${end.x} ${end.y} L ${to.coords.x} ${to.coords.y}`;

    this.path = `${preLine}${curve}${postLine}`;
  }
}
