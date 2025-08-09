import { CenterFn } from "@/center-fn";
import { Identifier } from "@/identifier";

export interface AddNodeRequest {
  readonly id: Identifier;
  readonly element: HTMLElement;
  readonly x: number;
  readonly y: number;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
