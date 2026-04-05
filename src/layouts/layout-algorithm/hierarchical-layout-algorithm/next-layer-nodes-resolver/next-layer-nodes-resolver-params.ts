import { Graph } from "@/graph";
import { Identifier } from "@/identifier";

export interface NextLayerNodesResolverParams {
  readonly graph: Graph;
  readonly currentNodeId: Identifier;
}
