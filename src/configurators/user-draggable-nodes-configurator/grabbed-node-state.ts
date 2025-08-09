import { Identifier } from "@/identifier";

export interface GrabbedNodeState {
  readonly nodeId: Identifier;
  readonly dx: number;
  readonly dy: number;
}
