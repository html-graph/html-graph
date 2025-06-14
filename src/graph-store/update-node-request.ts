import { CenterFn } from "@/center-fn";

export interface UpdateNodeRequest {
  readonly x?: number;
  readonly y?: number;
  readonly centerFn?: CenterFn;
  readonly priority?: number;
}
