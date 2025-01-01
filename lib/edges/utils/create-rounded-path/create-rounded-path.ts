import { Point } from "../../point";

export const createRoundedPath: (
  ps: readonly Point[],
  roundness: number,
) => string = (path: readonly Point[], roundness: number) => {
  const parts: string[] = [];

  if (path.length > 0) {
    parts.push(`M ${path[0][0]} ${path[0][1]}`);
  }

  if (path.length === 2) {
    parts.push(`L ${path[1][0]} ${path[1][1]}`);
  }

  if (path.length > 2) {
    const last = path.length - 1;
    let dxNext = 0;
    let dyNext = 0;
    let distanceNext = 0;

    path.forEach((point, i) => {
      let dxPrev = 0;
      let dyPrev = 0;
      let distancePrev = 0;

      const isNotFirst = i > 0;
      const isNotLast = i < last;
      const isMediate = isNotFirst && isNotLast;

      if (isNotFirst) {
        dxPrev = -dxNext;
        dyPrev = -dyNext;
        distancePrev = distanceNext;
      }

      if (isNotLast) {
        const nextPoint = path[i + 1];
        dxNext = nextPoint[0] - point[0];
        dyNext = nextPoint[1] - point[1];
        distanceNext = Math.sqrt(dxNext * dxNext + dyNext * dyNext);
      }

      const rNext = isMediate ? roundness : 0;
      const ratioNext = Math.min(rNext / distanceNext, i < last - 1 ? 0.5 : 1);
      const njp: Point = isMediate
        ? [point[0] + dxNext * ratioNext, point[1] + dyNext * ratioNext]
        : point;

      const rPrev = isMediate ? roundness : 0;
      const ratioPrev = Math.min(rPrev / distancePrev, i > 1 ? 0.5 : 1);
      const pjp: Point = isMediate
        ? [point[0] + dxPrev * ratioPrev, point[1] + dyPrev * ratioPrev]
        : point;

      if (i > 0) {
        parts.push(`L ${pjp[0]} ${pjp[1]}`);
      }

      if (isMediate) {
        parts.push(
          `C ${point[0]} ${point[1]} ${point[0]} ${point[1]} ${njp[0]} ${njp[1]}`,
        );
      }
    });
  }

  return parts.join(" ");
};
