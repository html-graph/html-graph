import { DraggableNodesParams } from "@/configurators";
import { DraggableNodesConfig } from "./draggable-nodes-config";
import { noopFn } from "../shared";

export const createDraggableNodesParams = (
  config: DraggableNodesConfig,
): DraggableNodesParams => {
  const nodeDragVerifier = config.nodeDragVerifier ?? ((): boolean => true);

  const moveOnTop = config.moveOnTop !== false;
  const moveEdgesOnTop = config.moveEdgesOnTop !== false && moveOnTop;

  return {
    moveOnTop,
    moveEdgesOnTop,
    dragCursor: config.mouse?.dragCursor ?? "grab",
    gridSize: config.gridSize ?? null,
    mouseDownEventVerifier:
      config.mouse?.mouseDownEventVerifier ??
      ((event: MouseEvent): boolean => event.button === 0),
    mouseUpEventVerifier:
      config.mouse?.mouseUpEventVerifier ??
      ((event: MouseEvent): boolean => event.button === 0),
    onNodeDragStarted: config.events?.onNodeDragStarted ?? noopFn,
    onNodeDrag: config.events?.onNodeDrag ?? noopFn,
    nodeDragVerifier,
    onNodeDragFinished: config.events?.onNodeDragFinished ?? noopFn,
  };
};
