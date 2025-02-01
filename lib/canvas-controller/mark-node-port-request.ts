import { CenterFn } from "@/center-fn";

export interface MarkNodePortRequest {
  readonly id: unknown | undefined;
  readonly element: HTMLElement;
  readonly centerFn: CenterFn | undefined;
  readonly direction: number | undefined;
}
