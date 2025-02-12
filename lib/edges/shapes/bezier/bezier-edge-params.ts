export interface BezierEdgeParams {
  readonly color: string;
  readonly width: number;
  readonly arrowLength: number;
  readonly arrowWidth: number;
  readonly curvature: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly cycleRadius: number;
  readonly smallCycleRadius: number;
  readonly detourDistance: number;
  readonly detourDirection: number;
}
