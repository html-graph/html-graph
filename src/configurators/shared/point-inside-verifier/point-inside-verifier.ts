import { isPointOnElement } from "./is-point-on-element";
import { isPointOnWindow } from "./is-point-on-window";

export class PointInsideVerifier {
  public constructor(
    private readonly element: HTMLElement,
    private readonly win: Window,
  ) {}

  public verify(x: number, y: number): boolean {
    return (
      isPointOnElement(this.element, x, y) && isPointOnWindow(this.win, x, y)
    );
  }
}
