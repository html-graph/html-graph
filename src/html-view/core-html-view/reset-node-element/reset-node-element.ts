import { NodeElement } from "@/element";

export const resetNodeElement = (element: NodeElement): void => {
  element.style.removeProperty("position");
  element.style.removeProperty("top");
  element.style.removeProperty("left");
  element.style.removeProperty("visibility");
  element.style.removeProperty("transform");
};
