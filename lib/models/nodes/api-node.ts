import { CenterFn } from "../center/center-fn";
import { ApiPortsPayload } from "./api-ports-payload";

export interface ApiNode {
  id?: string;
  element: HTMLElement;
  x?: number;
  y?: number;
  ports?: Record<string, ApiPortsPayload>;
  centerFn?: CenterFn;
}
