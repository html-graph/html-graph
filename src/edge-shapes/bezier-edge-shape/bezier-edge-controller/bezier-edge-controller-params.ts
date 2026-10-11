import { ArrowRenderer } from "../../shared";

export interface BezierEdgeControllerParams {
  readonly color: string;
  readonly width: number;
  readonly arrowLength: number;
  readonly arrowRenderer: ArrowRenderer;
  readonly curvature: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly portCycleRadius: number;
  readonly portCycleSmallRadius: number;
  readonly detourDistance: number;
  readonly detourDirection: number;
}
