import { Point } from "@html-graph/html-graph";

export const createRoundedPath: (
  path: readonly Point[],
  roundness: number,
) => string = (path: readonly Point[], roundness: number) => {
  const parts: string[] = [];

  if (path.length > 0) {
    parts.push(`M ${path[0].x} ${path[0].y}`);
  }

  if (path.length === 2) {
    parts.push(`L ${path[1].x} ${path[1].y}`);
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
        dxNext = nextPoint.x - point.x;
        dyNext = nextPoint.y - point.y;
        distanceNext = Math.sqrt(dxNext * dxNext + dyNext * dyNext);
      }

      const rNext = isMediate ? roundness : 0;
      const ratioNext = Math.min(rNext / distanceNext, i < last - 1 ? 0.5 : 1);
      const njp: Point = isMediate
        ? { x: point.x + dxNext * ratioNext, y: point.y + dyNext * ratioNext }
        : point;

      const rPrev = isMediate ? roundness : 0;
      const ratioPrev = Math.min(rPrev / distancePrev, i > 1 ? 0.5 : 1);
      const pjp: Point = isMediate
        ? { x: point.x + dxPrev * ratioPrev, y: point.y + dyPrev * ratioPrev }
        : point;

      if (i > 0) {
        parts.push(`L ${pjp.x} ${pjp.y}`);
      }

      if (isMediate) {
        parts.push(
          `C ${point.x} ${point.y} ${point.x} ${point.y} ${njp.x} ${njp.y}`,
        );
      }
    });
  }

  return parts.join(" ");
};
