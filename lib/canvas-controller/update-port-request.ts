import { CenterFn } from "@/center-fn";

export interface UpdatePortRequest {
  readonly direction: number | undefined;
  readonly centerFn: CenterFn | undefined;
}
