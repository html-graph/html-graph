import { CenterFn } from "@/center-fn";

export interface UpdatePortMarkRequest {
  readonly direction?: number;
  readonly centerFn?: CenterFn;
}
