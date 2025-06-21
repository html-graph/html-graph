import { Point } from "@/point";

export interface GenericEdgeParams {
  readonly width: number;
  readonly color: string;
  readonly arrowLength: number;
  readonly arrowWidth: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly createCyclePath: (direction: Point) => string;
  readonly createDetourPath: (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
  ) => string;
  readonly createLinePath: (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
  ) => string;
}
