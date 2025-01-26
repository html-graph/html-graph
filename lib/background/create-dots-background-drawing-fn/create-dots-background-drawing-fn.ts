import { AbstractPublicViewportTransformer } from "@/viewport-transformer";
import { BackgroundDrawingFn } from "../background-drawing-fn";

const dotsBackgroundDrawingFn: (
  ctx: CanvasRenderingContext2D,
  transformation: AbstractPublicViewportTransformer,
  dotColor: string,
  gap: number,
  radius: number,
  color: string,
  limit: number,
) => void = (
  ctx: CanvasRenderingContext2D,
  transformation: AbstractPublicViewportTransformer,
  dotColor: string,
  gap: number,
  radius: number,
  color: string,
  limit: number,
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const matrixContent = transformation.getContentMatrix();
  const viewGap = gap * matrixContent.scale;

  const iterationsHorizontal = ctx.canvas.width / viewGap;
  const iterationsVertical = ctx.canvas.height / viewGap;

  if (iterationsHorizontal * iterationsVertical > limit) {
    return;
  }

  const zeroOffsetX =
    matrixContent.dx - Math.floor(matrixContent.dx / viewGap) * viewGap;
  const zeroOffsetY =
    matrixContent.dy - Math.floor(matrixContent.dy / viewGap) * viewGap;

  const r = radius * matrixContent.scale;
  const pi2 = 2 * Math.PI;

  const xFrom = zeroOffsetX - viewGap;
  const yFrom = zeroOffsetY - viewGap;
  const xTo = ctx.canvas.width + zeroOffsetX;
  const yTo = ctx.canvas.height + zeroOffsetY;

  ctx.fillStyle = dotColor;

  for (let x = xFrom; x <= xTo; x += viewGap) {
    for (let y = yFrom; y <= yTo; y += viewGap) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, pi2);
      ctx.closePath();

      ctx.fill();
    }
  }
};

export const createDotsBackgroundDrawingFn: (
  dotColor: string,
  dotGap: number,
  dotRadius: number,
  color: string,
  limit: number,
) => BackgroundDrawingFn = (
  dotColor: string,
  dotGap: number,
  dotRadius: number,
  color: string,
  limit: number,
) => {
  return (
    ctx: CanvasRenderingContext2D,
    transformer: AbstractPublicViewportTransformer,
  ) => {
    dotsBackgroundDrawingFn(
      ctx,
      transformer,
      dotColor,
      dotGap,
      dotRadius,
      color,
      limit,
    );
  };
};
