import { DraggableNodesParams } from "@/configurators";
import { Identifier } from "@/identifier";

export const patchAnimatedLayoutDraggableNodesParams = (
  params: DraggableNodesParams,
  staticNodes: Set<Identifier>,
): DraggableNodesParams => {
  return {
    ...params,
    onNodeDragStarted: (nodeId): void => {
      staticNodes.add(nodeId);

      params.onNodeDragStarted(nodeId);
    },
    onNodeDragFinished: (nodeId): void => {
      staticNodes.delete(nodeId);

      params.onNodeDragFinished(nodeId);
    },
  };
};
