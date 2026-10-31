import { ArrowRenderer } from "@/edge-shapes/shared";
import { Viewport } from "@/viewport";

export interface SegmentedEditableEdgeControllerParams {
  readonly canvasViewport: Viewport;
  readonly color: string;
  readonly width: number;
  readonly arrowLength: number;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowOffset: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly roundness: number;
}
