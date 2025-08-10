import { ArrowRendererConfig } from "../../arrow-renderer";

export interface BezierEdgeParams {
  readonly color?: string | undefined;
  readonly width?: number | undefined;
  readonly arrowLength?: number | undefined;
  readonly arrowRenderer?: ArrowRendererConfig | undefined;
  readonly curvature?: number | undefined;
  readonly hasSourceArrow?: boolean | undefined;
  readonly hasTargetArrow?: boolean | undefined;
  readonly cycleRadius?: number | undefined;
  readonly smallCycleRadius?: number | undefined;
  readonly detourDistance?: number | undefined;
  readonly detourDirection?: number | undefined;
}
