import { CenterFn } from "@/center-fn";

export interface PortPayload {
  readonly element: HTMLElement;
  readonly centerFn: CenterFn;
  readonly direction: number | null;
}
