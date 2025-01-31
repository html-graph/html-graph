import { CenterFn } from "@/center-fn";

export interface AddPortRequest {
  readonly portId: unknown;
  readonly nodeId: unknown;
  readonly element: HTMLElement;
  readonly centerFn: CenterFn;
  readonly direction: number;
}
