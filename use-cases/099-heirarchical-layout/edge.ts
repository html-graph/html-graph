import { Identifier } from "@html-graph/html-graph";

export interface Edge {
  readonly from: Identifier;
  readonly to: Identifier;
}
