import { ArrowRendererConfig } from "../../arrow-renderer";

export interface DirectEdgeParams {
  readonly color?: string | undefined;
  readonly width?: number | undefined;
  readonly arrowLength?: number | undefined;
  readonly arrowRenderer?: ArrowRendererConfig | undefined;
  readonly hasSourceArrow?: boolean | undefined;
  readonly hasTargetArrow?: boolean | undefined;
  readonly sourceOffset?: number | undefined;
  readonly targetOffset?: number | undefined;
}
