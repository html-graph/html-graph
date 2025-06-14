import { CenterFn } from "@/center-fn";

export interface UpdateNodeRequest {
  readonly x?: number | undefined;
  readonly y?: number | undefined;
  readonly priority?: number | undefined;
  readonly centerFn?: CenterFn | undefined;
}
