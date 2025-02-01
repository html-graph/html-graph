export const isOnElement: (
  element: HTMLElement,
  px: number,
  py: number,
) => boolean = (element: HTMLElement, px: number, py: number) => {
  const { x, y, width, height } = element.getBoundingClientRect();

  return px >= x && px < x + width && py >= y && py <= y + height;
};
