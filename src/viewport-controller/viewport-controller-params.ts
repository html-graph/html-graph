import { ScheduleFn } from "@/schedule-fn";

export interface ViewportControllerParams {
  readonly focus: {
    readonly contentPadding: number;
    readonly minContentScale: number;
    readonly schedule: ScheduleFn;
    readonly animationDuration: number;
  };
}
