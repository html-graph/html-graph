import { ArrowRenderer } from "@/edge-shapes/shared";

export interface SegmentedOrthogonalEdgeControllerParams {
  readonly color: string;
  readonly width: number;
  readonly arrowLength: number;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowOffset: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly roundness: number;
}
