import { CenterFn } from "@/center-fn";
import { NodeElement } from "@/element";

export interface GraphNode {
  readonly element: NodeElement;
  readonly x: number | null;
  readonly y: number | null;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
