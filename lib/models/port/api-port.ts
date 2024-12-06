import { CenterFn } from "../../center-fn";

export interface ApiPort {
  readonly id?: string;
  readonly element: HTMLElement;
  readonly nodeId: string;
  readonly centerFn?: CenterFn;
  readonly direction?: number | null;
}
