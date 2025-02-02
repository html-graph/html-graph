import { CenterFn } from "@/center-fn";

export interface MarkNodePortRequest {
  readonly id?: unknown;
  readonly element: HTMLElement;
  readonly centerFn?: CenterFn;
  readonly direction?: number;
}
