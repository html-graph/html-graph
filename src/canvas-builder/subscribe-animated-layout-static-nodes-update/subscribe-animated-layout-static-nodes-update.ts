import { Canvas } from "@/canvas/canvas";
import { Identifier } from "@/identifier";

export const subscribeAnimatedLayoutStaticNodesUpdate = (
  canvas: Canvas,
  animationStaticNodes: Set<Identifier>,
): void => {
  canvas.graph.onBeforeNodeRemoved.subscribe((nodeId) => {
    animationStaticNodes.delete(nodeId);
  });

  canvas.graph.onBeforeClear.subscribe(() => {
    animationStaticNodes.clear();
  });

  canvas.onBeforeDestroy.subscribe(() => {
    animationStaticNodes.clear();
  });
};
