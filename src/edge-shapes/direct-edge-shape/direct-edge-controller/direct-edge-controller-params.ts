import { ArrowRenderer } from "@/edge-shapes/shared";
import { PortOffsetFn } from "../resolve-port-offset-fn";

export interface DirectEdgeControllerParams {
  readonly color: string;
  readonly width: number;
  readonly arrowLength: number;
  readonly arrowRenderer: ArrowRenderer;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly sourceOffsetFn: PortOffsetFn;
  readonly targetOffsetFn: PortOffsetFn;
}
