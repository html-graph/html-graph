export const createTouch = (params: {
  clientX: number;
  clientY: number;
}): Touch => {
  return {
    clientX: params.clientX,
    clientY: params.clientY,
    force: 0,
    identifier: 0,
    pageX: 0,
    pageY: 0,
    radiusX: 0,
    radiusY: 0,
    rotationAngle: 0,
    screenX: 0,
    screenY: 0,
    target: document.createElement("div"),
  };
};
