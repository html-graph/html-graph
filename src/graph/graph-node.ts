import { CenterFn } from "@/center-fn";

export interface GraphNode<T> {
  readonly element: HTMLElement;
  readonly x: T;
  readonly y: T;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
