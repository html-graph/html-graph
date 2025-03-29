export const triggerResizeFor = (element: HTMLElement): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).triggerResizeFor(element);
};
