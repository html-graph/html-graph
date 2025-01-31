import { CenterFn } from "@/center-fn";
import { AddNodePorts } from "./add-node-ports";

export interface AddNodeRequest {
  readonly nodeId: unknown | undefined;
  readonly element: HTMLElement;
  readonly x: number;
  readonly y: number;
  readonly ports: AddNodePorts | undefined;
  readonly centerFn: CenterFn | undefined;
  readonly priority: number | undefined;
}
