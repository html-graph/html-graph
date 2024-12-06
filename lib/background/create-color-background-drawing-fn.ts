import { BackgroundDrawingFn } from "./background-drawing-fn";

const colorBackgroundDrawingFn = (
  ctx: CanvasRenderingContext2D,
  color: string,
) => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const createColorBackgroundDrawingFn: (
  color: string,
) => BackgroundDrawingFn = (color: string) => {
  return (ctx: CanvasRenderingContext2D) => {
    colorBackgroundDrawingFn(ctx, color);
  };
};
