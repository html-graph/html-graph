import { createHorizontalLine } from "../create-horizontal-line";
import { createVerticalLine } from "../create-vertical-line";
import { createHorizontalSourceOrthogonalLine } from "../create-horizontal-source-orthogonal-line";
import { Line, PortParams } from "../shared";
import { createVerticalSourceOrthogonalLine } from "../create-vertical-source-orthogonal-line";

export const createOrthogonalLine = (
  from: PortParams,
  to: PortParams,
): Line => {
  const isSourceHor = Math.abs(from.dir.y) < 1e-10;
  const isTargetHor = Math.abs(to.dir.y) < 1e-10;

  if (isSourceHor) {
    if (isTargetHor) {
      return createHorizontalLine(from, to);
    }

    return createHorizontalSourceOrthogonalLine(from, to);
  }

  if (!isTargetHor) {
    return createVerticalLine(from, to);
  }

  return createVerticalSourceOrthogonalLine(from, to);
};
