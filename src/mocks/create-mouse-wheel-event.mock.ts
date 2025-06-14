export const createMouseWheelEvent = (params: {
  clientX?: number;
  clientY?: number;
  deltaY?: number;
}): MouseEvent => {
  const wheelEvent = new MouseEvent("wheel", {
    clientX: params.clientX,
    clientY: params.clientX,
  });

  Object.defineProperty(wheelEvent, "deltaY", {
    get() {
      return params.deltaY ?? 0;
    },
  });

  return wheelEvent;
};
