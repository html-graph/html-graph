import { PriorityFn } from "../priority-fn";

export const createConstantPriorityFn: (priority: number) => PriorityFn = (
  priority: number,
) => {
  return () => priority;
};
