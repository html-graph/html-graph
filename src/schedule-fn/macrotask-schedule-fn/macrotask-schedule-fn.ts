import { ScheduleFn } from "../apply-schedule-fn";

export const macrotaskScheduleFn: ScheduleFn = (apply): void => {
  setTimeout(() => {
    apply();
  });
};
