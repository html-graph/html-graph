import { PortParams, Line, transposePoint } from "../shared";
import { createHorizontalLine } from "../create-horizontal-line";

export const createVerticalLine = (from: PortParams, to: PortParams): Line => {
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

  const transposedLine = createHorizontalLine(transposedFrom, transposedTo);

  const line: Line = {
    points: transposedLine.points.map((p) => transposePoint(p)),
    midpoint: transposePoint(transposedLine.midpoint),
  };

  return line;
};
