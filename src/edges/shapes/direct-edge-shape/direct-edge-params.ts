import { ArrowRendererConfig } from "../../arrow-renderer";
import { PortOffset } from "./resolve-port-offset-fn";

export interface DirectEdgeParams {
  readonly color?: string | undefined;
  readonly width?: number | undefined;
  readonly arrowLength?: number | undefined;
  readonly arrowRenderer?: ArrowRendererConfig | undefined;
  readonly hasSourceArrow?: boolean | undefined;
  readonly hasTargetArrow?: boolean | undefined;
  readonly sourceOffset?: PortOffset | undefined;
  readonly targetOffset?: PortOffset | undefined;
}
