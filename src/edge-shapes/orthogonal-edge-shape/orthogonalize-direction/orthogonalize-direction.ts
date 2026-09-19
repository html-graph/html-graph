export const orthogonalizeDirection = (direction: number): number => {
  const adjDir = direction + Math.PI / 4;
  const adjCos = Math.cos(adjDir);
  const adjSin = Math.sin(adjDir);

  if (adjCos > 0) {
    if (adjSin > 0) {
      return 0;
    }

    return -Math.PI / 2;
  }

  if (adjSin > 0) {
    return Math.PI / 2;
  }

  return Math.PI;
};
