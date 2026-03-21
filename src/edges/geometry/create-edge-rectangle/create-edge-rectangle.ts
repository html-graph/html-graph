import { Point } from "@/point";
import { EdgeRectangle } from "./edge-rectangle";
import { EdgeRenderPort } from "../../edge-render-port";

export const createEdgeRectangle = (
  source: EdgeRenderPort,
  target: EdgeRenderPort,
  padding: number,
): EdgeRectangle => {
  const from: Point = {
    x: source.x + source.width / 2,
    y: source.y + source.height / 2,
  };

  const to: Point = {
    x: target.x + target.width / 2,
    y: target.y + target.height / 2,
  };

  const x = Math.min(from.x, to.x) - padding;
  const y = Math.min(from.y, to.y) - padding;
  const doublePadding = 2 * padding;
  const width = Math.abs(to.x - from.x) + doublePadding;
  const height = Math.abs(to.y - from.y) + doublePadding;

  return {
    x,
    y,
    width,
    height,
    from: { x: from.x - x, y: from.y - y },
    to: { x: to.x - x, y: to.y - y },
  };
};
