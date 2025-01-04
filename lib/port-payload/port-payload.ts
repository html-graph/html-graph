import { CenterFn } from "@/center-fn";

export interface PortPayload {
  readonly element: HTMLElement;
  centerFn: CenterFn;
  direction: number;
}
