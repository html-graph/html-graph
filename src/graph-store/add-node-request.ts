import { CenterFn } from "@/center-fn";
import { Identifier } from "@/identifier";

export interface AddNodeRequest {
  readonly id: Identifier;
  readonly element: HTMLElement;
  readonly x: number | null;
  readonly y: number | null;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
