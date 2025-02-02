import { CenterFn } from "@/center-fn";

export type MarkNodePortRequest = {
  readonly id?: unknown;
  readonly element: HTMLElement;
  readonly centerFn?: CenterFn;
  readonly direction?: number;
};
