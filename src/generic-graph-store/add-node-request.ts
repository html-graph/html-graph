import { CenterFn } from "@/center-fn";

export interface AddNodeRequest<T> {
  readonly id: unknown;
  readonly element: HTMLElement;
  readonly x: T;
  readonly y: T;
  readonly centerFn: CenterFn;
  readonly priority: number;
}
