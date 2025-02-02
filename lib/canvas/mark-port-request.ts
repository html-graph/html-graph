import { CenterFn } from "@/center-fn";

export interface MarkPortRequest {
  readonly id?: unknown;
  readonly element: HTMLElement;
  readonly nodeId: unknown;
  readonly centerFn?: CenterFn;
  readonly direction?: number;
}
