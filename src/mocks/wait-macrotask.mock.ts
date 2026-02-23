export const waitMacrotask = (timeout: number): Promise<void> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, timeout);
  });
};
