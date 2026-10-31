import { ArrowRenderer } from "../../shared";

export interface SegmentedEditableEdgeModelShapeParams {
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly arrowLength: number;
  readonly arrowOffset: number;
  readonly arrowRenderer: ArrowRenderer;
  readonly roundness: number;
}
