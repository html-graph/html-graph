import { PortElement } from "@/element";
import { Identifier } from "@/identifier";

export interface MarkPortRequest {
  readonly id?: Identifier | undefined;
  readonly element: PortElement;
  readonly nodeId: Identifier;
  readonly direction?: number | undefined;
}
