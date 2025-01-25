import { CenterFn } from "@/center-fn";

export interface GraphPort {
  readonly element: HTMLElement;
  readonly centerFn: CenterFn;
  readonly direction: number;
}
