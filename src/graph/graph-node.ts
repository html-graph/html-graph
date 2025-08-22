import { CenterFn } from "@/center-fn";

export interface GraphNode {
  readonly element: HTMLElement;
  readonly x: number | null;
  readonly y: number | null;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
