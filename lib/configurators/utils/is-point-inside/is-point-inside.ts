import { isPointOnElement } from "../is-point-on-element";
import { isPointOnWindow } from "../is-point-on-window";

export const isPointInside = (
  win: Window,
  element: HTMLElement,
  x: number,
  y: number,
): boolean => {
  return isPointOnElement(element, x, y) && isPointOnWindow(win, x, y);
};
