import { CenterFn } from "@/center-fn";

export interface UpdatePortRequest {
  readonly direction?: number;
  readonly centerFn?: CenterFn;
}
