import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { PathPort } from "../../path-port";

const halfCube = 0.5 * 0.5 * 0.5;
const halfCube3 = 3 * halfCube;

export class BezierEdgePath implements EdgePath {
  public readonly path: string;

  private readonly begin: Point;

  private readonly end: Point;

  private readonly bezierBegin: Point;

  private readonly bezierEnd: Point;

  public constructor(params: {
    readonly from: PathPort;
    readonly to: PathPort;
    readonly arrowLength: number;
    readonly curvature: number;
  }) {
    const { from, to, arrowLength, curvature } = params;

    this.begin = createRotatedPoint(
      { x: from.coords.x + arrowLength, y: from.coords.y },
      from.dir,
      from.coords,
    );

    this.end = createRotatedPoint(
      { x: to.coords.x - arrowLength, y: to.coords.y },
      to.dir,
      to.coords,
    );

    this.bezierBegin = {
      x: this.begin.x + from.dir.x * curvature,
      y: this.begin.y + from.dir.y * curvature,
    };

    this.bezierEnd = {
      x: this.end.x - to.dir.x * curvature,
      y: this.end.y - to.dir.y * curvature,
    };

    const curve = `M ${this.begin.x} ${this.begin.y} C ${this.bezierBegin.x} ${this.bezierBegin.y}, ${this.bezierEnd.x} ${this.bezierEnd.y}, ${this.end.x} ${this.end.y}`;

    const preLine = from.hasArrow
      ? ""
      : `M ${from.coords.x} ${from.coords.y} L ${this.begin.x} ${this.begin.y} `;

    const postLine = to.hasArrow
      ? ""
      : ` M ${this.end.x} ${this.end.y} L ${to.coords.x} ${to.coords.y}`;

    this.path = `${preLine}${curve}${postLine}`;
  }

  public calculateMidpoint(): Point {
    const centerX =
      halfCube * this.begin.x +
      halfCube3 * this.bezierBegin.x +
      halfCube3 * this.bezierEnd.x +
      halfCube * this.end.x;

    const centerY =
      halfCube * this.begin.y +
      halfCube3 * this.bezierBegin.y +
      halfCube3 * this.bezierEnd.y +
      halfCube * this.end.y;

    return { x: centerX, y: centerY };
  }
}
