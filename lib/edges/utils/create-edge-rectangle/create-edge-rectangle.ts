import { Point } from "@/point";
import { EdgeRenderPort } from "../../edge-render-port";
import { EdgeRectangle } from "./edge-rectangle";

export const createEdgeRectangle = (
  source: EdgeRenderPort,
  target: EdgeRenderPort,
): EdgeRectangle => {
  const from: Point = {
    x: source.x + source.width / 2,
    y: source.y + source.height / 2,
  };

  const to: Point = {
    x: target.x + target.width / 2,
    y: target.y + target.height / 2,
  };

  const x = Math.min(from.x, to.x);
  const y = Math.min(from.y, to.y);
  const width = Math.abs(to.x - from.x);
  const height = Math.abs(to.y - from.y);

  const flipX = from.x <= to.x ? 1 : -1;
  const flipY = from.y <= to.y ? 1 : -1;

  return {
    x,
    y,
    width,
    height,
    flipX,
    flipY,
  };
};
