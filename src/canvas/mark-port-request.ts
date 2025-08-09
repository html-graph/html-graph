import { Identifier } from "@/identifier";

export interface MarkPortRequest {
  readonly id?: Identifier;
  readonly element: HTMLElement;
  readonly nodeId: Identifier;
  readonly direction?: number;
}
