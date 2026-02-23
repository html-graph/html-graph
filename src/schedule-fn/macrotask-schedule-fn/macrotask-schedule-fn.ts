import { ScheduleFn } from "../schedule-fn";

export const macrotaskScheduleFn: ScheduleFn = (callback): void => {
  setTimeout(() => {
    callback();
  });
};
