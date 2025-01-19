import { GraphPort } from "@/graph-store";
import { Point } from "@/point";

export const createPortCenter: (port: GraphPort) => Point = (
  port: GraphPort,
) => {
  const { top, left, width, height } = port.element.getBoundingClientRect();

  const center = port.centerFn(width, height);

  return { x: left + center.x, y: top + center.y };
};
