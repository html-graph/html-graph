import { CenterFn } from "@/center-fn";

export interface NodePayload {
  readonly element: HTMLElement;
  x: number;
  y: number;
  centerFn: CenterFn;
  priority: number;
  readonly ports: Map<unknown, HTMLElement>;
}
