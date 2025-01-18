import { Point, PortPayload } from "@html-graph/html-graph";

export const createPortCenter: (port: PortPayload) => Point = (
  port: PortPayload,
) => {
  const { top, left, width, height } = port.element.getBoundingClientRect();

  const center = port.centerFn(width, height);

  return { x: left + center.x, y: top + center.y };
};
