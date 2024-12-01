export interface StraightConnectionOptions {
  readonly type: "straight";
  readonly color?: string;
  readonly width?: number;
  readonly arrowLength?: number;
  readonly arrowWidth?: number;
  readonly minPortOffset?: number;
  readonly hasSourceArrow?: boolean;
  readonly hasTargetArrow?: boolean;
}
