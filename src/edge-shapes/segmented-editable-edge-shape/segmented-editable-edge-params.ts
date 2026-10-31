import { ArrowRendererConfig } from "../shared";

export interface SegmentedEditableEdgeParams {
  readonly color?: string | undefined;
  readonly width?: number | undefined;
  readonly arrowLength?: number | undefined;
  readonly arrowRenderer?: ArrowRendererConfig | undefined;
  readonly arrowOffset?: number | undefined;
  readonly hasSourceArrow?: boolean | undefined;
  readonly hasTargetArrow?: boolean | undefined;
  readonly roundness?: number | undefined;
  readonly midpointElement?: HTMLElement | SVGElement | undefined;
  readonly interactiveDistance?: number | undefined;
}
