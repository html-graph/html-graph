import { CenterFn } from "@/center-fn";

export interface GraphNode {
  readonly element: HTMLElement;
  readonly x: number;
  readonly y: number;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
