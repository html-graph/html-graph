export interface StraightEdgeOptions {
  readonly type: "straight";
  readonly color?: string;
  readonly width?: number;
  readonly arrowLength?: number;
  readonly arrowWidth?: number;
  readonly arrowOffset?: number;
  readonly hasSourceArrow?: boolean;
  readonly hasTargetArrow?: boolean;
  readonly cycleSquareSide?: number;
  readonly roundness?: number;
  readonly detourDistance?: number;
  readonly detourDirection?: number;
}
