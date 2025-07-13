import { TransformPayload } from "../../transform-payload";

export const scale = (
  prevTransform: TransformPayload,
  s2: number,
  cx: number,
  cy: number,
): TransformPayload => {
  /**
   * s2 - scale
   * cx - scale center x
   * cy - scale center y
   *
   *  s1  0   dx1     s2  0   (1 - s2) * cx
   *  0   s1  dy1     0   s2  (1 - s2) * cy
   *  0   0   1       0   0   1
   *
   * [s, dx, dy] = [s1 * s2, s1 * (1 - s2) * cx + dx1, s1 * (1 - s2) * cy + dy1]
   */
  return {
    scale: prevTransform.scale * s2,
    x: prevTransform.scale * (1 - s2) * cx + prevTransform.x,
    y: prevTransform.scale * (1 - s2) * cy + prevTransform.y,
  };
};
