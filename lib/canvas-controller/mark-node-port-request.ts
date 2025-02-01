import { CenterFn } from "@/center-fn";

export type MarkNodePortRequest = {
  readonly id: unknown | undefined;
  readonly element: HTMLElement;
  readonly centerFn: CenterFn | undefined;
  readonly direction: number | undefined;
};
