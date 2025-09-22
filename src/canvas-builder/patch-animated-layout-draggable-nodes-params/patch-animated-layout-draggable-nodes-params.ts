import { DraggableNodesParams } from "@/configurators";
import { Identifier } from "@/identifier";

export const patchAnimatedLayoutDraggableNodesParams = (
  params: DraggableNodesParams,
  staticNodes: Set<Identifier>,
): DraggableNodesParams => {
  return {
    ...params,
    nodeDragVerifier: (nodeId): boolean => {
      staticNodes.add(nodeId);

      return params.nodeDragVerifier(nodeId);
    },
    onNodeDragFinished: (nodeId): void => {
      staticNodes.delete(nodeId);

      params.onNodeDragFinished(nodeId);
    },
  };
};
