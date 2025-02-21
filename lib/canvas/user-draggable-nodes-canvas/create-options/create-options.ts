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

  const defaultMouseDownEventValidator =
    dragOptions?.mouse?.mouseDownEventVerifier;

  const mouseDownEventValidator =
    defaultMouseDownEventValidator !== undefined
      ? defaultMouseDownEventValidator
      : (event: MouseEvent): boolean => event.button === 0;

  const defaultMouseUpEventValidator = dragOptions?.mouse?.mouseUpEventVerifier;

  const mouseUpEventValidator =
    defaultMouseUpEventValidator !== undefined
      ? defaultMouseUpEventValidator
      : (event: MouseEvent): boolean => event.button === 0;

  return {
    freezePriority,
    dragCursor,
    mouseDownEventValidator,
    mouseUpEventValidator,
    onNodeDrag,
    onBeforeNodeDrag,
    onNodeDragFinished,
  };
};
