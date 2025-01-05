import { CenterFn } from "@/center-fn";
import { AddNodePorts } from "./add-node-ports";

export interface AddNodeRequest {
  id?: unknown;
  element: HTMLElement;
  x: number;
  y: number;
  ports?: AddNodePorts;
  centerFn?: CenterFn;
  priority?: number;
}
