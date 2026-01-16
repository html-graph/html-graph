export const triggerResizeFor = (element: HTMLElement | SVGElement): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).triggerResizeFor(element);
};
