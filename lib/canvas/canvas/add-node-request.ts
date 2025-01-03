import { CenterFn } from "@/center-fn";
import { MarkNodePortRequest } from "./mark-node-port-request";

export interface AddNodeRequest {
  id?: string;
  element: HTMLElement;
  x: number;
  y: number;
  ports?: Record<string, MarkNodePortRequest>;
  centerFn?: CenterFn;
  priority?: number;
}
