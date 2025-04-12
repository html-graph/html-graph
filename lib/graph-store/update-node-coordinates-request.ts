import { CenterFn } from "@/center-fn";

export interface UpdateNodeCoordinatesRequest {
  readonly x: number | undefined;
  readonly y: number | undefined;
  readonly centerFn: CenterFn | undefined;
}
