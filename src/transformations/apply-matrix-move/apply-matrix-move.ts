import { TransformState } from "@/viewport-store";

export const applyMatrixMove = (
  prevTransform: TransformState,
  dx: number,
  dy: number,
): TransformState => {
  /**
   * dx2 - translate x
   * dy2 - translate y
   *
   * direct transform
   *  s1  0   dx1     1   0   dx2
   *  0   s1  dy1     0   1   dy2
   *  0   0   1       0   0   1
   *
   * [s, dx, dy] = [s1, s * dx2 + dx1, s * dy2 + dy1]
   */

  return {
    scale: prevTransform.scale,
    x: prevTransform.x + prevTransform.scale * dx,
    y: prevTransform.y + prevTransform.scale * dy,
  };
};
