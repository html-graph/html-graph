export interface BezierEdgeShape {
  readonly type?: "bezier";
  readonly color?: string;
  readonly width?: number;
  readonly curvature?: number;
  readonly arrowLength?: number;
  readonly arrowWidth?: number;
  readonly hasSourceArrow?: boolean;
  readonly hasTargetArrow?: boolean;
  readonly cycleRadius?: number;
  readonly smallCycleRadius?: number;
  readonly detourDistance?: number;
  readonly detourDirection?: number;
}
