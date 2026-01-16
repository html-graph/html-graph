import { PortElement } from "@/element";
import { Identifier } from "@/identifier";

export type MarkNodePortRequest = {
  readonly id?: Identifier | undefined;
  readonly element: PortElement;
  readonly direction?: number | undefined;
};
