export const lmbCtrlMouseEventVerifier = (event: MouseEvent): boolean =>
  event.button === 0 && event.ctrlKey;
