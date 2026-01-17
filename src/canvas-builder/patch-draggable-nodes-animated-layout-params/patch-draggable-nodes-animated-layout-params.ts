import { AnimatedLayoutParams } from "@/configurators";
import { Identifier } from "@/identifier";

export const patchDraggableNodesAnimatedLayoutParams = (
  params: AnimatedLayoutParams,
  animationStaticNodes: ReadonlySet<Identifier>,
): AnimatedLayoutParams => {
  return {
    ...params,
    staticNodeResolver: (nodeId: Identifier): boolean =>
      params.staticNodeResolver(nodeId) || animationStaticNodes.has(nodeId),
  };
};
