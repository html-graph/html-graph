import { CenterFn } from "@/center-fn";
import { MarkNodePortRequest } from "./mark-node-port-request";

export interface AddNodeRequest {
  id?: unknown;
  element: HTMLElement;
  x: number;
  y: number;
  ports?: Map<unknown, MarkNodePortRequest>;
  centerFn?: CenterFn;
  priority?: number;
}
