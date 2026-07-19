import { Point } from "@/point";
import { Part } from "./part";

export const calculateMidpoint = (points: readonly Point[]): Point => {
  const parts: Part[] = [];

  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1];
    const end = points[i];

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    parts.push({ start, end, distance });
  }

  const totalLength = parts.reduce((acc, cur) => acc + cur.distance, 0);
  const halfLength = totalLength / 2;

  let accLength = 0;

  for (const part of parts) {
    const nextAccLength = accLength + part.distance;

    if (nextAccLength >= halfLength) {
      const residue = halfLength - accLength;
      const { start, end, distance } = part;

      if (distance === 0) {
        continue;
      }

      const ratio = residue / distance;
      const dx = end.x - start.x;
      const dy = end.y - start.y;

      const midpoint: Point = {
        x: start.x + dx * ratio,
        y: start.y + dy * ratio,
      };

      return midpoint;
    }

    accLength = nextAccLength;
  }

  if (accLength === 0 && points.length > 0) {
    return points[0];
  }

  throw new Error("Failed to calculate midpoint");
};
