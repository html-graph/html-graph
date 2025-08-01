import { DraggableNodesParams } from "@/configurators";
import { DraggableNodesConfig } from "./draggable-nodes-config";

export const createDraggableNodesParams = (
  config: DraggableNodesConfig,
): DraggableNodesParams => {
  const onNodeDrag = config.events?.onNodeDrag ?? ((): void => {});

  const nodeDragVerifier = config.nodeDragVerifier ?? ((): boolean => true);

  const onNodeDragFinished =
    config.events?.onNodeDragFinished ?? ((): void => {});

  const moveOnTop = config.moveOnTop !== false;
  const moveEdgesOnTop = config.moveEdgesOnTop !== false && moveOnTop;

  const cursor = config.mouse?.dragCursor;
  const dragCursor = cursor !== undefined ? cursor : "grab";

  const defaultMouseDownEventVerifier = config.mouse?.mouseDownEventVerifier;

  const mouseDownEventVerifier =
    defaultMouseDownEventVerifier !== undefined
      ? defaultMouseDownEventVerifier
      : (event: MouseEvent): boolean => event.button === 0;

  const defaultMouseUpEventVerifier = config.mouse?.mouseUpEventVerifier;

  const mouseUpEventVerifier =
    defaultMouseUpEventVerifier !== undefined
      ? defaultMouseUpEventVerifier
      : (event: MouseEvent): boolean => event.button === 0;

  return {
    moveOnTop,
    moveEdgesOnTop,
    dragCursor,
    gridSize: config.gridSize ?? null,
    mouseDownEventVerifier,
    mouseUpEventVerifier,
    onNodeDrag,
    nodeDragVerifier,
    onNodeDragFinished,
  };
};
