import { ArrowRenderer } from "../../shared";

export interface StraightEdgeControllerParams {
  readonly color: string;
  readonly width: number;
  readonly arrowLength: number;
  readonly arrowOffset: number;
  readonly arrowRenderer: ArrowRenderer;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly cycleSquareSide: number;
  readonly roundness: number;
  readonly detourDistance: number;
  readonly detourDirection: number;
}
