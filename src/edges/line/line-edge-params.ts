import { EdgePathFactory } from "./create-path-fn";

export interface LineEdgeParams {
  readonly width: number;
  readonly color: string;
  readonly arrowLength: number;
  readonly arrowWidth: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly createCyclePath: EdgePathFactory;
  readonly createDetourPath: EdgePathFactory;
  readonly createLinePath: EdgePathFactory;
}
