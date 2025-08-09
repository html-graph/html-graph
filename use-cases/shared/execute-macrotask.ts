export const executeMacrotask = (task: () => void): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      task();
      resolve();
    });
  });
};
