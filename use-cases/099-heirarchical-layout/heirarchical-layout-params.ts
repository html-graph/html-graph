import { Identifier } from "@html-graph/html-graph";

export interface HeirarchicalLayoutParams {
  readonly startNodeId: Identifier;
  readonly layerSize: number;
  readonly layerSpace: number;
}
