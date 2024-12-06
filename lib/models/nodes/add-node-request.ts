import { CenterFn } from "../../center-fn";
import { MarkPortRequest } from "./mark-port-request";

export interface AddNodeRequest {
  id?: string;
  element: HTMLElement;
  x: number;
  y: number;
  ports?: Record<string, MarkPortRequest>;
  centerFn?: CenterFn;
}
