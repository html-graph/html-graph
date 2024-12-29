import { Point } from "../../point";

export const createRoundedPath: (
  ps: readonly Point[],
  roundness: number,
  arrowGap: number,
) => string = (path: readonly Point[], roundness: number, arrowGap: number) => {
  const parts: string[] = [];
  console.log(arrowGap);

  if (path.length > 0) {
    parts.push(`M ${path[0][0]} ${path[0][1]}`);
  }

  if (path.length === 2) {
    parts.push(`L ${path[1][0]} ${path[1][1]}`);
  }

  if (path.length > 2) {
    const last = path.length - 1;
    let dxn = 0;
    let dyn = 0;
    let distanceNext = 0;

    path.forEach((p, i) => {
      let dxp = 0;
      let dyp = 0;
      let distancePrev = 0;

      if (i > 0) {
        dxp = -dxn;
        dyp = -dyn;
        distancePrev = distanceNext;
      }

      if (i < last) {
        const next = path[i + 1];
        dxn = next[0] - p[0];
        dyn = next[1] - p[1];
        distanceNext = Math.sqrt(dxn * dxn + dyn * dyn);
      }

      const isMediate = i > 0 && i < last;
      const r = isMediate ? roundness : 0;
      const ratioNext = r / distanceNext;
      const ratioPrev = r / distancePrev;

      const njp: Point = isMediate
        ? [p[0] + dxn * ratioNext, p[1] + dyn * ratioNext]
        : p;
      const pjp: Point = isMediate
        ? [p[0] + dxp * ratioPrev, p[1] + dyp * ratioPrev]
        : p;

      if (i > 0) {
        parts.push(`L ${pjp[0]} ${pjp[1]}`);
      }

      if (isMediate) {
        parts.push(`C ${p[0]} ${p[1]} ${p[0]} ${p[1]} ${njp[0]} ${njp[1]}`);
      }
    });
  }

  return parts.join(" ");
};
