const pi2 = Math.PI / 2;

export const verticalizeDirection = (direction: number): number => {
  return Math.sin(direction) > 0 ? pi2 : -pi2;
};
