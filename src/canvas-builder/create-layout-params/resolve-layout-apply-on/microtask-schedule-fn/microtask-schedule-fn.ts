import { ApplyScheduleFn } from "@/configurators";

export const microtaskScheduleFn: ApplyScheduleFn = (apply): void => {
  queueMicrotask(() => {
    apply();
  });
};
