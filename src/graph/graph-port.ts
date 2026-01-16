import { PortElement } from "@/element";
import { Identifier } from "@/identifier";

export interface GraphPort {
  readonly element: PortElement;
  readonly direction: number;
  readonly nodeId: Identifier;
}
