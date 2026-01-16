import { PortElement } from "@/element";
import { Identifier } from "@/identifier";

export interface AddPortRequest {
  readonly id: Identifier;
  readonly nodeId: Identifier;
  readonly element: PortElement;
  readonly direction: number;
}
