import { TransformState } from "../transform-state";

export const calculateReverseMatrix = (
  matrix: TransformState,
): TransformState => {
  return {
    scale: 1 / matrix.scale,
    dx: -matrix.dx / matrix.scale,
    dy: -matrix.dy / matrix.scale,
  };
};
