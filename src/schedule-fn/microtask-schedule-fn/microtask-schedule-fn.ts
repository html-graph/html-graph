import { ScheduleFn } from "../apply-schedule-fn";

export const microtaskScheduleFn: ScheduleFn = (apply): void => {
  queueMicrotask(() => {
    apply();
  });
};
