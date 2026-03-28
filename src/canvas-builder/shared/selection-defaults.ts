export const selectionDefaults = Object.freeze({
  mouseDownEventVerifier: (event: MouseEvent): boolean => event.button === 0,
  mouseUpEventVerifier: (event: MouseEvent): boolean => event.button === 0,
  movementThreshold: 10,
});
