import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { createOrthogonalLine } from "../shared";
import { EdgePort } from "@/edges/shapes/path-edge-shape";

export class OrthogonalEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: EdgePort;
    readonly to: EdgePort;
    readonly arrowLength: number;
    readonly arrowOffset: number;
    readonly roundness: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
  }) {
    const {
      from,
      to,
      arrowLength,
      arrowOffset,
      roundness,
      hasSourceArrow,
      hasTargetArrow,
    } = params;

    const beginArrow: Point = hasSourceArrow
      ? createRotatedPoint(
          { x: from.coords.x + arrowLength, y: from.coords.y },
          from.dir,
          from.coords,
        )
      : from.coords;

    const endArrow: Point = hasTargetArrow
      ? createRotatedPoint(
          { x: to.coords.x - arrowLength, y: to.coords.y },
          to.dir,
          to.coords,
        )
      : to.coords;

    const gap = arrowLength + arrowOffset;

    const beginLine = createRotatedPoint(
      { x: from.coords.x + gap, y: from.coords.y },
      from.dir,
      from.coords,
    );

    const endLine = createRotatedPoint(
      { x: to.coords.x - gap, y: to.coords.y },
      to.dir,
      to.coords,
    );

    const line = createOrthogonalLine(
      { arrowPoint: beginArrow, linePoint: beginLine, dir: from.dir },
      { arrowPoint: endArrow, linePoint: endLine, dir: to.dir },
    );

    this.path = createRoundedPath(line.points, roundness);

    this.midpoint = line.midpoint;
  }
}
