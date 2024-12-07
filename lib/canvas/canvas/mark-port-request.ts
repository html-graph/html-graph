import { CenterFn } from "../../center-fn";

export type MarkPortRequest =
  | HTMLElement
  | {
      readonly element: HTMLElement;
      readonly centerFn?: CenterFn;
      readonly direction?: number | null;
    };
