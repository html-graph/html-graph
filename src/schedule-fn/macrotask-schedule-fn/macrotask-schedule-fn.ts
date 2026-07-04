import { ScheduleFn } from "../schedule-fn";

/**
 * @deprecated
 * use macrotaskScheduleFn instead
 */
export const macrotaskScheduleFn: ScheduleFn = (callback): void => {
  setTimeout(() => {
    callback();
  });
};
