export const wait = (timeout: number): Promise<void> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, timeout);
  });
};
