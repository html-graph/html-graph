import { DragOptions } from "./drag-options";
import { Options } from "./options";

export const createOptions = (dragOptions: DragOptions): Options => {
  const onNodeDrag = dragOptions?.events?.onNodeDrag ?? ((): void => {});

  const onBeforeNodeDrag =
    dragOptions?.events?.onBeforeNodeDrag ?? ((): boolean => true);

  const onNodeDragFinished =
    dragOptions?.events?.onNodeDragFinished ?? ((): void => {});

  const freezePriority = dragOptions?.moveOnTop === false;

  const cursor = dragOptions?.mouse?.dragCursor;
  const dragCursor = cursor !== undefined ? cursor : "grab";

  const defaultMouseDownEventVerifier =
    dragOptions?.mouse?.mouseDownEventVerifier;

  const mouseDownEventVerifier =
    defaultMouseDownEventVerifier !== undefined
      ? defaultMouseDownEventVerifier
      : (event: MouseEvent): boolean => event.button === 0;

  const defaultMouseUpEventVerifier = dragOptions?.mouse?.mouseUpEventVerifier;

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
