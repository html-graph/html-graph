import { ArrowRenderer } from "../../shared";

export interface OrthogonalEdgeModelShapeParams {
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowLength: number;
  readonly arrowOffset: number;
  readonly roundness: number;
  readonly cycleSquareSide: number;
  readonly detourDistance: number;
}
