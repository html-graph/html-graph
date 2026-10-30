import { createHorizontalSourceOrthogonalLinePoints } from "../create-horizontal-source-orthogonal-line";
import { PortParams, transposePoint } from "../shared";
import { Point } from "@/point";

export const createVerticalSourceOrthogonalLinePoints = (
  from: PortParams,
  to: PortParams,
): readonly Point[] => {
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

  const transposedLine = createHorizontalSourceOrthogonalLinePoints(
    transposedFrom,
    transposedTo,
  );

  return transposedLine.map((p) => transposePoint(p));
};
