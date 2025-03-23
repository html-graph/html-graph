import { TransformPayload } from "../../preprocessors";

export const move = (
  prevTransform: TransformPayload,
  dx: number,
  dy: number,
): TransformPayload => {
  /**
   * dx2 - traslate x
   * dy2 - traslate y
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
