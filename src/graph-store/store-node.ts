import { CenterFn } from "@/center-fn";
import { Identifier } from "@/identifier";

export interface StoreNode {
  readonly element: HTMLElement;
  readonly payload: {
    x: number | null;
    y: number | null;
    centerFn: CenterFn;
    priority: number;
  };
  readonly ports: Map<Identifier, HTMLElement>;
}
