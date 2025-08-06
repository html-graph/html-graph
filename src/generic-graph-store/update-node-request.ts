import { CenterFn } from "@/center-fn";

export interface UpdateNodeRequest<T> {
  readonly x?: T;
  readonly y?: T;
  readonly centerFn?: CenterFn;
  readonly priority?: number;
}
