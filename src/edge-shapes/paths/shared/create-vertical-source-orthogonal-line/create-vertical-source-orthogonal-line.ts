import { Line, PortParams, transposePoint } from "../shared";
import { createHorizontalSourceOrthogonalLine } from "../create-horizontal-source-orthogonal-line";

export const createVerticalSourceOrthogonalLine = (
  from: PortParams,
  to: PortParams,
): Line => {
  const transposedFrom: PortParams = {
    arrowPoint: transposePoint(from.arrowPoint),
    linePoint: transposePoint(from.linePoint),
    dir: transposePoint(from.dir),
  };

  const transposedTo: PortParams = {
    arrowPoint: transposePoint(to.arrowPoint),
    linePoint: transposePoint(to.linePoint),
    dir: transposePoint(to.dir),
  };

  const transposedLine = createHorizontalSourceOrthogonalLine(
    transposedFrom,
    transposedTo,
  );

  const line: Line = {
    points: transposedLine.points.map((p) => transposePoint(p)),
    midpoint: transposePoint(transposedLine.midpoint),
  };

  return line;
};
