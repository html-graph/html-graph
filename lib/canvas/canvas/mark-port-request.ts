import { CenterFn } from "@/center-fn";

export interface MarkPortRequest {
  readonly id?: string;
  readonly element: HTMLElement;
  readonly nodeId: string;
  readonly centerFn?: CenterFn;
  readonly direction?: number;
}
