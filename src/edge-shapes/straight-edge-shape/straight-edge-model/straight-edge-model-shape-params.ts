import { ArrowRenderer } from "../../shared";

export interface StraightEdgeModelShapeParams {
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowLength: number;
  readonly arrowOffset: number;
  readonly roundness: number;
  readonly cycleSquareSide: number;
  readonly detourDirection: number;
  readonly detourDistance: number;
}
