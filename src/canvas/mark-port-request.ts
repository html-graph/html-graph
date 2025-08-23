import { Identifier } from "@/identifier";

export interface MarkPortRequest {
  readonly id?: Identifier | undefined;
  readonly element: HTMLElement;
  readonly nodeId: Identifier;
  readonly direction?: number | undefined;
}
