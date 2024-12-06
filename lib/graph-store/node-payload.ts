import { CenterFn } from "../center-fn";

export interface NodePayload {
  element: HTMLElement;
  x: number;
  y: number;
  centerFn: CenterFn;
}
