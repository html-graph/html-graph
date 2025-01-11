export const createConstantPriorityFn: (priority: number) => () => number = (
  priority: number,
) => {
  return () => priority;
};
