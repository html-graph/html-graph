import { ArrowRenderer } from "../../shared";

export interface BezierEdgeModelShapeParams {
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowLength: number;
  readonly portCycleRadius: number;
  readonly portCycleSmallRadius: number;
  readonly curvature: number;
  readonly detourDirection: number;
  readonly detourDistance: number;
}
