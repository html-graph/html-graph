import {
  NextLayerNodesResolver,
  adjacentNextLayerNodesResolver,
  incomingNextLayerNodesResolver,
  outgoingNextLayerNodesResolver,
} from "@/layouts";
import { NextLayerNodesResolverDeclaration } from "./next-layer-nodes-resolver-declaration";

export const resolveNextLayerNodesResolver = (
  resolver: NextLayerNodesResolverDeclaration,
): NextLayerNodesResolver => {
  if (typeof resolver === "function") {
    return resolver;
  }

  switch (resolver) {
    case "adjacent":
      return adjacentNextLayerNodesResolver;
    case "outgoing":
      return outgoingNextLayerNodesResolver;
    case "incoming":
      return incomingNextLayerNodesResolver;
  }
};
