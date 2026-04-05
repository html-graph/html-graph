import {
  NextLayerNodesResolver,
  adjacentNextLayerNodesResolver,
  incomingNextLayerNodesResolver,
  outgoingNextLayerNodesResolver,
} from "@/layouts";
import { NextLayerNodesResolverDeclaration } from "./next-layer-nodes-resolver-declaration";

export const resolveNextLayerNodesResolver = (
  resolver: NextLayerNodesResolverDeclaration | undefined,
): NextLayerNodesResolver => {
  if (typeof resolver === "function") {
    return resolver;
  }

  switch (resolver) {
    case "outgoing":
      return outgoingNextLayerNodesResolver;
    case "incoming":
      return incomingNextLayerNodesResolver;
    default:
      return adjacentNextLayerNodesResolver;
  }
};
