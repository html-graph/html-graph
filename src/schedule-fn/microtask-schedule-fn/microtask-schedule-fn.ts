import { ScheduleFn } from "../schedule-fn";

export const microtaskScheduleFn: ScheduleFn = (callback): void => {
  queueMicrotask(() => {
    callback();
  });
};
