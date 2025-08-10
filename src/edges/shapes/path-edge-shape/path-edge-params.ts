import { ArrowRenderer } from "@/edges/arrow-renderer";
import { EdgePathFactory } from "./edge-path-factory";

export interface PathEdgeParams {
  readonly width: number;
  readonly color: string;
  readonly arrowRenderer: ArrowRenderer;
  readonly arrowLength: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly createCyclePath: EdgePathFactory;
  readonly createDetourPath: EdgePathFactory;
  readonly createLinePath: EdgePathFactory;
}
