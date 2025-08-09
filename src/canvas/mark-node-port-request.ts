import { Identifier } from "@/identifier";

export type MarkNodePortRequest = {
  readonly id?: Identifier | undefined;
  readonly element: HTMLElement;
  readonly direction?: number | undefined;
};
