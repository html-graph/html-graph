import { ApplyScheduleFn } from "@/configurators";

export const macrotaskScheduleFn: ApplyScheduleFn = (apply): void => {
  setTimeout(() => {
    apply();
  });
};
