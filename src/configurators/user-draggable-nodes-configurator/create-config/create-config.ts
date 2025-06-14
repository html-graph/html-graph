import { DragConfig } from "./drag-config";
import { Config } from "./config";

export const createConfig = (dragConfig: DragConfig): Config => {
  const onNodeDrag = dragConfig?.events?.onNodeDrag ?? ((): void => {});

  const onBeforeNodeDrag =
    dragConfig?.events?.onBeforeNodeDrag ?? ((): boolean => true);

  const onNodeDragFinished =
    dragConfig?.events?.onNodeDragFinished ?? ((): void => {});

  const freezePriority = dragConfig?.moveOnTop === false;

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
    freezePriority,
    dragCursor,
    mouseDownEventVerifier,
    mouseUpEventVerifier,
    onNodeDrag,
    onBeforeNodeDrag,
    onNodeDragFinished,
  };
};
