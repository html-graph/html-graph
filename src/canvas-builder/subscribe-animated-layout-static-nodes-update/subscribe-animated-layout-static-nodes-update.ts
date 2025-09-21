import { Graph } from "@/graph";
import { Identifier } from "@/identifier";

export const subscribeAnimatedLayoutStaticNodesUpdate = (
  graph: Graph,
  animationStaticNodes: Set<Identifier>,
): void => {
  graph.onBeforeNodeRemoved.subscribe((nodeId) => {
    animationStaticNodes.delete(nodeId);
  });

  graph.onBeforeClear.subscribe(() => {
    animationStaticNodes.clear();
  });
};
