import { CenterFn } from "@/center-fn";

export interface AddNodeRequest {
  readonly id: unknown;
  readonly element: HTMLElement;
  readonly x: number;
  readonly y: number;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
