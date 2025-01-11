export const createIncrementalPriorityFn: () => () => number = () => {
  let i = 0;

  return () => i++;
};
