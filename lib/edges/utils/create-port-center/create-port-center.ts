import { PortPayload } from "@/port-payload";
import { Point } from "../../point";

export const createPortCenter: (port: PortPayload) => Point = (
  port: PortPayload,
) => {
  const { top, left, width, height } = port.element.getBoundingClientRect();

  const center = port.centerFn(width, height);

  return [left + center[0], top + center[1]];
};
