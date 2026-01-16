import { NodeElement } from "@/element";

export const prepareNodeElement = (element: NodeElement): void => {
  element.style.position = "absolute";
  element.style.top = "0";
  element.style.left = "0";
  element.style.visibility = "hidden";
};
