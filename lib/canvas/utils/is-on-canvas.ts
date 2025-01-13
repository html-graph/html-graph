export const isOnCanvas: (
  element: HTMLElement | null,
  px: number,
  py: number,
) => boolean = (element: HTMLElement | null, px: number, py: number) => {
  if (element === null) {
    return false;
  }

  const { x, y, width, height } = element.getBoundingClientRect();

  return px >= x && px < x + width && py >= y && py <= y + height;
};
