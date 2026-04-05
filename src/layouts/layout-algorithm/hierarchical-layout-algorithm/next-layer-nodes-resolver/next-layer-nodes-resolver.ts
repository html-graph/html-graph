import { Identifier } from "@/identifier";
import { NextLayerNodesResolverParams } from "./next-layer-nodes-resolver-params";

export type NextLayerNodesResolver = (
  params: NextLayerNodesResolverParams,
) => Iterable<Identifier>;
