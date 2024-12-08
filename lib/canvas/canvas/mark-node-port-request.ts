import { CenterFn } from "@/center-fn";

export type MarkNodePortRequest =
  | HTMLElement
  | {
      readonly element: HTMLElement;
      readonly centerFn?: CenterFn;
      readonly direction?: number | null;
    };
