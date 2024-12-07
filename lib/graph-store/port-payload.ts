import { CenterFn } from "@/center-fn";

export interface PortPayload {
  element: HTMLElement;
  centerFn: CenterFn;
  direction: number | null;
}
