import { CenterFn } from "@/center-fn";
import { NodeElement, PortElement } from "@/element";
import { Identifier } from "@/identifier";

export interface StoreNode {
  readonly element: NodeElement;
  readonly payload: {
    x: number | null;
    y: number | null;
    centerFn: CenterFn;
    priority: number;
  };
  readonly ports: Map<Identifier, PortElement>;
}
