import { NextLayerNodesResolver } from "@/layouts";

export type NextLayerNodesResolverDeclaration =
  | NextLayerNodesResolver
  | "adjacent"
  | "outgoing"
  | "incoming";
