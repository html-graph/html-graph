export const isOnWindow: (win: Window, px: number, py: number) => boolean = (
  win: Window,
  px: number,
  py: number,
) => {
  return px >= 0 && px < win.innerWidth && py >= 0 && py <= win.innerHeight;
};
