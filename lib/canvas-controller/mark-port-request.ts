import { CenterFn } from "@/center-fn";

export interface MarkPortRequest {
  readonly portId: unknown | undefined;
  readonly element: HTMLElement;
  readonly nodeId: unknown;
  readonly centerFn: CenterFn | undefined;
  readonly direction: number | undefined;
}
