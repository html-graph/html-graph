import { CenterFn } from "@/center-fn";
import { AddNodePorts } from "./add-node-ports";
import { Identifier } from "@/identifier";

export interface AddNodeRequest {
  readonly id?: Identifier;
  readonly element: HTMLElement;
  readonly x?: number | null;
  readonly y?: number | null;
  readonly ports?: AddNodePorts | undefined;
  readonly centerFn?: CenterFn | undefined;
  readonly priority?: number | undefined;
}
