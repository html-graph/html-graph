import { ArrowRenderer } from "../../shared";
import { PortOffsetFn } from "../resolve-port-offset-fn";

export interface DirectEdgeModelShapeParams {
  readonly sourceOffsetFn: PortOffsetFn;
  readonly targetOffsetFn: PortOffsetFn;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowLength: number;
}
