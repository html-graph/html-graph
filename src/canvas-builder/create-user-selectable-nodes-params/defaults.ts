export const defaults = Object.freeze({
  onNodeSelected: (): void => {},
  mouseDownEventVerifier: (event: MouseEvent): boolean => event.button === 0,
  mouseUpEventVerifier: (event: MouseEvent): boolean => event.button === 0,
  movementThreshold: 10,
});
