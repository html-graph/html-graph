import { CenterFn } from "@/center-fn";
import { NodeElement } from "@/element";
import { Identifier } from "@/identifier";

export interface AddNodeRequest {
  readonly id: Identifier;
  readonly element: NodeElement;
  readonly x: number | null;
  readonly y: number | null;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
