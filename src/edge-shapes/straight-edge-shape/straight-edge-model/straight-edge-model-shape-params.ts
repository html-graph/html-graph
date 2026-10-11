import { ArrowRenderer, EdgePathFactory } from "../../shared";

export interface StraightEdgeModelShapeParams {
  readonly createPortCyclePath: EdgePathFactory;
  readonly createNodeCyclePath: EdgePathFactory;
  readonly createLinePath: EdgePathFactory;
  readonly padding: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowLength: number;
}
