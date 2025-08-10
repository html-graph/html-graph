import { ArrowRendererConfig } from "../../arrow-renderer";

export interface VerticalEdgeParams {
  readonly color?: string | undefined;
  readonly width?: number | undefined;
  readonly arrowLength?: number | undefined;
  /**
   * @deprecated
   * use arrowRenderer: { type: "polygon", radius: arrowWidth } instead
   */
  readonly arrowWidth?: number | undefined;
  readonly arrowOffset?: number | undefined;
  readonly arrowRenderer?: ArrowRendererConfig | undefined;
  readonly hasSourceArrow?: boolean | undefined;
  readonly hasTargetArrow?: boolean | undefined;
  readonly cycleSquareSide?: number | undefined;
  readonly roundness?: number | undefined;
  readonly detourDistance?: number | undefined;
}
