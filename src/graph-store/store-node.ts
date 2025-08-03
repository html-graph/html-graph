import { CenterFn } from "@/center-fn";

export interface StoreNode {
  readonly element: HTMLElement;
  readonly payload: {
    x: number;
    y: number;
    centerFn: CenterFn;
    priority: number;
  };
  readonly ports: Map<unknown, HTMLElement>;
}
