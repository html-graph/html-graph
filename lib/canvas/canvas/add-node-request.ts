import { CenterFn } from "@/center-fn";
import { AddNodePorts } from "./add-node-ports";

export interface AddNodeRequest {
  readonly id?: unknown;
  readonly element: HTMLElement;
  readonly x: number;
  readonly y: number;
  readonly ports?: AddNodePorts;
  readonly centerFn?: CenterFn;
  readonly priority?: number;
}
