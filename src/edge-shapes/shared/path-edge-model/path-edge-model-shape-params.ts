import { ArrowRenderer } from "../arrow-renderer";
import { EdgePathFactory } from "../edge-path-factory";

export interface PathEdgeModelShapeParams {
  readonly createPortCyclePath: EdgePathFactory;
  readonly createNodeCyclePath: EdgePathFactory;
  readonly createLinePath: EdgePathFactory;
  readonly padding: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowLength: number;
}
