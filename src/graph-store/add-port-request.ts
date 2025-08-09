import { Identifier } from "@/identifier";

export interface AddPortRequest {
  readonly id: Identifier;
  readonly nodeId: Identifier;
  readonly element: HTMLElement;
  readonly direction: number;
}
