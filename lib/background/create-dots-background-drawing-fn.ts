import { PublicViewportTransformer } from "@/viewport-transformer";
import { BackgroundDrawingFn } from "./background-drawing-fn";

const dotsBackgroundDrawingFn: (
  ctx: CanvasRenderingContext2D,
  transformation: PublicViewportTransformer,
  dotColor: string,
  gap: number,
  radius: number,
  color: string,
) => void = (
  ctx: CanvasRenderingContext2D,
  transformation: PublicViewportTransformer,
  dotColor: string,
  gap: number,
  radius: number,
  color: string,
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const zeroViewCoords = transformation.getViewCoords(0, 0);
  const viewScale = transformation.getViewScale();
  const viewGap = gap * viewScale;

  let iterationsHorizontal = 0;
  let iterationsVertical = 0;
  let adjustedViewGap = viewGap / 2;

  do {
    adjustedViewGap *= 2;
    iterationsHorizontal = ctx.canvas.width / adjustedViewGap;
    iterationsVertical = ctx.canvas.height / adjustedViewGap;
  } while (iterationsHorizontal * iterationsVertical > 10000);

  const zeroOffsetX =
    zeroViewCoords[0] -
    Math.floor(zeroViewCoords[0] / adjustedViewGap) * adjustedViewGap;
  const zeroOffsetY =
    zeroViewCoords[1] -
    Math.floor(zeroViewCoords[1] / adjustedViewGap) * adjustedViewGap;

  const r = radius * viewScale;
  const pi2 = 2 * Math.PI;

  const xFrom = zeroOffsetX - adjustedViewGap;
  const yFrom = zeroOffsetY - adjustedViewGap;
  const xTo = ctx.canvas.width + zeroOffsetX;
  const yTo = ctx.canvas.height + zeroOffsetY;

  ctx.fillStyle = dotColor;

  for (let x = xFrom; x <= xTo; x += adjustedViewGap) {
    for (let y = yFrom; y <= yTo; y += adjustedViewGap) {
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
) => BackgroundDrawingFn = (
  dotColor: string,
  dotGap: number,
  dotRadius: number,
  color: string,
) => {
  return (
    ctx: CanvasRenderingContext2D,
    transformer: PublicViewportTransformer,
  ) => {
    dotsBackgroundDrawingFn(
      ctx,
      transformer,
      dotColor,
      dotGap,
      dotRadius,
      color,
    );
  };
};
