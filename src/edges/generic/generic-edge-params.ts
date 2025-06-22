import { Point } from "@/point";

export interface GenericEdgeParams {
  readonly width: number;
  readonly color: string;
  readonly arrowLength: number;
  readonly arrowWidth: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly createCyclePath: (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
    flipX: number,
    flipY: number,
  ) => string;
  readonly createDetourPath: (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
    flipX: number,
    flipY: number,
  ) => string;
  readonly createLinePath: (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
    flipX: number,
    flipY: number,
  ) => string;
}
