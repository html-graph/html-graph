import { ScheduleFn } from "../schedule-fn";

export const immediateScheduleFn: ScheduleFn = (callback): void => {
  callback();
};
