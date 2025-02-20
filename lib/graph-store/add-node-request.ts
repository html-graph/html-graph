import { CenterFn } from "@/center-fn";

export interface AddNodeRequest {
  readonly nodeId: unknown;
  readonly element: HTMLElement;
  readonly x: number;
  readonly y: number;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
