import { PortElement } from "@/element";
import { Identifier } from "@/identifier";

export interface StorePort {
  readonly element: PortElement;
  readonly payload: {
    direction: number;
  };
  readonly nodeId: Identifier;
}
