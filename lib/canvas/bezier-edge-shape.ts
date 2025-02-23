export interface BezierEdgeShape {
  readonly type?: "bezier" | undefined;
  readonly color?: string | undefined;
  readonly width?: number | undefined;
  readonly curvature?: number | undefined;
  readonly arrowLength?: number | undefined;
  readonly arrowWidth?: number | undefined;
  readonly hasSourceArrow?: boolean | undefined;
  readonly hasTargetArrow?: boolean | undefined;
  readonly cycleRadius?: number | undefined;
  readonly smallCycleRadius?: number | undefined;
  readonly detourDistance?: number | undefined;
  readonly detourDirection?: number | undefined;
}
