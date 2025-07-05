import { DraggableNodesConfig } from "./draggable-nodes-config";
import { Config } from "./config";

export const createConfig = (dragConfig: DraggableNodesConfig): Config => {
  const onNodeDrag = dragConfig?.events?.onNodeDrag ?? ((): void => {});

  const onBeforeNodeDrag =
    dragConfig?.events?.onBeforeNodeDrag ?? ((): boolean => true);

  const onNodeDragFinished =
    dragConfig?.events?.onNodeDragFinished ?? ((): void => {});

  const moveOnTop = dragConfig?.moveOnTop !== false;
  const moveEdgesOnTop = dragConfig?.moveEdgesOnTop !== false && moveOnTop;

  const cursor = dragConfig?.mouse?.dragCursor;
  const dragCursor = cursor !== undefined ? cursor : "grab";

  const defaultMouseDownEventVerifier =
    dragConfig?.mouse?.mouseDownEventVerifier;

  const mouseDownEventVerifier =
    defaultMouseDownEventVerifier !== undefined
      ? defaultMouseDownEventVerifier
      : (event: MouseEvent): boolean => event.button === 0;

  const defaultMouseUpEventVerifier = dragConfig?.mouse?.mouseUpEventVerifier;

  const mouseUpEventVerifier =
    defaultMouseUpEventVerifier !== undefined
      ? defaultMouseUpEventVerifier
      : (event: MouseEvent): boolean => event.button === 0;

  return {
    moveOnTop,
    moveEdgesOnTop,
    dragCursor,
    mouseDownEventVerifier,
    mouseUpEventVerifier,
    onNodeDrag,
    onBeforeNodeDrag,
    onNodeDragFinished,
  };
};
