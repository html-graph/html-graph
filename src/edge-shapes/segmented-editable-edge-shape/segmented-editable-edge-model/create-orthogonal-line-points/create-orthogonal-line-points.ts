import { Point } from "@/point";
import { PortParams } from "./shared";
import { createHorizontalLinePoints } from "./create-horizontal-line";
import { createHorizontalSourceOrthogonalLinePoints } from "./create-horizontal-source-orthogonal-line";
import { createVerticalSourceOrthogonalLinePoints } from "./create-vertical-source-orthogonal-line";
import { createVerticalLinePoints } from "./create-vertical-line";

export const createOrthogonalLinePoints = (
  from: PortParams,
  to: PortParams,
): readonly Point[] => {
  const isSourceHorizontal = Math.abs(from.dir.y) === 0;
  const isTargetHorizontal = Math.abs(to.dir.y) === 0;

  if (isSourceHorizontal) {
    if (isTargetHorizontal) {
      return createHorizontalLinePoints(from, to);
    }

    return createHorizontalSourceOrthogonalLinePoints(from, to);
  }

  if (isTargetHorizontal) {
    return createVerticalSourceOrthogonalLinePoints(from, to);
  }

  return createVerticalLinePoints(from, to);
};
