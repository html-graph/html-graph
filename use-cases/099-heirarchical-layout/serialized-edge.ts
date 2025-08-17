import { Identifier } from "@html-graph/html-graph";

export interface SerializedEdge {
  readonly id: Identifier;
  readonly from: Identifier;
  readonly to: Identifier;
}
