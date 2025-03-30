import { TransformState } from "../transform-state";

export const calculateReverseMatrix = (
  matrix: TransformState,
): TransformState => {
  return {
    scale: 1 / matrix.scale,
    x: -matrix.x / matrix.scale,
    y: -matrix.y / matrix.scale,
  };
};
