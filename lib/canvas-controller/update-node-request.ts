import { CenterFn } from "@/center-fn";

export interface UpdateNodeRequest {
  readonly x?: number;
  readonly y?: number;
  readonly priority?: number;
  readonly centerFn?: CenterFn;
}
