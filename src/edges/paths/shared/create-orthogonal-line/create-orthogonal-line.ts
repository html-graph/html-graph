import { createHorizontalLine } from "../create-horizontal-line";
import { createVerticalLine } from "../create-vertical-line";
import { createHorizontalSourceOrthogonalLine } from "../create-horizontal-source-orthogonal-line";
import { Line, PortParams } from "../shared";
import { createVerticalSourceOrthogonalLine } from "../create-vertical-source-orthogonal-line";

export const createOrthogonalLine = (
  from: PortParams,
  to: PortParams,
): Line => {
  if (from.dir.y === 0) {
    if (to.dir.y === 0) {
      return createHorizontalLine(from, to);
    }

    return createHorizontalSourceOrthogonalLine(from, to);
  }

  if (to.dir.x === 0) {
    return createVerticalLine(from, to);
  }

  return createVerticalSourceOrthogonalLine(from, to);
};
