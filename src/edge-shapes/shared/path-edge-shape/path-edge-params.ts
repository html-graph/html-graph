import { ArrowRenderer } from "../arrow-renderer";
import { EdgePathFactory } from "./edge-path-factory";

export interface PathEdgeParams {
  readonly width: number;
  readonly color: string;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowLength: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly createPortCyclePath: EdgePathFactory;
  readonly createNodeCyclePath: EdgePathFactory;
  readonly createLinePath: EdgePathFactory;
  readonly padding: number;
}
