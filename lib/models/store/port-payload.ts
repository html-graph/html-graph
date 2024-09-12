import { CenterFn } from "../center/center-fn";

export interface PortPayload {
  element: HTMLElement;
  centerFn: CenterFn;
  dir: number | null;
}
