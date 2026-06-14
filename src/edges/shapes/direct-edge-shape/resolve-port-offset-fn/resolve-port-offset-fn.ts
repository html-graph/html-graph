import { boxPortOffsetFn } from "../box-port-offset-fn";
import { PortOffset } from "./port-offset";
import { PortOffsetFn } from "./port-offset-fn";

export const resolvePortOffsetFn = (offset: PortOffset): PortOffsetFn => {
  if (typeof offset === "number") {
    return () => offset;
  }

  if (offset === "box") {
    return boxPortOffsetFn;
  }

  return offset;
};
