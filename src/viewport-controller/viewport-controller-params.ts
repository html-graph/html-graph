import { ScheduleFn } from "@/schedule-fn";

export interface ViewportControllerParams {
  readonly focus: {
    readonly contentOffset: number;
    readonly minContentScale: number;
    readonly schedule: ScheduleFn;
  };
}
