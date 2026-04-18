export const horizontalizeDirection = (direction: number): number => {
  return Math.cos(direction) > 0 ? 0 : Math.PI;
};
