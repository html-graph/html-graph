import { PriorityFn } from "../priority-fn";

export const createIncrementalPriorityFn: () => PriorityFn = () => {
  let i = 0;

  return () => i++;
};
