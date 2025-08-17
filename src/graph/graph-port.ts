import { Identifier } from "@/identifier";

export interface GraphPort {
  readonly element: HTMLElement;
  readonly direction: number;
  readonly nodeId: Identifier;
}
