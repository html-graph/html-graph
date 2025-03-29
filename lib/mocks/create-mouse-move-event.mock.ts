export const createMouseMoveEvent = (params: {
  movementX?: number;
  movementY?: number;
  clientX?: number;
  clientY?: number;
}): MouseEvent => {
  const moveEvent = new MouseEvent("mousemove", {
    clientX: params.clientX,
    clientY: params.clientX,
  });

  Object.defineProperty(moveEvent, "movementX", {
    get() {
      return params.movementX ?? 0;
    },
  });

  Object.defineProperty(moveEvent, "movementY", {
    get() {
      return params.movementY ?? 0;
    },
  });

  return moveEvent;
};
