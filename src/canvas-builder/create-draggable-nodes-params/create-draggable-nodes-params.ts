import { DraggableNodesParams } from "@/configurators";
import { DraggableNodesConfig } from "./draggable-nodes-config";
import {
  lmbMouseEventVerifier,
  lmbNoCtrlMouseEventVerifier,
  noopFn,
} from "../shared";

export const createDraggableNodesParams = (
  config: DraggableNodesConfig,
): DraggableNodesParams => {
  const moveOnTop = config.moveOnTop !== false;
  const moveEdgesOnTop = config.moveEdgesOnTop !== false && moveOnTop;

  return {
    moveOnTop,
    moveEdgesOnTop,
    dragCursor: config.mouse?.dragCursor ?? "grab",
    gridSize: config.gridSize ?? null,
    mouseDownEventVerifier:
      config.mouse?.mouseDownEventVerifier ?? lmbNoCtrlMouseEventVerifier,
    mouseUpEventVerifier:
      config.mouse?.mouseUpEventVerifier ?? lmbMouseEventVerifier,
    onNodeDragStarted: config.events?.onNodeDragStarted ?? noopFn,
    onNodeDrag: config.events?.onNodeDrag ?? noopFn,
    nodeDragVerifier: config.nodeDragVerifier ?? ((): boolean => true),
    onNodeDragFinished: config.events?.onNodeDragFinished ?? noopFn,
  };
};
